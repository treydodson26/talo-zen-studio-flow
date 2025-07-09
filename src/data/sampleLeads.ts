import { Lead } from "@/types/leads";

export const sampleLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    source: "qr_code",
    stage: "new",
    created_at: "2024-01-15T10:30:00Z",
    last_contact: null,
    assigned_staff: "Emily",
    notes: "Interested in morning vinyasa classes. Mentioned previous yoga experience.",
    interests: ["vinyasa", "morning_classes"],
    sequence_status: "welcome",
    next_followup: "2024-01-15T14:30:00Z",
    conversion_probability: 75
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    source: "google",
    stage: "contacted",
    created_at: "2024-01-14T09:15:00Z",
    last_contact: "2024-01-14T16:20:00Z",
    assigned_staff: "Emily",
    notes: "Complete beginner, looking for stress relief. Works long hours.",
    interests: ["beginner", "stress_relief", "evening_classes"],
    sequence_status: "welcome",
    next_followup: "2024-01-16T18:00:00Z",
    conversion_probability: 60
  },
  {
    id: "3",
    name: "Lisa Martinez",
    email: "lisa.martinez@email.com",
    phone: "(555) 345-6789",
    source: "referral",
    stage: "nurturing",
    created_at: "2024-01-10T14:45:00Z",
    last_contact: "2024-01-12T11:30:00Z",
    assigned_staff: "Emily",
    notes: "Referred by existing member Jessica. Interested in prenatal yoga.",
    interests: ["prenatal", "gentle_yoga"],
    sequence_status: "nurture",
    next_followup: "2024-01-17T10:00:00Z",
    conversion_probability: 85
  },
  {
    id: "4",
    name: "David Park",
    email: "david.park@email.com",
    phone: "(555) 456-7890",
    source: "walk_in",
    stage: "converted",
    created_at: "2024-01-08T13:20:00Z",
    last_contact: "2024-01-13T15:45:00Z",
    assigned_staff: "Emily",
    notes: "Converted! Purchased unlimited monthly package. Loves power yoga.",
    interests: ["power_yoga", "fitness"],
    sequence_status: "completed",
    next_followup: null,
    conversion_probability: 100
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "(555) 567-8901",
    source: "social_media",
    stage: "lost",
    created_at: "2024-01-05T16:10:00Z",
    last_contact: "2024-01-12T09:15:00Z",
    assigned_staff: "Emily",
    notes: "No response to multiple follow-ups. Marked as lost.",
    interests: ["meditation", "mindfulness"],
    sequence_status: "completed",
    next_followup: null,
    conversion_probability: 0
  },
  {
    id: "6",
    name: "James Anderson",
    email: "james.anderson@email.com",
    phone: "(555) 678-9012",
    source: "qr_code",
    stage: "new",
    created_at: "2024-01-15T11:45:00Z",
    last_contact: null,
    assigned_staff: "Emily",
    notes: "New lead from QR code scan. No additional info yet.",
    interests: [],
    sequence_status: "welcome",
    next_followup: "2024-01-15T15:45:00Z",
    conversion_probability: 50
  },
  {
    id: "7",
    name: "Rachel Thompson",
    email: "rachel.thompson@email.com",
    phone: "(555) 789-0123",
    source: "google",
    stage: "contacted",
    created_at: "2024-01-13T08:30:00Z",
    last_contact: "2024-01-14T10:20:00Z",
    assigned_staff: "Emily",
    notes: "Responded to welcome email. Interested in restorative yoga.",
    interests: ["restorative", "relaxation"],
    sequence_status: "welcome",
    next_followup: "2024-01-16T17:00:00Z",
    conversion_probability: 70
  },
  {
    id: "8",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    phone: "(555) 890-1234",
    source: "referral",
    stage: "nurturing",
    created_at: "2024-01-11T12:15:00Z",
    last_contact: "2024-01-14T14:30:00Z",
    assigned_staff: "Emily",
    notes: "Attended trial class. Considering membership options.",
    interests: ["trial_completed", "membership"],
    sequence_status: "nurture",
    next_followup: "2024-01-18T09:00:00Z",
    conversion_probability: 90
  },
  {
    id: "9",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "(555) 901-2345",
    source: "walk_in",
    stage: "contacted",
    created_at: "2024-01-12T15:45:00Z",
    last_contact: "2024-01-13T11:15:00Z",
    assigned_staff: "Emily",
    notes: "Walked in asking about classes. Sent welcome package.",
    interests: ["schedule_info", "pricing"],
    sequence_status: "welcome",
    next_followup: "2024-01-16T12:00:00Z",
    conversion_probability: 65
  },
  {
    id: "10",
    name: "Kevin Lee",
    email: "kevin.lee@email.com",
    phone: "(555) 012-3456",
    source: "social_media",
    stage: "nurturing",
    created_at: "2024-01-09T10:20:00Z",
    last_contact: "2024-01-13T16:45:00Z",
    assigned_staff: "Emily",
    notes: "Engaged with social media posts. Interested in men's yoga classes.",
    interests: ["mens_yoga", "community"],
    sequence_status: "nurture",
    next_followup: "2024-01-17T19:00:00Z",
    conversion_probability: 55
  }
];

export const getLeadsByStage = (stage: string) => {
  return sampleLeads.filter(lead => lead.stage === stage);
};

export const getLeadStats = () => {
  const total = sampleLeads.length;
  const newLeads = sampleLeads.filter(lead => lead.stage === 'new').length;
  const converted = sampleLeads.filter(lead => lead.stage === 'converted').length;
  const conversionRate = (converted / total) * 100;
  
  const sources = sampleLeads.reduce((acc, lead) => {
    const source = lead.source;
    if (!acc[source]) {
      acc[source] = { count: 0, conversion_rate: 0 };
    }
    acc[source].count++;
    return acc;
  }, {} as Record<string, { count: number; conversion_rate: number }>);

  // Calculate conversion rates by source
  Object.keys(sources).forEach(source => {
    const sourceLeads = sampleLeads.filter(lead => lead.source === source);
    const sourceConverted = sourceLeads.filter(lead => lead.stage === 'converted').length;
    sources[source].conversion_rate = (sourceConverted / sourceLeads.length) * 100;
  });

  return {
    total_leads: total,
    new_leads: newLeads,
    conversion_rate: conversionRate,
    avg_time_to_convert: 12, // days
    sources
  };
};