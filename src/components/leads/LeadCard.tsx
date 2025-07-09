import { Lead } from "@/types/leads";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, Calendar, User, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  onQuickAction: (leadId: string, action: string) => void;
}

const sourceLabels = {
  qr_code: "QR Code",
  google: "Google",
  referral: "Referral", 
  walk_in: "Walk-in",
  social_media: "Social Media"
};

const sourceColors = {
  qr_code: "bg-blue-100 text-blue-800",
  google: "bg-green-100 text-green-800",
  referral: "bg-purple-100 text-purple-800",
  walk_in: "bg-orange-100 text-orange-800",
  social_media: "bg-pink-100 text-pink-800"
};

const sequenceColors = {
  welcome: "bg-primary/20 text-primary",
  nurture: "bg-accent/20 text-accent-foreground",
  completed: "bg-green-100 text-green-800",
  none: "bg-muted text-muted-foreground"
};

export function LeadCard({ lead, onViewDetails, onQuickAction }: LeadCardProps) {
  const daysInPipeline = Math.floor(
    (new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-soft transition-shadow bg-card border-border/50"
      onClick={() => onViewDetails(lead)}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground text-base">{lead.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{lead.email}</p>
            </div>
            <Badge className={sourceColors[lead.source]}>
              {sourceLabels[lead.source]}
            </Badge>
          </div>

          {/* Pipeline Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{daysInPipeline} days</span>
            </div>
            <div className="text-primary font-medium">
              {lead.conversion_probability}% likely
            </div>
          </div>

          {/* Next Follow-up */}
          {lead.next_followup && (
            <div className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-md">
              Next: {format(new Date(lead.next_followup), 'MMM dd, h:mm a')}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(lead.id, 'email');
              }}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(lead.id, 'sms');
              }}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(lead.id, 'schedule');
              }}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}