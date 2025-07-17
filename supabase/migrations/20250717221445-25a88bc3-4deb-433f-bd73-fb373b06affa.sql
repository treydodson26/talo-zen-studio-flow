-- Create message_templates table
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_day INTEGER NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('email', 'sms', 'whatsapp')),
  subject TEXT,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_log table
CREATE TABLE public.message_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  template_id UUID REFERENCES public.message_templates(id),
  sequence_day INTEGER NOT NULL,
  message_type TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  external_message_id TEXT
);

-- Create function to calculate days in sequence
CREATE OR REPLACE FUNCTION public.get_client_sequence_day(client_id UUID)
RETURNS INTEGER AS $$
DECLARE
  start_date DATE;
  current_day INTEGER;
BEGIN
  SELECT COALESCE(intro_period_start, first_seen) INTO start_date
  FROM public.clients WHERE id = client_id;
  
  current_day := EXTRACT(DAY FROM (CURRENT_DATE - start_date));
  
  RETURN GREATEST(0, current_day);
END;
$$ LANGUAGE plpgsql;

-- Create function to get pending messages
CREATE OR REPLACE FUNCTION public.get_pending_messages()
RETURNS TABLE (
  client_id UUID,
  client_name TEXT,
  first_name TEXT,
  sequence_day INTEGER,
  days_since_start INTEGER,
  required_messages JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH client_days AS (
    SELECT 
      c.id,
      c.client_name,
      c.first_name,
      c.client_email,
      c.phone_number,
      EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen)))::INTEGER as days_since_start
    FROM public.clients c
    WHERE c.intro_period_active = true
      AND COALESCE(c.intro_period_start, c.first_seen) >= CURRENT_DATE - INTERVAL '30 days'
  ),
  required_messages AS (
    SELECT 
      cd.*,
      mt.sequence_day,
      mt.message_type,
      mt.id as template_id
    FROM client_days cd
    CROSS JOIN public.message_templates mt
    WHERE mt.sequence_day <= cd.days_since_start
      AND mt.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM public.message_log ml 
        WHERE ml.client_id = cd.id 
          AND ml.sequence_day = mt.sequence_day
          AND ml.message_type = mt.message_type
      )
  )
  SELECT 
    rm.id,
    rm.client_name,
    rm.first_name,
    rm.sequence_day,
    rm.days_since_start,
    jsonb_agg(
      jsonb_build_object(
        'template_id', rm.template_id,
        'message_type', rm.message_type,
        'sequence_day', rm.sequence_day
      )
    ) as required_messages
  FROM required_messages rm
  GROUP BY rm.id, rm.client_name, rm.first_name, rm.sequence_day, rm.days_since_start;
END;
$$ LANGUAGE plpgsql;

-- Create client dashboard view
CREATE VIEW public.client_dashboard AS
SELECT 
  c.*,
  EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen)))::INTEGER as days_since_start,
  CASE 
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen))) BETWEEN 0 AND 6 THEN 'Week 1'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen))) BETWEEN 7 AND 13 THEN 'Week 2'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen))) BETWEEN 14 AND 21 THEN 'Week 3'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c.first_seen))) BETWEEN 22 AND 30 THEN 'Week 4'
    ELSE 'Completed'
  END as sequence_stage,
  (
    SELECT COUNT(*) 
    FROM public.message_log ml 
    WHERE ml.client_id = c.id
  ) as messages_sent
FROM public.clients c
WHERE c.intro_period_active = true
ORDER BY COALESCE(c.intro_period_start, c.first_seen) DESC;

-- Insert seed data for message templates
INSERT INTO public.message_templates (sequence_day, message_type, subject, content) VALUES
(0, 'email', 'Welcome to Talo Yoga🌿', 'Hi [First Name],

Welcome to Talo Yoga! We''re so excited that you decided to join us for an introductory month. Over the next 30 days, you''ll have unlimited access to all of our classes, and we''re here to support you every step of the way.

Here''s what to expect:
• Access to all yoga classes and workshops
• Personal guidance from our experienced instructors
• A welcoming community of like-minded practitioners
• Flexible scheduling to fit your lifestyle

Your journey starts now! Book your first class through our app or website, and don''t hesitate to reach out if you have any questions.

Namaste,
The Talo Yoga Team 🌿'),

(7, 'sms', NULL, 'Hi [First Name]! This is Emily from Talo Yoga. I''m checking in to see how your first week with us went. Can I help you get booked in for your next class or answer any questions? When you reply, you''ll go straight to my phone- not a robot!'),

(10, 'email', 'A Little About Talo Yoga 🌿 — and How to Make the Most of Your Intro', 'Hi [First Name],

We''re so glad you''ve stepped into the space with us. As you continue your intro period, I wanted to share a bit more about what makes Talo Yoga special and how you can make the most of your time with us.

Our Philosophy:
At Talo, we believe yoga is for every body and every stage of life. Whether you''re a complete beginner or seasoned practitioner, our classes are designed to meet you where you are.

Making the Most of Your Intro:
• Try different class styles to find what resonates with you
• Don''t be afraid to use props - they''re there to support your practice
• Ask questions! Our instructors love helping students grow
• Consider attending workshops for deeper learning

We''re here to support your journey every step of the way.

With love and light,
Emily & The Talo Team 🌿'),

(14, 'sms', NULL, 'Hi [First Name], you''re halfway through your intro! Just wanted to check in — how are you feeling? If you''ve found classes you love or have any questions, I''m here. Want help booking the rest of your trial sessions?'),

(28, 'email', 'From Intro to Ritual — Your Path Forward at Talo 🌿', 'Hi [First Name],

It''s been so lovely having you at the studio this past month. As your intro period comes to an end, I wanted to reach out personally to see how your experience has been and talk about what''s next.

Your Journey So Far:
We hope you''ve discovered the transformative power of consistent practice and found a sense of community here at Talo.

Moving Forward:
We''d love to continue supporting your yoga journey! Here are your options for ongoing membership:
• Unlimited Monthly Membership
• Class Packages for flexible scheduling
• Drop-in rates for occasional practice

I''d love to chat with you about which option might work best for your lifestyle and goals. Feel free to reply to this email or give us a call.

Thank you for being part of our Talo family.

With gratitude,
Emily & The Talo Team 🌿');

-- Enable Row Level Security on new tables
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Allow authenticated users to access message_templates" ON public.message_templates
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to access message_log" ON public.message_log
FOR ALL USING (auth.role() = 'authenticated');

-- Add indexes for performance
CREATE INDEX idx_message_log_client_sequence ON public.message_log(client_id, sequence_day, message_type);
CREATE INDEX idx_message_templates_sequence_day ON public.message_templates(sequence_day, is_active);