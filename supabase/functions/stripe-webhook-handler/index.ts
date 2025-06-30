// Follow Deno and Supabase Edge Functions conventions
import { serve } from "npm:http/server";
import { createClient } from "npm:@supabase/supabase-js@2.38.0";
import Stripe from "npm:stripe@12.12.0";

// Updated CORS headers to properly handle preflight requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow any origin for now
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("Request method:", req.method, "URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    const { action, session_id } = await req.json();
    console.log(`Processing ${action} for session ${session_id}`);

    if (!action || !session_id) {
      throw new Error('Missing required parameters');
    }

    // Initialize Stripe with the secret key from environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not found');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    if (action === 'verify_session') {
      console.log("Verifying session:", session_id);
      
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

      console.log("Session retrieved successfully:", session.id, "with status:", session.status);

      // Return the session details for order processing
      return new Response(
        JSON.stringify({ 
          success: true, 
          session,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Handle unexpected action
    console.warn("Unknown action requested:", action);
    return new Response(
      JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
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