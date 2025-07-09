import { useState } from "react";
import { Lead } from "@/types/leads";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  Plus,
  Edit,
  Target,
  Activity
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

const sourceLabels = {
  qr_code: "QR Code",
  google: "Google", 
  referral: "Referral",
  walk_in: "Walk-in",
  social_media: "Social Media"
};

const stageLabels = {
  new: "New",
  contacted: "Contacted",
  nurturing: "Nurturing", 
  converted: "Converted",
  lost: "Lost"
};

// Sample interaction data
const sampleInteractions = [
  {
    id: "1",
    lead_id: "1",
    type: "email" as const,
    content: "Welcome email sent with studio intro and class schedule",
    timestamp: "2024-01-15T10:35:00Z",
    staff_member: "Emily",
    opened: true,
    clicked: false
  },
  {
    id: "2", 
    lead_id: "1",
    type: "sms" as const,
    content: "Personalized SMS with first-class discount code",
    timestamp: "2024-01-15T12:20:00Z",
    staff_member: "Emily",
    opened: true
  },
  {
    id: "3",
    lead_id: "1", 
    type: "note" as const,
    content: "Called to follow up on welcome email. Very interested in morning classes.",
    timestamp: "2024-01-15T14:15:00Z",
    staff_member: "Emily"
  }
];

export function LeadDetailsModal({ lead, onClose, onUpdate }: LeadDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);
  const [newNote, setNewNote] = useState("");

  const daysInPipeline = Math.floor(
    (new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSave = () => {
    onUpdate(editedLead);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // TODO: Add note to interactions
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action} for lead ${lead.id}`);
    // TODO: Implement quick actions
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span>{lead.name}</span>
              <Badge variant="outline">{sourceLabels[lead.source]}</Badge>
              <Badge variant="outline">{stageLabels[lead.stage]}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Lead created {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })} • 
            {daysInPipeline} days in pipeline
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedLead.name}
                        onChange={(e) => setEditedLead({...editedLead, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedLead.email}
                        onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedLead.phone}
                        onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage">Stage</Label>
                      <Select 
                        value={editedLead.stage} 
                        onValueChange={(value) => setEditedLead({...editedLead, stage: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stageLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Assigned to: {lead.assigned_staff}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>Conversion probability: {lead.conversion_probability}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interests & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lead.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedLead.notes}
                      onChange={(e) => setEditedLead({...editedLead, notes: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      {lead.notes || "No notes added yet."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Communication History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleInteractions.map((interaction) => (
                    <div key={interaction.id} className="border-l-2 border-primary/20 pl-4 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {interaction.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {interaction.type === 'sms' && <MessageSquare className="h-4 w-4 text-green-600" />}
                          {interaction.type === 'note' && <Edit className="h-4 w-4 text-purple-600" />}
                          <span className="text-sm font-medium capitalize">{interaction.type}</span>
                          {interaction.opened && (
                            <Badge variant="secondary" className="text-xs">
                              {interaction.type === 'email' ? 'Opened' : 'Delivered'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(interaction.timestamp), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{interaction.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">By {interaction.staff_member}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction('email')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction('sms')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction('schedule')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('convert')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convert to Customer
                </Button>
              </CardContent>
            </Card>

            {/* Sequence Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sequence Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current:</span>
                    <Badge variant="outline">{lead.sequence_status}</Badge>
                  </div>
                  {lead.next_followup && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Next:</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(lead.next_followup), 'MMM dd, h:mm a')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Add a note about this lead..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  className="w-full"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}