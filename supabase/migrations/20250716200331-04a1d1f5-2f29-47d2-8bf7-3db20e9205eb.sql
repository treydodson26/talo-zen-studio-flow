-- Update RLS policies for clients table to allow imports
-- First, let's make sure the clients table has proper RLS policies

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON clients;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON clients;

-- Create permissive policies for the clients table
CREATE POLICY "Allow all operations for authenticated users" 
ON clients FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Also ensure the table has RLS enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;