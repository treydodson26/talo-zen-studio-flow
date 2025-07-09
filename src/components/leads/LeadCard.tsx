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
      className="mb-3 cursor-pointer hover:shadow-soft transition-shadow bg-card border-border/50"
      onClick={() => onViewDetails(lead)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-card-foreground">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge className={sourceColors[lead.source]}>
                {sourceLabels[lead.source]}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {daysInPipeline}d
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {lead.phone}
            </div>
            <div className="flex items-center text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {lead.assigned_staff}
            </div>
          </div>

          {/* Sequence Status */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={sequenceColors[lead.sequence_status]}>
              {lead.sequence_status === 'welcome' && 'Welcome Sequence'}
              {lead.sequence_status === 'nurture' && 'Nurture Sequence'}
              {lead.sequence_status === 'completed' && 'Completed'}
              {lead.sequence_status === 'none' && 'No Sequence'}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {lead.conversion_probability}% likely
            </div>
          </div>

          {/* Last Contact */}
          {lead.last_contact && (
            <div className="text-xs text-muted-foreground">
              Last contact: {formatDistanceToNow(new Date(lead.last_contact), { addSuffix: true })}
            </div>
          )}

          {/* Next Follow-up */}
          {lead.next_followup && (
            <div className="text-xs text-primary">
              Next follow-up: {format(new Date(lead.next_followup), 'MMM dd, h:mm a')}
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
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(lead.id, 'sms');
              }}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              SMS
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction(lead.id, 'schedule');
              }}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}