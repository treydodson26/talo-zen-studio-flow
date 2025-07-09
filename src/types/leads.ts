export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  interests: string;
  notes: string;
  assigned_staff: string;
  conversion_probability: number;
  estimated_value: number;
  created_at: string;
  contacted_at?: string | null;
  converted_at?: string | null;
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