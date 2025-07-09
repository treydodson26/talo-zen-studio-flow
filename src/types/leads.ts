export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'qr_code' | 'google' | 'referral' | 'walk_in' | 'social_media';
  stage: 'new' | 'contacted' | 'nurturing' | 'converted' | 'lost';
  created_at: string;
  last_contact: string | null;
  assigned_staff: string;
  notes: string;
  interests: string[];
  sequence_status: 'welcome' | 'nurture' | 'completed' | 'none';
  next_followup: string | null;
  conversion_probability: number;
}

export interface LeadInteraction {
  id: string;
  lead_id: string;
  type: 'email' | 'sms' | 'call' | 'note' | 'class_attended';
  content: string;
  timestamp: string;
  staff_member: string;
  opened?: boolean;
  clicked?: boolean;
}

export interface LeadStats {
  total_leads: number;
  new_leads: number;
  conversion_rate: number;
  avg_time_to_convert: number;
  sources: {
    [key: string]: {
      count: number;
      conversion_rate: number;
    };
  };
}