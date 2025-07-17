-- Enable RLS on client_imports table and create policies to allow inserts
ALTER TABLE public.client_imports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into client_imports (for CSV uploads)
CREATE POLICY "Allow all inserts on client_imports" 
ON public.client_imports 
FOR INSERT 
WITH CHECK (true);

-- Allow all reads for authenticated users
CREATE POLICY "Allow authenticated reads on client_imports" 
ON public.client_imports 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow all updates for authenticated users  
CREATE POLICY "Allow authenticated updates on client_imports" 
ON public.client_imports 
FOR UPDATE 
USING (auth.role() = 'authenticated');