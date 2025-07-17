-- Update existing clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS intro_period_start DATE,
ADD COLUMN IF NOT EXISTS intro_period_active BOOLEAN DEFAULT true;

-- Rename and modify message_templates columns to match new schema
ALTER TABLE public.message_templates
DROP COLUMN IF EXISTS template_key,
DROP COLUMN IF EXISTS body,
DROP COLUMN IF EXISTS channel,
DROP COLUMN IF EXISTS day_number,
ADD COLUMN IF NOT EXISTS sequence_day INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'email' CHECK (message_type IN ('email', 'sms', 'whatsapp')),
ADD COLUMN IF NOT EXISTS content TEXT;

-- Create message_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.message_log (
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
  SELECT COALESCE(intro_period_start, "First Seen"::DATE) INTO start_date
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
      c."Client Name" as client_name,
      c."First Name" as first_name,
      c."Client Email" as client_email,
      c."Phone Number" as phone_number,
      EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE)))::INTEGER as days_since_start
    FROM public.clients c
    WHERE c.intro_period_active = true
      AND COALESCE(c.intro_period_start, c."First Seen"::DATE) >= CURRENT_DATE - INTERVAL '30 days'
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
      AND mt.active = true
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
CREATE OR REPLACE VIEW public.client_dashboard AS
SELECT 
  c.*,
  EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE)))::INTEGER as days_since_start,
  CASE 
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE))) BETWEEN 0 AND 6 THEN 'Week 1'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE))) BETWEEN 7 AND 13 THEN 'Week 2'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE))) BETWEEN 14 AND 21 THEN 'Week 3'
    WHEN EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(c.intro_period_start, c."First Seen"::DATE))) BETWEEN 22 AND 30 THEN 'Week 4'
    ELSE 'Completed'
  END as sequence_stage,
  (
    SELECT COUNT(*) 
    FROM public.message_log ml 
    WHERE ml.client_id = c.id
  ) as messages_sent
FROM public.clients c
WHERE c.intro_period_active = true
ORDER BY COALESCE(c.intro_period_start, c."First Seen"::DATE) DESC;

-- Enable Row Level Security on new tables
ALTER TABLE public.message_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Allow authenticated users to access message_log" ON public.message_log
FOR ALL USING (auth.role() = 'authenticated');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_log_client_sequence ON public.message_log(client_id, sequence_day, message_type);
CREATE INDEX IF NOT EXISTS idx_message_templates_sequence_day ON public.message_templates(sequence_day, active);