import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Mail, MessageSquare, Clock, Users, Workflow } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CommunicationSequence {
  id: string;
  name: string;
  description: string | null;
  sequence_type: string;
  trigger_event: string;
  total_steps: number;
  is_active: boolean;
  created_at: string;
  target_customer_segment: string[] | null;
  target_lead_stage: string[] | null;
}

interface SequenceStep {
  id: string;
  sequence_id: string;
  step_number: number;
  template_id: string;
  delay_days: number;
  delay_hours: number;
  is_active: boolean;
  send_time: string | null;
}

export const SequenceManager = () => {
  const [sequences, setSequences] = useState<CommunicationSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<CommunicationSequence | null>(null);
  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSequence, setEditingSequence] = useState<CommunicationSequence | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const [newSequence, setNewSequence] = useState({
    name: "",
    description: "",
    sequence_type: "lead_nurture",
    trigger_event: "lead_created",
    target_customer_segment: [] as string[],
    target_lead_stage: [] as string[]
  });

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_sequences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSequences(data || []);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communication sequences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSequenceSteps = async (sequenceId: string) => {
    try {
      const { data, error } = await supabase
        .from('sequence_steps')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('step_number');

      if (error) throw error;
      setSequenceSteps(data || []);
    } catch (error) {
      console.error('Error fetching sequence steps:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sequence steps",
        variant: "destructive"
      });
    }
  };

  const handleCreateSequence = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_sequences')
        .insert([newSequence])
        .select()
        .single();

      if (error) throw error;

      setSequences([data, ...sequences]);
      setNewSequence({
        name: "",
        description: "",
        sequence_type: "lead_nurture",
        trigger_event: "lead_created",
        target_customer_segment: [],
        target_lead_stage: []
      });
      setShowCreateDialog(false);
      
      toast({
        title: "Success",
        description: "Communication sequence created successfully"
      });
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to create communication sequence",
        variant: "destructive"
      });
    }
  };

  const handleSelectSequence = (sequence: CommunicationSequence) => {
    setSelectedSequence(sequence);
    fetchSequenceSteps(sequence.id);
  };

  const toggleSequenceStatus = async (sequenceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('communication_sequences')
        .update({ is_active: !currentStatus })
        .eq('id', sequenceId);

      if (error) throw error;

      setSequences(sequences.map(seq => 
        seq.id === sequenceId ? { ...seq, is_active: !currentStatus } : seq
      ));
      
      toast({
        title: "Success",
        description: `Sequence ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error updating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to update sequence status",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading sequences...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sequences List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Communication Sequences</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Sequence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Sequence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Sequence Name</Label>
                    <Input
                      id="name"
                      value={newSequence.name}
                      onChange={(e) => setNewSequence({...newSequence, name: e.target.value})}
                      placeholder="Welcome sequence"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newSequence.description}
                      onChange={(e) => setNewSequence({...newSequence, description: e.target.value})}
                      placeholder="Describe this sequence..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Sequence Type</Label>
                    <Select value={newSequence.sequence_type} onValueChange={(value) => setNewSequence({...newSequence, sequence_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead_nurture">Lead Nurture</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="re_engagement">Re-engagement</SelectItem>
                        <SelectItem value="win_back">Win Back</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="trigger">Trigger Event</Label>
                    <Select value={newSequence.trigger_event} onValueChange={(value) => setNewSequence({...newSequence, trigger_event: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead_created">Lead Created</SelectItem>
                        <SelectItem value="first_class_attended">First Class Attended</SelectItem>
                        <SelectItem value="trial_started">Trial Started</SelectItem>
                        <SelectItem value="inactive_90_days">Inactive 90 Days</SelectItem>
                        <SelectItem value="membership_expiring">Membership Expiring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSequence}>
                      Create Sequence
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sequences.map((sequence) => (
              <div
                key={sequence.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSequence?.id === sequence.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelectSequence(sequence)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {sequence.sequence_type === 'lead_nurture' && <Users className="h-5 w-5 text-blue-500" />}
                    {sequence.sequence_type === 'welcome' && <Mail className="h-5 w-5 text-green-500" />}
                    {sequence.sequence_type === 're_engagement' && <MessageSquare className="h-5 w-5 text-orange-500" />}
                    {sequence.sequence_type === 'win_back' && <Clock className="h-5 w-5 text-red-500" />}
                    {sequence.sequence_type === 'promotional' && <Mail className="h-5 w-5 text-purple-500" />}
                    <div>
                      <h3 className="font-semibold">{sequence.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sequence.total_steps} steps • {sequence.trigger_event.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sequence.is_active ? 'default' : 'secondary'}>
                      {sequence.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={sequence.is_active}
                      onCheckedChange={() => toggleSequenceStatus(sequence.id, sequence.is_active)}
                    />
                  </div>
                </div>
                {sequence.description && (
                  <p className="text-sm text-muted-foreground mt-2">{sequence.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sequence Steps Editor */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedSequence ? `${selectedSequence.name} - Steps` : 'Select a Sequence'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSequence ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Sequence Steps</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage the timing and content of each step
                  </p>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
              
              {sequenceSteps.length > 0 ? (
                <div className="space-y-3">
                  {sequenceSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{step.step_number}</span>
                        </div>
                        <div>
                          <p className="font-medium">Step {step.step_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {step.delay_days > 0 && `${step.delay_days} days`}
                            {step.delay_hours > 0 && ` ${step.delay_hours} hours`}
                            {step.delay_days === 0 && step.delay_hours === 0 && 'Immediate'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={step.is_active ? 'default' : 'secondary'}>
                          {step.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No steps found for this sequence</p>
                  <Button className="mt-4" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Step
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a sequence to view and edit its steps</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};