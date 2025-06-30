import { serve } from "npm:http/server";
import { createClient } from "npm:@supabase/supabase-js@2.38.0";
import Stripe from "npm:stripe@12.12.0";

// Updated CORS headers to properly handle preflight requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("Request method:", req.method, "URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    const { action, session_id, event_type, payload } = await req.json();
    console.log(`Processing ${action || event_type} for session ${session_id || 'unknown'}`);

    // Initialize Stripe with the secret key from environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not found');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // For session verification requests from the client
    if (action === 'verify_session' && session_id) {
      console.log("Verifying session:", session_id);
      
      try {
        // Retrieve the session to verify it's valid and get details
        const session = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ['payment_intent', 'line_items', 'shipping', 'customer_details'],
        });

        if (!session) {
          console.error("Session not found:", session_id);
          return new Response(
            JSON.stringify({ success: false, error: 'Session not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }

        console.log("Session verified:", session.id, "Status:", session.status);
        
        // If the session has an orderId in metadata, update the order status
        if (session.metadata?.orderId && session.status === 'complete') {
          const supabaseUrl = Deno.env.get('SUPABASE_URL');
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
          
          if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            
            // Update the order payment status
            const { error } = await supabase
              .from('orders')
              .update({ 
                payment_status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', session.metadata.orderId);
              
            if (error) {
              console.error("Error updating order payment status:", error);
            } else {
              console.log(`Updated order ${session.metadata.orderId} payment status to completed`);
            }
          }
        }

        // Return the session details for order processing
        return new Response(
          JSON.stringify({ 
            success: true, 
            session,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (stripeError) {
        console.error("Error retrieving Stripe session:", stripeError);
        return new Response(
          JSON.stringify({ success: false, error: stripeError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    // Handle actual webhook events from Stripe
    if (event_type && payload) {
      console.log("Processing Stripe webhook event:", event_type);
      
      // Verify the webhook signature if we have a signature header
      // (In a real implementation, you'd verify the signature using Stripe's API)
      
      // For checkout.session.completed events, update the order
      if (event_type === 'checkout.session.completed') {
        const session = payload.object;
        
        if (session.metadata?.orderId) {
          const supabaseUrl = Deno.env.get('SUPABASE_URL');
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
          
          if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            
            // Update the order status
            const { error } = await supabase
              .from('orders')
              .update({ 
                payment_status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', session.metadata.orderId);
              
            if (error) {
              console.error("Error updating order payment status:", error);
              return new Response(
                JSON.stringify({ success: false, error: 'Failed to update order status' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
              );
            }
            
            console.log(`Updated order ${session.metadata.orderId} payment status to completed`);
          }
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      
      // Return success for other webhook events
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook received' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Handle unexpected action
    console.warn("Unknown action requested:", action || event_type);
    return new Response(
      JSON.stringify({ success: false, error: `Unknown action: ${action || event_type}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});