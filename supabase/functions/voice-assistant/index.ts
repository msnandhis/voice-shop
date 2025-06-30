import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VoiceRequest {
  text?: string;
  action: 'text-to-speech' | 'process-command';
  userId?: string;
  context?: {
    currentPage?: string;
    productsAvailable?: number;
    hasCart?: boolean;
    onCheckout?: boolean;
    currentProducts?: any[];
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, action, userId, context }: VoiceRequest = await req.json()
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')

    console.log('Voice assistant request:', { text, action, userId, context })

    if (!elevenLabsApiKey) {
      console.warn('ElevenLabs API key not configured, using fallback')
    }

    switch (action) {
      case 'text-to-speech':
        if (!text) {
          throw new Error('Text required for text-to-speech')
        }
        return await handleTextToSpeech(text, elevenLabsApiKey)

      case 'process-command':
        if (!text) {
          throw new Error('Text required for command processing')
        }
        return await handleCommandProcessing(text, userId, elevenLabsApiKey, context)

      default:
        throw new Error('Invalid action specified')
    }
  } catch (error) {
    console.error('Voice assistant error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        intent: 'error',
        response: 'I encountered an issue processing that. Could you try again?'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleTextToSpeech(text: string, apiKey?: string): Promise<Response> {
  try {
    if (!apiKey) {
      console.log('No ElevenLabs API key, using fallback')
      return new Response(
        JSON.stringify({ 
          success: true, 
          audio: null,
          message: 'ElevenLabs not configured, using browser speech'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam voice - natural and engaging
    
    console.log('Calling ElevenLabs TTS for:', text.substring(0, 50) + '...')
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    console.log('ElevenLabs TTS successful, audio length:', audioBase64.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        audio: audioBase64,
        contentType: 'audio/mpeg'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('ElevenLabs TTS error:', error)
    return new Response(
      JSON.stringify({ 
        success: true, 
        audio: null,
        message: `ElevenLabs error: ${error.message}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleCommandProcessing(text: string, userId?: string, apiKey?: string, context?: any): Promise<Response> {
  try {
    console.log('Processing command:', text, 'for user:', userId, 'context:', context)
    
    const result = await processVoiceCommand(text, userId, context)
    
    console.log('Command processing result:', result)
    
    // Generate speech for the response if ElevenLabs is available
    let audioBase64 = null
    if (apiKey && result.response) {
      try {
        console.log('Generating speech for response:', result.response)
        const speechResponse = await handleTextToSpeech(result.response, apiKey)
        const speechData = await speechResponse.json()
        audioBase64 = speechData.audio
      } catch (error) {
        console.warn('Speech generation failed:', error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        intent: result.intent,
        response: result.response,
        data: result.data,
        audio: audioBase64,
        contentType: audioBase64 ? 'audio/mpeg' : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Command processing error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        intent: 'error',
        response: 'I had trouble understanding that. Could you try rephrasing?'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function processVoiceCommand(command: string, userId?: string, context?: any): Promise<{ intent: string; response: string; data?: any }> {
  const lowerCommand = command.toLowerCase().trim()
  
  console.log('🎯 Processing natural language command:', lowerCommand, 'Context:', context)
  
  // Authentication check for shopping commands
  if (!userId && (lowerCommand.includes('add') || lowerCommand.includes('cart') || lowerCommand.includes('order') || lowerCommand.includes('buy'))) {
    return {
      intent: 'auth_required',
      response: 'I\'d love to help you shop! Please sign in first so I can save your items and process orders.'
    }
  }

  // 1. PLACE ORDER COMMANDS - HIGHEST PRIORITY for checkout
  if (isPlaceOrderCommand(lowerCommand)) {
    console.log('✅ Place order command detected:', lowerCommand)
    return handlePlaceOrderCommand(lowerCommand, context)
  }

  // 2. CHECKOUT PAYMENT COMMANDS - VERY HIGH PRIORITY
  if (isPaymentCommand(lowerCommand)) {
    console.log('✅ Payment command detected:', lowerCommand)
    return handlePaymentCommand(lowerCommand)
  }

  // 3. CHECKOUT ADDRESS COMMANDS - HIGH PRIORITY  
  if (isAddressCommand(lowerCommand)) {
    console.log('✅ Address command detected:', lowerCommand)
    return handleAddressCommand(lowerCommand)
  }

  // 4. ADD TO CART COMMANDS - HIGH PRIORITY (moved before navigation)
  if (isAddToCartCommand(lowerCommand)) {
    console.log('✅ Add to cart command detected:', lowerCommand)
    return handleAddToCartCommand(lowerCommand, userId, context)
  }

  // 5. NAVIGATION COMMANDS - Medium Priority (after add to cart)
  if (isNavigationCommand(lowerCommand)) {
    console.log('✅ Navigation command detected:', lowerCommand)
    return handleNavigationCommand(lowerCommand, context)
  }
  
  // 6. BROWSE/SEARCH COMMANDS - Medium Priority
  if (isBrowseCommand(lowerCommand)) {
    console.log('✅ Browse command detected:', lowerCommand)
    return handleBrowseCommand(lowerCommand)
  }
  
  // 7. HELP COMMANDS - Low Priority
  if (isHelpCommand(lowerCommand)) {
    return handleHelpCommand(lowerCommand, context)
  }

  // 8. GREETING COMMANDS - Low Priority
  if (isGreetingCommand(lowerCommand)) {
    return handleGreetingCommand(lowerCommand)
  }

  // Default response with contextual suggestions
  return handleUnknownCommand(lowerCommand, context)
}

// 🛒 PLACE ORDER COMMAND DETECTION & HANDLING
function isPlaceOrderCommand(command: string): boolean {
  const orderPatterns = [
    // Direct order commands
    'place order', 'place my order', 'place the order',
    'complete order', 'complete my order', 'complete the order',
    'finish order', 'finish my order', 'finish the order',
    'submit order', 'submit my order', 'submit the order',
    'confirm order', 'confirm my order', 'confirm the order',
    'finalize order', 'finalize my order', 'finalize the order',
    
    // Payment commands
    'pay now', 'pay for order', 'pay for my order',
    'complete payment', 'process payment', 'make payment',
    'buy now', 'purchase now', 'buy it now',
    
    // Action commands
    'do it', 'go ahead', 'proceed', 'continue',
    'yes place order', 'yes pay now', 'yes complete'
  ]
  
  return orderPatterns.some(pattern => command.includes(pattern)) ||
         (command.includes('proceed') && (command.includes('payment') || command.includes('order')))
}

function handlePlaceOrderCommand(command: string, context?: any): { intent: string; response: string; data?: any } {
  const responses = [
    'Perfect! I\'m processing your order right now. Thank you for choosing us!',
    'Excellent! Your order is being submitted. You should receive confirmation shortly!',
    'Fantastic! Processing your payment and order details now!',
    'Great choice! I\'m completing your order - almost done!'
  ]
  
  const response = responses[Math.floor(Math.random() * responses.length)]
  
  return {
    intent: 'place_order',
    response: response,
    data: { 
      action: 'submit_order',
      requiresCheckoutPage: true,
      urgent: true
    }
  }
}

// 💳 PAYMENT COMMAND DETECTION & HANDLING
function isPaymentCommand(command: string): boolean {
  const paymentPatterns = [
    // Card selection
    'use card', 'select card', 'choose card', 'pick card',
    'card 1', 'card 2', 'card 3', 'card one', 'card two', 'card three',
    'first card', 'second card', 'third card', 'my card',
    'use my card', 'select my card', 'choose my card',
    
    // Payment method
    'payment method', 'pay with', 'use payment', 'select payment',
    'choose payment method', 'pick payment method',
    
    // Natural variations
    'pay with card', 'use credit card', 'select credit card',
    'my first card', 'my second card', 'my default card'
  ]
  
  return paymentPatterns.some(pattern => command.includes(pattern)) ||
         /card\s*(\d+|one|two|three|first|second|third|default)/i.test(command) ||
         /(use|select|choose|pay)\s*(with\s*)?(card|payment)/i.test(command)
}

function handlePaymentCommand(command: string): { intent: string; response: string; data?: any } {
  // Extract card identifier with multiple methods
  let cardIdentifier = '1' // default
  
  // Number extraction
  const numberMatch = command.match(/(\d+)/);
  if (numberMatch) {
    cardIdentifier = numberMatch[1];
  } else {
    // Word to number mapping
    const wordMap: { [key: string]: string } = {
      'one': '1', 'first': '1',
      'two': '2', 'second': '2', 
      'three': '3', 'third': '3',
      'default': '1'
    }
    
    for (const [word, num] of Object.entries(wordMap)) {
      if (command.includes(word)) {
        cardIdentifier = num;
        break;
      }
    }
  }

  const responses = [
    `Perfect! I've selected card ${cardIdentifier} for payment. You're all set to complete your order!`,
    `Excellent choice! Card ${cardIdentifier} is now selected. Ready to place your order!`,
    `Great! I've set up card ${cardIdentifier} for payment. Everything looks good!`,
    `Awesome! Card ${cardIdentifier} is ready to go. You can place your order now!`
  ]
  
  const response = responses[Math.floor(Math.random() * responses.length)]

  return {
    intent: 'card_selected',
    response: response,
    data: { 
      cardIdentifier,
      action: 'select_card'
    }
  }
}

// 📍 ADDRESS COMMAND DETECTION & HANDLING
function isAddressCommand(command: string): boolean {
  const addressPatterns = [
    // Address selection
    'use address', 'select address', 'choose address', 'pick address',
    'address 1', 'address 2', 'address 3', 'address one', 'address two',
    'first address', 'second address', 'third address',
    
    // Details selection
    'use details', 'select details', 'choose details', 'pick details',
    'details 1', 'details 2', 'details 3', 'details one', 'details two',
    'first details', 'second details', 'third details',
    
    // Shipping references
    'shipping address', 'delivery address', 'my address',
    'use my address', 'select my address', 'choose my address',
    'home address', 'work address', 'default address'
  ]
  
  return addressPatterns.some(pattern => command.includes(pattern)) ||
         /(address|details)\s*(\d+|one|two|three|first|second|third|default)/i.test(command) ||
         /(use|select|choose)\s*(my\s*)?(address|details|shipping)/i.test(command)
}

function handleAddressCommand(command: string): { intent: string; response: string; data?: any } {
  // Extract address identifier
  let addressIdentifier = '1' // default
  
  const numberMatch = command.match(/(\d+)/);
  if (numberMatch) {
    addressIdentifier = numberMatch[1];
  } else {
    const wordMap: { [key: string]: string } = {
      'one': '1', 'first': '1',
      'two': '2', 'second': '2', 
      'three': '3', 'third': '3',
      'default': '1', 'home': '1', 'work': '2'
    }
    
    for (const [word, num] of Object.entries(wordMap)) {
      if (command.includes(word)) {
        addressIdentifier = num;
        break;
      }
    }
  }

  const responses = [
    `Perfect! I've selected address ${addressIdentifier} for delivery. Now you can choose your payment method!`,
    `Excellent! Address ${addressIdentifier} is set for shipping. Ready for payment selection!`,
    `Great choice! Address ${addressIdentifier} is confirmed for delivery. What's your payment preference?`,
    `Awesome! I've set address ${addressIdentifier} for shipping. Let's pick a payment method!`
  ]
  
  const response = responses[Math.floor(Math.random() * responses.length)]

  return {
    intent: 'address_selected',
    response: response,
    data: { 
      addressIdentifier,
      action: 'select_address'
    }
  }
}

// 🛒 ADD TO CART COMMAND DETECTION & HANDLING
function isAddToCartCommand(command: string): boolean {
  // First check if it's NOT a cart viewing command
  const cartViewingPatterns = [
    'view my cart', 'show my cart', 'see my cart', 'check my cart',
    'go to my cart', 'take me to my cart', 'what\'s in my cart', 'show me my cart',
    'open my cart', 'display my cart'
  ];
  
  // If it's a cart viewing command, return false
  if (cartViewingPatterns.some(pattern => command.includes(pattern))) {
    return false;
  }
  
  // Product-specific add to cart pattern
  const productSpecificPattern = /(add|buy|purchase|get)\s+(.+?)\s+(to cart|to basket)/i;
  if (productSpecificPattern.test(command)) {
    return true;
  }
  
  // Now check for add to cart patterns
  const addPatterns = [
    // Direct add commands
    'add to cart', 'add to basket', 'put in cart', 'put in basket',
    'add item', 'add product', 'add this', 'add that',
    
    // Position-based
    'add first', 'add second', 'add third', 'add last',
    'add the first', 'add the second', 'add the third', 'add the last',
    'first one', 'second one', 'third one', 'last one',
    
    // Purchase intent
    'buy this', 'buy that', 'purchase this', 'purchase that',
    'get this', 'get that', 'take this', 'take that',
    'I want this', 'I want that', 'I need this', 'I need that',
    'I\'ll take this', 'I\'ll take that', 'I\'ll buy this'
  ]
  
  return addPatterns.some(pattern => command.includes(pattern)) ||
         (command.includes('add') && (command.includes('cart') || command.includes('basket') || 
          command.includes('first') || command.includes('second') || command.includes('product')))
}

function handleAddToCartCommand(command: string, userId?: string, context?: any): { intent: string; response: string; data?: any } {
  if (!userId) {
    return {
      intent: 'auth_required',
      response: 'I\'d love to help you add items to your cart! Please sign in first so I can save your items.'
    }
  }

  console.log('🛒 Processing add to cart command with context:', context?.productsAvailable, 'products available')

  // Product-specific commands like "add iPhone 15 Pro to cart"
  const productNameMatch = command.match(/(add|buy|purchase|get)\s+(.+?)\s+(to cart|to basket)/i);
  if (productNameMatch) {
    const productName = productNameMatch[2].trim();
    console.log('🎯 Product-specific command detected:', productName);
    
    return {
      intent: 'add_to_cart_name',
      response: `I'll add ${productName} to your cart right away!`,
      data: { productName, action: 'add_by_name' }
    };
  }

  // Position-based commands
  if (command.includes('first') || command.includes('1st')) {
    const responses = [
      'Perfect! I\'ll add the first product to your cart right away!',
      'Great choice! Adding the first item to your cart now!',
      'Excellent! The first product is going into your cart!',
      'Awesome! I\'ve selected the first product for you!'
    ]
    
    return {
      intent: 'add_to_cart_position',
      response: responses[Math.floor(Math.random() * responses.length)],
      data: { position: 0, action: 'add_by_position' }
    }
  }
  
  if (command.includes('second') || command.includes('2nd')) {
    return {
      intent: 'add_to_cart_position',
      response: 'Excellent! Adding the second product to your cart!',
      data: { position: 1, action: 'add_by_position' }
    }
  }
  
  if (command.includes('third') || command.includes('3rd')) {
    return {
      intent: 'add_to_cart_position',
      response: 'Great! The third product is going into your cart!',
      data: { position: 2, action: 'add_by_position' }
    }
  }
  
  if (command.includes('last')) {
    return {
      intent: 'add_to_cart_position',
      response: 'Perfect! Adding the last product to your cart!',
      data: { position: -1, action: 'add_by_position' }
    }
  }

  // Rating-based commands
  if (command.includes('best') || command.includes('highest rated') || command.includes('top rated')) {
    return {
      intent: 'add_to_cart_rating',
      response: 'Excellent choice! I\'ll add the highest-rated product to your cart!',
      data: { criteria: 'best_rating', action: 'add_by_rating' }
    }
  }

  // Generic add command
  const responses = [
    'I\'d be happy to add something to your cart! Try saying "Add the first product" or browse some products first.',
    'Great! Let me help you add an item. Say "Add the first one" or specify which product you\'d like!',
    'Absolutely! I can add items to your cart. Just tell me which one - "first", "second", or describe what you want!'
  ]

  return {
    intent: 'add_to_cart_generic',
    response: responses[Math.floor(Math.random() * responses.length)],
    data: { action: 'add_generic' }
  }
}

// 🧭 NAVIGATION COMMAND DETECTION & HANDLING
function isNavigationCommand(command: string): boolean {
  // VERY specific navigation patterns that won't catch "add to cart" commands
  const navigationPatterns = [
    // Home navigation
    'go home', 'home page', 'main page', 'homepage',
    'take me home', 'back to home', 'home screen',
    
    // Cart navigation - ONLY specific cart viewing patterns
    'view my cart', 'show my cart', 'see my cart', 'check my cart',
    'go to my cart', 'take me to my cart', 'navigate to my cart',
    'what\'s in my cart', 'show me my cart', 'display my cart',
    
    // Checkout navigation  
    'checkout', 'check out', 'go to checkout', 'goto checkout',
    'proceed to checkout', 'take me to checkout', 'navigate to checkout',
    'continue to checkout', 'start checkout', 'begin checkout',
    
    // Product browsing
    'show products', 'view products', 'browse products', 'see products',
    'go to products', 'take me to products', 'show me products',
    'product catalog', 'product list', 'what do you have'
  ]
  
  return navigationPatterns.some(pattern => command.includes(pattern))
}

function handleNavigationCommand(command: string, context?: any): { intent: string; response: string; data?: any } {
  // Home navigation
  if (command.includes('home') && (command.includes('go') || command.includes('take') || command.includes('page'))) {
    const responses = [
      'Taking you back to the homepage!',
      'Perfect! Returning to the home page.',
      'Sure thing! Let\'s go back to the main page.',
      'Absolutely! Taking you home now.'
    ]
    
    return {
      intent: 'go_home',
      response: responses[Math.floor(Math.random() * responses.length)],
      data: { action: 'go_home' }
    }
  }

  // Cart navigation - ONLY match specific cart viewing patterns
  if ((command.includes('view') || command.includes('show') || command.includes('see') || 
       command.includes('check') || command.includes('go to') || command.includes('take me to')) && 
      command.includes('cart')) {
    const responses = [
      'Perfect! Let\'s take a look at what\'s in your cart.',
      'Great! Opening your cart so you can review your items.',
      'Absolutely! Here\'s everything you\'ve added to your cart.',
      'Sure thing! Let me show you your cart contents.'
    ]
    
    return {
      intent: 'view_cart',
      response: responses[Math.floor(Math.random() * responses.length)],
      data: { action: 'view_cart' }
    }
  }
  
  if (command.includes('checkout') || command.includes('check out')) {
    const responses = [
      'Excellent! Taking you to checkout where you can complete your purchase.',
      'Perfect! Let\'s head to checkout. You can use voice commands for address and payment!',
      'Great choice! Moving to checkout now. I\'ll help you through the process!',
      'Awesome! Checkout time! I can help you select addresses and payment methods.'
    ]
    
    return {
      intent: 'goto_checkout',
      response: responses[Math.floor(Math.random() * responses.length)],
      data: { 
        action: 'goto_checkout',
        fromPage: context?.currentPage || 'unknown'
      }
    }
  }
  
  // Default to products
  const responses = [
    'Absolutely! Let me show you our amazing product collection.',
    'Great! Here\'s our product catalog with lots of great items.',
    'Perfect! Check out these fantastic products we have for you.',
    'Excellent! Browse through our curated selection of products.'
  ]
  
  return {
    intent: 'browse_products',
    response: responses[Math.floor(Math.random() * responses.length)],
    data: { action: 'browse_products' }
  }
}

// 🔍 BROWSE COMMAND DETECTION & HANDLING
function isBrowseCommand(command: string): boolean {
  const browsePatterns = [
    // Show/display commands
    'show me', 'show', 'display', 'let me see', 'can I see',
    'I want to see', 'I\'d like to see', 'find me', 'search for',
    
    // Browse commands
    'browse', 'look at', 'check out', 'explore', 'discover',
    'what do you have', 'what\'s available', 'what can I buy',
    
    // Category-specific
    'shoes', 'sneakers', 'clothing', 'electronics', 'phones',
    'laptops', 'computers', 'accessories', 'fitness', 'home'
  ]
  
  return browsePatterns.some(pattern => command.includes(pattern)) ||
         (command.includes('show') && (command.includes('product') || command.includes('item')))
}

function handleBrowseCommand(command: string): { intent: string; response: string; data?: any } {
  let category = ''
  let keywords: string[] = []
  
  // Category detection
  if (command.includes('shoe') || command.includes('sneaker')) {
    category = 'shoes'
    keywords.push('shoes', 'sneakers')
  } else if (command.includes('phone') || command.includes('mobile') || command.includes('smartphone')) {
    category = 'electronics'
    keywords.push('phone', 'electronics')
  } else if (command.includes('cloth') || command.includes('shirt') || command.includes('jean') || command.includes('dress')) {
    category = 'clothing'
    keywords.push('clothing')
  } else if (command.includes('computer') || command.includes('laptop') || command.includes('electronic')) {
    category = 'electronics'
    keywords.push('electronics', 'computers')
  } else if (command.includes('home') || command.includes('furniture')) {
    category = 'home'
    keywords.push('home', 'furniture')
  } else if (command.includes('fitness') || command.includes('exercise') || command.includes('workout')) {
    category = 'fitness'
    keywords.push('fitness', 'exercise')
  }

  const responses = category ? [
    `Perfect! Here are our ${category} products. You can say "Add the first one" to add items to your cart!`,
    `Excellent choice! Check out these amazing ${category} options. Try "Add the one with best rating"!`,
    `Great! I\'ve found some fantastic ${category} for you. Say "Add the first product" when you see something you like!`,
    `Awesome! Here\'s our ${category} collection. Use voice commands like "Add the second one" to shop!`
  ] : [
    `Perfect! Here\'s our complete product catalog. Say "Add the first product" or "Show me sneakers" to get started!`,
    `Excellent! Browse through these amazing products. You can add items by saying "Add the first one"!`,
    `Great! Check out our full collection. Try voice commands like "Add the best rated one" to shop!`,
    `Awesome! Here are all our products. Say "Add the first product" or ask for specific categories!`
  ]

  const response = responses[Math.floor(Math.random() * responses.length)]

  return {
    intent: 'browse_products',
    response: response,
    data: { 
      category, 
      keywords,
      action: 'browse_products'
    }
  }
}

// ❓ HELP COMMAND DETECTION & HANDLING
function isHelpCommand(command: string): boolean {
  const helpPatterns = [
    'help', 'what can you do', 'what commands', 'how to use',
    'what can I say', 'what should I say', 'commands',
    'instructions', 'guide', 'tutorial', 'how does this work'
  ]
  
  return helpPatterns.some(pattern => command.includes(pattern))
}

function handleHelpCommand(command: string, context?: any): { intent: string; response: string; data?: any } {
  const contextualHelp = context?.onCheckout ? 
    'Since you\'re on the checkout page, try saying "Use details 1" for address, "Use card 1" for payment, or "Place order" to complete your purchase!' :
    context?.currentPage === 'cart' ?
    'You\'re viewing your cart! Try "Checkout", "Add more products", or "Remove items" to manage your cart.' :
    'You can say things like "Show me sneakers", "Add the first product", "Go to my cart", "Checkout", or ask me to "Show products"!'

  return {
    intent: 'help',
    response: `I\'m your voice shopping assistant! I can help you browse products, add items to cart, and complete purchases. ${contextualHelp}`
  }
}

// 👋 GREETING COMMAND DETECTION & HANDLING
function isGreetingCommand(command: string): boolean {
  const greetingPatterns = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'what\'s up', 'how are you', 'greetings', 'howdy'
  ]
  
  return greetingPatterns.some(pattern => command.includes(pattern))
}

function handleGreetingCommand(command: string): { intent: string; response: string; data?: any } {
  const responses = [
    'Hello! I\'m your voice shopping assistant. What can I help you find today?',
    'Hi there! Ready to do some voice shopping? I can show you products, manage your cart, and help with checkout!',
    'Hey! Great to see you! Try saying "Show me products" or "What\'s in my cart" to get started!',
    'Hello! I\'m here to make shopping easy with voice commands. What would you like to explore?'
  ]
  
  return {
    intent: 'greeting',
    response: responses[Math.floor(Math.random() * responses.length)],
    data: { action: 'greeting' }
  }
}

// ❌ UNKNOWN COMMAND HANDLING
function handleUnknownCommand(command: string, context?: any): { intent: string; response: string; data?: any } {
  const contextualSuggestions = context?.onCheckout ? 
    'Try "Use details 1", "Use card 1", or "Place order".' :
    context?.currentPage === 'cart' ?
    'Try "Checkout", "Add more products", or "Show me products".' :
    'Try "Show me products", "Add the first product", "Go to my cart", or "Checkout".'

  const responses = [
    `I didn\'t quite catch that. ${contextualSuggestions}`,
    `Could you try rephrasing that? ${contextualSuggestions}`,
    `I\'m not sure what you meant. ${contextualSuggestions}`,
    `Let me help you with that differently. ${contextualSuggestions}`
  ]

  return {
    intent: 'unknown',
    response: responses[Math.floor(Math.random() * responses.length)]
  }
}