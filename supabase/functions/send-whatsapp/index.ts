import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessageRequest {
  to: string;
  message: string;
  lead_id?: string;
  template_name?: string;
  template_params?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN');
    if (!whatsappToken) {
      throw new Error('WhatsApp API token not configured');
    }

    const { to, message, lead_id, template_name, template_params }: WhatsAppMessageRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Phone number and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number (remove any non-digit characters except +)
    const cleanPhone = to.replace(/[^\d+]/g, '');
    
    console.log('Sending WhatsApp message to:', cleanPhone);

    let whatsappPayload;
    
    if (template_name) {
      // Send template message
      whatsappPayload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: template_name,
          language: { code: "en_US" },
          ...(template_params && template_params.length > 0 && {
            components: [{
              type: "body",
              parameters: template_params.map(param => ({
                type: "text",
                text: param
              }))
            }]
          })
        }
      };
    } else {
      // Send text message
      whatsappPayload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "text",
        text: { body: message }
      };
    }

    // Get phone number ID from environment
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    if (!phoneNumberId) {
      throw new Error('WhatsApp Phone Number ID not configured');
    }

    // Send WhatsApp message via Meta API
    const whatsappResponse = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappPayload),
    });

    const whatsappResult = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', whatsappResult);
      throw new Error(`WhatsApp API error: ${whatsappResult.error?.message || 'Unknown error'}`);
    }

    console.log('WhatsApp message sent successfully:', whatsappResult);

    // Log the message in our database
    const { error: logError } = await supabase
      .from('whatsapp_conversations')
      .insert({
        phone_number: cleanPhone,
        message_content: message,
        message_type: 'outgoing',
        whatsapp_message_id: whatsappResult.messages?.[0]?.id,
        lead_id: lead_id || null,
      });

    if (logError) {
      console.error('Error logging WhatsApp message:', logError);
    }

    // If this is part of a sequence, log it in message_log as well
    if (lead_id) {
      const { error: messageLogError } = await supabase
        .from('message_log')
        .insert({
          client_id: lead_id,
          sequence_day: 0, // You might want to calculate this based on lead creation date
          message_type: 'whatsapp',
          content: message,
          status: 'sent',
          external_message_id: whatsappResult.messages?.[0]?.id,
        });

      if (messageLogError) {
        console.error('Error logging to message_log:', messageLogError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: whatsappResult.messages?.[0]?.id,
        whatsapp_response: whatsappResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});