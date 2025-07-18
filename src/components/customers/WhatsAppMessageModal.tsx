import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerMetrics {
  id: string;
  name: string;
  email: string;
  phone: string;
  marketing_text_opt_in: string;
  first_seen: string;
  calculated_status: string;
}

interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerMetrics | null;
}

// Message templates based on sequence stage
const getMessageTemplate = (stage: string, customerName: string) => {
  const firstName = customerName.split(' ')[0];
  
  const templates = {
    'Day 0': `Hi ${firstName}! Welcome to Tallo Yoga! 🧘‍♀️ I'm Emily, and I'm so excited you've joined our community. Your intro offer is now active - you can book classes through our app. Any questions about getting started?`,
    'Day 1': `Hi ${firstName}! How did your first class go yesterday? I'd love to hear your thoughts! Remember, you have unlimited access during your intro period. What type of class would you like to try next?`,
    'Day 3': `Hi ${firstName}! This is Emily from Tallo Yoga. How are you feeling after your first few classes? 💪 Pro tip: Try different instructors and class styles to find what you love most. Any favorites so far?`,
    'Day 7': `Hi ${firstName}! This is Emily from Tallo Yoga. I'm checking in to see how your first week with us went. Can I help you get booked in for your next class or answer any questions?`,
    'Day 14': `Hi ${firstName}! You're halfway through your intro offer - amazing! 🎉 How are you feeling? This is often when people start noticing real changes. What's been your favorite part so far?`,
    'Day 21': `Hi ${firstName}! Three weeks in - you're building such a great habit! 🌟 As you head into your final week, what questions do you have about membership options? I'm here to help!`,
    'Day 28': `Hi ${firstName}! Your intro period is almost complete. You've built such an incredible foundation! 💚 Would you like to chat about continuing your journey with us? I have some membership options that might be perfect for you.`,
    'Day 30+': `Hi ${firstName}! I hope you've loved your time with us. Your intro offer has ended, but I'd love to help you continue your practice. Can we schedule a quick call to discuss membership options that fit your schedule?`,
  };
  
  return templates[stage as keyof typeof templates] || templates['Day 0'];
};

// Get sequence stage based on signup date
const getSequenceStage = (firstSeen: string) => {
  if (!firstSeen) return 'Day 0';
  
  const signupDate = new Date(firstSeen);
  const daysSinceSignup = Math.floor((Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceSignup === 0) return 'Day 0';
  if (daysSinceSignup === 1) return 'Day 1';
  if (daysSinceSignup >= 2 && daysSinceSignup <= 4) return 'Day 3';
  if (daysSinceSignup >= 5 && daysSinceSignup <= 9) return 'Day 7';
  if (daysSinceSignup >= 10 && daysSinceSignup <= 17) return 'Day 14';
  if (daysSinceSignup >= 18 && daysSinceSignup <= 25) return 'Day 21';
  if (daysSinceSignup >= 26 && daysSinceSignup <= 30) return 'Day 28';
  if (daysSinceSignup > 30) return 'Day 30+';
  
  return 'Day 0';
};

// Get stage description
const getStageDescription = (stage: string) => {
  const descriptions = {
    'Day 0': 'Welcome - Just signed up',
    'Day 1': 'First day follow-up',
    'Day 3': 'Early engagement',
    'Day 7': 'Week 1 Check-in',
    'Day 14': 'Halfway Point',
    'Day 21': 'Week 3 Motivation',
    'Day 28': 'Final Push',
    'Day 30+': 'Conversion Ready',
  };
  
  return descriptions[stage as keyof typeof descriptions] || 'Welcome';
};

export function WhatsAppMessageModal({ isOpen, onClose, customer }: WhatsAppMessageModalProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  // Set message when customer changes
  React.useEffect(() => {
    if (customer) {
      const stage = getSequenceStage(customer.first_seen);
      const template = getMessageTemplate(stage, customer.name);
      setMessage(template);
    }
  }, [customer]);
  
  const handleSendMessage = async () => {
    if (!customer || !message.trim()) return;
    
    setSending(true);
    
    try {
      // Call the send-whatsapp edge function
      const { error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: customer.phone,
          message: message.trim(),
          customerName: customer.name,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message sent successfully!",
        description: `WhatsApp message sent to ${customer.name}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending the WhatsApp message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  if (!customer) return null;
  
  const stage = getSequenceStage(customer.first_seen);
  const stageDescription = getStageDescription(stage);
  const hasOptedIn = customer.marketing_text_opt_in === 'true' || customer.marketing_text_opt_in === '1';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Send WhatsApp Message
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="text-center">
            <h3 className="font-medium text-lg">{customer.name}</h3>
            <p className="text-muted-foreground">{customer.phone}</p>
          </div>
          
          {/* Sequence Stage */}
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium">{stage} - {stageDescription}</span>
          </div>
          
          {/* Opt-in Status */}
          <div className="text-center">
            {hasOptedIn ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Customer has opted in to text messages
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Customer has not opted in to text messages
              </Badge>
            )}
          </div>
          
          {/* Message Template */}
          <div className="space-y-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              className="min-h-[120px] resize-none"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sending || !message.trim() || !hasOptedIn}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send WhatsApp Message'}
            </Button>
          </div>
          
          {!hasOptedIn && (
            <p className="text-xs text-muted-foreground text-center">
              Message cannot be sent - customer has not opted in to text messages
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}