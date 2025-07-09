import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Calendar, Send, Clock } from "lucide-react";
import { Lead } from "@/types/leads";

interface QuickActionModalProps {
  lead: Lead | null;
  action: 'email' | 'sms' | 'schedule' | null;
  onClose: () => void;
  onComplete: (leadId: string, action: string, data: any) => void;
}

const emailTemplates = {
  welcome: {
    subject: "Welcome to Talo Yoga Studio - Let's Begin Your Journey!",
    body: `Hi {{name}},

Thank you for your interest in Talo Yoga Studio! We're thrilled to help you begin your yoga journey.

Our studio offers a variety of classes designed for all levels, from gentle restorative sessions to energizing power yoga. We believe yoga is for everyone, and we can't wait to help you find your perfect practice.

Here's what we'd love to offer you:
• Free 30-minute consultation to discuss your goals
• 20% off your first class package
• Complimentary yoga mat for your first month

Would you like to schedule a quick call this week to learn more about our classes and find the perfect fit for you?

Looking forward to connecting soon!

Namaste,
Emily & The Talo Yoga Team`
  },
  followup: {
    subject: "Following up on your yoga journey",
    body: `Hi {{name}},

I hope this message finds you well! I wanted to follow up on your interest in joining our yoga community at Talo Yoga Studio.

I know choosing the right studio can feel overwhelming, so I'm here to answer any questions you might have about our classes, instructors, or community.

Would you like to schedule a brief call or come by for a studio tour? I'd love to show you around and help you find the perfect class to start with.

Let me know what works best for you!

Warm regards,
Emily`
  }
};

const smsTemplates = {
  welcome: "Hi {{name}}! Thanks for your interest in Talo Yoga Studio. I'm Emily, the owner. Would you like to schedule a quick call this week to discuss your yoga goals? Text me back your availability! 🧘‍♀️",
  followup: "Hi {{name}}! Just checking in - any questions about our yoga classes? I'd love to help you get started. Reply anytime! - Emily",
  reminder: "Hi {{name}}! Don't forget about our 20% new student discount. Ready to book your first class? Let me know! 🌟 - Emily"
};

export function QuickActionModal({ lead, action, onClose, onComplete }: QuickActionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Email fields
    to: lead?.email || '',
    subject: '',
    body: '',
    template: 'welcome',
    // SMS fields
    phone: lead?.phone || '',
    message: '',
    smsTemplate: 'welcome',
    // Schedule fields
    followupDate: '',
    followupTime: '',
    followupType: 'call',
    notes: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onComplete(lead!.id, action!, formData);
      onClose();
      
      const actionText = action === 'email' ? 'Email sent' : 
                        action === 'sms' ? 'SMS sent' : 
                        'Follow-up scheduled';
      
      toast({
        title: "Success!",
        description: `${actionText} to ${lead?.name}`,
      });
    }, 1000);
  };

  const handleTemplateChange = (templateKey: string) => {
    if (action === 'email') {
      const template = emailTemplates[templateKey as keyof typeof emailTemplates];
      setFormData(prev => ({
        ...prev,
        template: templateKey,
        subject: template.subject,
        body: template.body.replace('{{name}}', lead?.name || '')
      }));
    } else if (action === 'sms') {
      const template = smsTemplates[templateKey as keyof typeof smsTemplates];
      setFormData(prev => ({
        ...prev,
        smsTemplate: templateKey,
        message: template.replace('{{name}}', lead?.name || '')
      }));
    }
  };

  if (!lead || !action) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {action === 'email' && <Mail className="h-5 w-5" />}
            {action === 'sms' && <MessageSquare className="h-5 w-5" />}
            {action === 'schedule' && <Calendar className="h-5 w-5" />}
            <span>
              {action === 'email' && 'Send Email'}
              {action === 'sms' && 'Send SMS'}
              {action === 'schedule' && 'Schedule Follow-up'}
            </span>
            <span className="text-muted-foreground">to {lead.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {action === 'email' && (
            <>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={formData.template} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="followup">Follow-up Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  value={formData.to}
                  onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  rows={8}
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  required
                />
              </div>
            </>
          )}

          {action === 'sms' && (
            <>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={formData.smsTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome SMS</SelectItem>
                    <SelectItem value="followup">Follow-up SMS</SelectItem>
                    <SelectItem value="reminder">Reminder SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  maxLength={160}
                />
                <div className="text-sm text-muted-foreground text-right">
                  {formData.message.length}/160
                </div>
              </div>
            </>
          )}

          {action === 'schedule' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followupDate">Follow-up Date</Label>
                  <Input
                    id="followupDate"
                    type="date"
                    value={formData.followupDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, followupDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followupTime">Time</Label>
                  <Input
                    id="followupTime"
                    type="time"
                    value={formData.followupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, followupTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Follow-up Type</Label>
                <Select value={formData.followupType} onValueChange={(value) => setFormData(prev => ({ ...prev, followupType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this follow-up..."
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {action === 'email' ? 'Sending...' : 
                   action === 'sms' ? 'Sending...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  {action === 'schedule' ? <Calendar className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  {action === 'email' ? 'Send Email' : 
                   action === 'sms' ? 'Send SMS' : 'Schedule Follow-up'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}