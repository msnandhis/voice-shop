// Follow Deno and Supabase Edge Functions conventions
import { serve } from "npm:http/server";
import { createClient } from "npm:@supabase/supabase-js@2.38.0";
import Stripe from "npm:stripe@12.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, session_id } = await req.json();

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
      // Retrieve the session to verify it's valid and get details
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['payment_intent', 'line_items', 'shipping', 'customer_details'],
      });

      if (!session) {
        return new Response(
          JSON.stringify({ success: false, error: 'Session not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      console.log("Retrieved Stripe session:", {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        has_shipping: !!session.shipping,
        customer_email: session.customer_details?.email,
      });

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