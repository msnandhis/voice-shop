import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.12.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cartItems, userId } = await req.json()

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart items are required.')
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured.')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Construct line items from cart items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'],
          description: item.product.description?.substring(0, 255) || '',
        },
        unit_amount: Math.round(item.product.price * 100), // Price in cents
      },
      quantity: item.quantity,
    }))

    // Add a tax line item (8% example)
    const totalAmountCents = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0)
    const taxAmountCents = Math.round(totalAmountCents * 0.08)

    if (taxAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax (8%)',
          },
          unit_amount: taxAmountCents,
        },
        quantity: 1,
      })
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('referer')}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('referer')}?status=cancel`,
      metadata: {
        userId: userId,
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
    })

    return new Response(
      JSON.stringify({ success: true, sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Stripe checkout session creation error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})