-- Create storage bucket for CSV imports
INSERT INTO storage.buckets (id, name, public)
VALUES ('imports', 'imports', false);

-- Create policies for the imports bucket
CREATE POLICY "Allow authenticated users to upload imports"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'imports');

CREATE POLICY "Allow authenticated users to read imports"
ON storage.objects FOR SELECT 
TO authenticated
USING (bucket_id = 'imports');

CREATE POLICY "Allow authenticated users to delete imports"
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'imports');