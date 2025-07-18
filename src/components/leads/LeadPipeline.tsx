import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadCard } from "./LeadCard";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { QuickActionModal } from "./QuickActionModal";
import { Lead } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Plus, BarChart3, RefreshCw } from "lucide-react";

const stages = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'nurturing', name: 'Nurturing', color: 'bg-purple-100 text-purple-800' },
  { id: 'converted', name: 'Converted', color: 'bg-green-100 text-green-800' },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 text-red-800' }
];

export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [quickActionLead, setQuickActionLead] = useState<Lead | null>(null);
  const [quickActionType, setQuickActionType] = useState<'email' | 'sms' | 'whatsapp' | 'schedule' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      // Transform Supabase data to Lead interface
      const transformedLeads: Lead[] = (data || []).map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        source: lead.source || 'unknown',
        stage: lead.stage || 'new',
        interests: lead.interests || '',
        notes: lead.notes || '',
        assigned_staff: lead.assigned_staff || 'Emily',
        conversion_probability: lead.conversion_probability || 50,
        estimated_value: lead.estimated_value || 0,
        created_at: lead.created_at,
        contacted_at: lead.contacted_at || null,
        converted_at: lead.converted_at || null
      }));

      setLeads(transformedLeads);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    
    // Set up real-time subscription for new leads
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        () => {
          console.log('New lead added, refreshing...');
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate stats from actual data
  const getStats = () => {
    const total = leads.length;
    const newThisWeek = leads.filter(lead => {
      const createdDate = new Date(lead.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;
    
    const converted = leads.filter(lead => lead.stage === 'converted').length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    const avgTimeToConvert = leads
      .filter(lead => lead.converted_at && lead.created_at)
      .reduce((sum, lead) => {
        const created = new Date(lead.created_at).getTime();
        const converted = new Date(lead.converted_at!).getTime();
        const days = Math.floor((converted - created) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / Math.max(converted, 1);

    return {
      total_leads: total,
      new_leads: newThisWeek,
      conversion_rate: conversionRate,
      avg_time_to_convert: Math.round(avgTimeToConvert)
    };
  };

  const stats = getStats();
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    const matchesStaff = staffFilter === "all" || lead.assigned_staff === staffFilter;
    
    return matchesSearch && matchesSource && matchesStaff;
  });

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleQuickAction = (leadId: string, action: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setQuickActionLead(lead);
      setQuickActionType(action as 'email' | 'sms' | 'whatsapp' | 'schedule');
    }
  };

  const handleQuickActionComplete = (leadId: string, action: string, data: any) => {
    console.log(`Quick action completed: ${action} for lead ${leadId}`, data);
    // TODO: Update lead with interaction data
    // In a real app, this would update the lead in the database
  };

  const handleCloseQuickAction = () => {
    setQuickActionLead(null);
    setQuickActionType(null);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Pipeline</h1>
            <p className="text-muted-foreground">Manage and track your studio leads</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={fetchLeads} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.total_leads}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.new_leads}</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.conversion_rate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.avg_time_to_convert}d</div>
              <div className="text-sm text-muted-foreground">Avg. Time to Convert</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="qr_code">QR Code</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                </SelectContent>
              </Select>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="Emily">Emily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Columns */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading leads...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter(lead => lead.stage === stage.id);
              
              return (
                <Card key={stage.id} className="h-fit min-h-[400px]">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{stage.name}</span>
                      <Badge className={stage.color}>
                        {stageLeads.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 max-h-[700px] overflow-y-auto">
                      {stageLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onViewDetails={handleViewDetails}
                          onQuickAction={handleQuickAction}
                        />
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                          <p className="text-sm">No leads in this stage</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <LeadDetailsModal 
            lead={selectedLead}
            onClose={handleCloseModal}
            onUpdate={() => {
              // TODO: Implement lead update
              console.log("Lead updated");
            }}
          />
        )}

        {/* Quick Action Modal */}
        <QuickActionModal
          lead={quickActionLead}
          action={quickActionType}
          onClose={handleCloseQuickAction}
          onComplete={handleQuickActionComplete}
        />
      </div>
    </div>
  );
}