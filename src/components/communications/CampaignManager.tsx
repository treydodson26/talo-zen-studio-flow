import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Send, Calendar as CalendarIcon, Users, TrendingUp, Mail, MessageSquare, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface MarketingCampaign {
  id: string;
  name: string;
  campaign_type: string;
  subject_line: string;
  content_text: string | null;
  content_html: string | null;
  status: string;
  scheduled_send_date: string | null;
  actual_send_date: string | null;
  target_segments: string[] | null;
  target_tags: string[] | null;
  created_at: string;
  track_opens: boolean;
  track_clicks: boolean;
}

interface CampaignPerformance {
  campaign_id: string;
  total_recipients: number;
  emails_sent: number;
  emails_delivered: number;
  total_opens: number;
  total_clicks: number;
  open_rate: number;
  click_rate: number;
}

export const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sendDate, setSendDate] = useState<Date>();
  const { toast } = useToast();

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    campaign_type: "email",
    subject_line: "",
    content_text: "",
    content_html: "",
    target_segments: [] as string[],
    target_tags: [] as string[],
    scheduled_send_date: null as string | null,
    send_immediately: false,
    track_opens: true,
    track_clicks: true
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaignPerformance = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_performance')
        .select('*')
        .eq('campaign_id', campaignId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCampaignPerformance(data || null);
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      setCampaignPerformance(null);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const campaignData = {
        ...newCampaign,
        scheduled_send_date: sendDate ? sendDate.toISOString() : null
      };

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      setNewCampaign({
        name: "",
        campaign_type: "email",
        subject_line: "",
        content_text: "",
        content_html: "",
        target_segments: [],
        target_tags: [],
        scheduled_send_date: null,
        send_immediately: false,
        track_opens: true,
        track_clicks: true
      });
      setSendDate(undefined);
      setShowCreateDialog(false);
      
      toast({
        title: "Success",
        description: "Campaign created successfully"
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  };

  const handleSelectCampaign = (campaign: MarketingCampaign) => {
    setSelectedCampaign(campaign);
    if (campaign.status === 'sent') {
      fetchCampaignPerformance(campaign.id);
    }
  };

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .update({ 
          status: newStatus,
          actual_send_date: newStatus === 'sent' ? new Date().toISOString() : null
        })
        .eq('id', campaignId);

      if (error) throw error;

      setCampaigns(campaigns.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: newStatus, actual_send_date: newStatus === 'sent' ? new Date().toISOString() : null }
          : campaign
      ));
      
      toast({
        title: "Success",
        description: `Campaign ${newStatus} successfully`
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'default';
      case 'sending': return 'default';
      case 'sent': return 'secondary';
      case 'paused': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'sending': return <Send className="h-4 w-4" />;
      case 'sent': return <TrendingUp className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading campaigns...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Marketing Campaigns</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        placeholder="Summer Workshop Promotion"
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaign-type">Campaign Type</Label>
                      <Select value={newCampaign.campaign_type} onValueChange={(value) => setNewCampaign({...newCampaign, campaign_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {newCampaign.campaign_type === 'email' && (
                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={newCampaign.subject_line}
                        onChange={(e) => setNewCampaign({...newCampaign, subject_line: e.target.value})}
                        placeholder="☀️ Summer Unlimited Yoga - Special Offer!"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="content">Campaign Content</Label>
                    <Textarea
                      id="content"
                      value={newCampaign.content_text}
                      onChange={(e) => setNewCampaign({...newCampaign, content_text: e.target.value})}
                      placeholder="Hi {{first_name}}, we have an exciting offer for you..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Target Segments</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select segments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stanford_students">Stanford Students</SelectItem>
                          <SelectItem value="young_professionals">Young Professionals</SelectItem>
                          <SelectItem value="prenatal">Prenatal</SelectItem>
                          <SelectItem value="seniors">Seniors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Send Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {sendDate ? format(sendDate, 'MMM d, yyyy') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={sendDate}
                            onSelect={setSendDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="send-immediately"
                        checked={newCampaign.send_immediately}
                        onCheckedChange={(checked) => setNewCampaign({...newCampaign, send_immediately: checked})}
                      />
                      <Label htmlFor="send-immediately">Send immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="track-opens"
                        checked={newCampaign.track_opens}
                        onCheckedChange={(checked) => setNewCampaign({...newCampaign, track_opens: checked})}
                      />
                      <Label htmlFor="track-opens">Track opens</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign}>
                      Create Campaign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCampaign?.id === campaign.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelectCampaign(campaign)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {campaign.campaign_type === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
                    {campaign.campaign_type === 'sms' && <MessageSquare className="h-5 w-5 text-green-500" />}
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.campaign_type} • {campaign.scheduled_send_date ? 
                          format(new Date(campaign.scheduled_send_date), 'MMM d, yyyy') : 
                          'No date set'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(campaign.status || 'draft')}>
                      {getStatusIcon(campaign.status || 'draft')}
                      <span className="ml-1">{campaign.status || 'draft'}</span>
                    </Badge>
                  </div>
                </div>
                {campaign.subject_line && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Subject: {campaign.subject_line}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCampaign ? selectedCampaign.name : 'Select a Campaign'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCampaign ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedCampaign.campaign_type}</Badge>
                  <Badge variant={getStatusColor(selectedCampaign.status || 'draft')}>
                    {selectedCampaign.status || 'draft'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCampaign.status === 'draft' && (
                    <Button size="sm" onClick={() => updateCampaignStatus(selectedCampaign.id, 'sent')}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </Button>
                  )}
                  {selectedCampaign.status === 'scheduled' && (
                    <Button variant="outline" size="sm" onClick={() => updateCampaignStatus(selectedCampaign.id, 'paused')}>
                      Pause
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {selectedCampaign.subject_line && (
                  <div>
                    <Label>Subject Line</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCampaign.subject_line}</p>
                  </div>
                )}
                
                <div>
                  <Label>Campaign Content</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedCampaign.content_text}</p>
                  </div>
                </div>
                
                {selectedCampaign.scheduled_send_date && (
                  <div>
                    <Label>Scheduled Send Date</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(selectedCampaign.scheduled_send_date), 'PPP p')}
                    </p>
                  </div>
                )}

                {campaignPerformance && (
                  <div className="mt-6">
                    <Label>Campaign Performance</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Recipients</span>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold">{campaignPerformance.total_recipients}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Open Rate</span>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold">{campaignPerformance.open_rate}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a campaign to view details and performance</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};