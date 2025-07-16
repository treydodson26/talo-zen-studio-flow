import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// CSV column mapping for Arketa export
const COLUMN_MAPPING = {
  'Client Name': 'Client Name',
  'Client Email': 'Client Email',
  'Phone Number': 'Phone Number',
  'First Name': 'First Name',
  'Last Name': 'Last Name',
  'First Seen': 'First Seen',
  'Last Seen': 'Last Seen',
  'Marketing Email Opt-in': 'Marketing Email Opt-in',
  'Marketing Text Opt In': 'Marketing Text Opt In',
  'Transactional Text Opt In': 'Transactional Text Opt In',
  'Tags': 'Tags',
  'Birthday': 'Birthday',
  'Address': 'Address',
  'Pre-Arketa Milestone Count': 'Pre-Arketa Milestone Count',
  'Agree to Liability Waiver': 'Agree to Liability Waiver'
}

function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    if (values.length !== headers.length) {
      console.warn(`Row ${i} has ${values.length} values but ${headers.length} headers, skipping`)
      continue
    }

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    const { fileName } = await req.json()
    
    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'fileName is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Processing file: ${fileName}`)

    // Download the CSV file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('imports')
      .download(fileName)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      return new Response(
        JSON.stringify({ error: `Failed to download file: ${downloadError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse CSV content
    const csvContent = await fileData.text()
    const csvRows = parseCSV(csvContent)
    
    console.log(`Parsed ${csvRows.length} rows from CSV`)

    // Process each row and upsert to clients table
    let newClients = 0
    let updatedClients = 0
    let errors = 0

    for (const row of csvRows) {
      try {
        // Skip rows without email (required field)
        if (!row['Client Email']) {
          console.warn('Skipping row without email:', row)
          errors++
          continue
        }

        // Prepare client data
        const clientData = {
          'Client Name': row['Client Name'] || '',
          'Client Email': row['Client Email'],
          'Phone Number': row['Phone Number'] || '',
          'First Name': row['First Name'] || '',
          'Last Name': row['Last Name'] || '',
          'First Seen': row['First Seen'] || '',
          'Last Seen': row['Last Seen'] || '',
          'Marketing Email Opt-in': row['Marketing Email Opt-in'] || '',
          'Marketing Text Opt In': row['Marketing Text Opt In'] || '',
          'Transactional Text Opt In': row['Transactional Text Opt In'] || '',
          'Tags': row['Tags'] || '',
          'Birthday': row['Birthday'] || '',
          'Address': row['Address'] || '',
          'Pre-Arketa Milestone Count': row['Pre-Arketa Milestone Count'] || '',
          'Agree to Liability Waiver': row['Agree to Liability Waiver'] || ''
        }

        // Check if client exists
        const { data: existingClient, error: selectError } = await supabase
          .from('clients')
          .select('id')
          .eq('Client Email', clientData['Client Email'])
          .single()

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('Error checking existing client:', selectError)
          errors++
          continue
        }

        if (existingClient) {
          // Update existing client
          const { error: updateError } = await supabase
            .from('clients')
            .update(clientData)
            .eq('id', existingClient.id)

          if (updateError) {
            console.error('Error updating client:', updateError)
            errors++
          } else {
            updatedClients++
          }
        } else {
          // Insert new client
          const { error: insertError } = await supabase
            .from('clients')
            .insert(clientData)

          if (insertError) {
            console.error('Error inserting client:', insertError)
            errors++
          } else {
            newClients++
          }
        }
      } catch (error) {
        console.error('Error processing row:', error)
        errors++
      }
    }

    // Clean up the uploaded file
    await supabase.storage
      .from('imports')
      .remove([fileName])

    const stats = {
      totalProcessed: csvRows.length,
      newClients,
      updatedClients,
      errors
    }

    console.log('Import completed:', stats)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Import completed successfully',
        stats 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})