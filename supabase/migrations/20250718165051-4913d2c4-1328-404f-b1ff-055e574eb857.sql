-- Fix storage policies for imports bucket to allow authenticated users to upload files

-- Create policy to allow authenticated users to upload files to imports bucket
CREATE POLICY "Allow authenticated users to upload import files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'imports');

-- Create policy to allow authenticated users to read their own uploaded files
CREATE POLICY "Allow authenticated users to read import files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'imports');

-- Create policy to allow authenticated users to delete their own uploaded files
CREATE POLICY "Allow authenticated users to delete import files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'imports');