import { supabase } from './supabase';
import { Product } from './supabase';

interface VoiceContext {
  currentProducts: Product[];
  currentCategory: string;
  lastSearchQuery: string;
  currentPage: string;
  onCheckout: boolean;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private context: VoiceContext = {
    currentProducts: [],
    currentCategory: '',
    lastSearchQuery: '',
    currentPage: 'home',
    onCheckout: false
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  // Update context when products are displayed or page changes
  updateContext(products: Product[], category: string = '', searchQuery: string = '') {
    this.context.currentProducts = products;
    this.context.currentCategory = category;
    this.context.lastSearchQuery = searchQuery;
    console.log('🔄 Voice context updated:', { 
      productsCount: products.length, 
      category, 
      searchQuery,
      productNames: products.slice(0, 3).map(p => p.name)
    });
  }

  // Update page context
  updatePageContext(page: string, onCheckout: boolean = false) {
    this.context.currentPage = page;
    this.context.onCheckout = onCheckout;
    console.log('📍 Page context updated:', { page, onCheckout });
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        console.log('🎤 Voice input received:', transcript);
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.error('❌ Speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speak(text: string): Promise<void> {
    if (!text) return;

    try {
      console.log('🔊 Speaking text:', text);
      await this.speakWithElevenLabs(text);
    } catch (error) {
      console.warn('⚠️ ElevenLabs speech failed, falling back to browser speech:', error);
      await this.speakWithBrowser(text);
    }
  }

  private async speakWithElevenLabs(text: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'text-to-speech',
        text: text
      })
    });

    if (!response.ok) {
      throw new Error('ElevenLabs API request failed');
    }

    const data = await response.json();
    
    if (data.success && data.audio) {
      await this.playAudioFromBase64(data.audio);
    } else if (data.success && !data.audio) {
      // Fallback to browser speech if ElevenLabs not configured
      throw new Error('ElevenLabs not configured');
    } else {
      throw new Error('Invalid response from ElevenLabs API');
    }
  }

  private async playAudioFromBase64(audioBase64: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audioBlob = this.base64ToBlob(audioBase64, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  private async speakWithBrowser(text: string): Promise<void> {
    return new Promise((resolve) => {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  async processVoiceCommand(command: string, userId?: string): Promise<{ intent: string; response: string; data?: any }> {
    // Log the command
    if (userId) {
      await this.logVoiceCommand(userId, command);
    }

    console.log('🎯 Processing voice command:', command);
    console.log('📊 Current context:', {
      currentPage: this.context.currentPage,
      productsAvailable: this.context.currentProducts.length,
      onCheckout: this.context.onCheckout,
      userId: !!userId
    });

    try {
      console.log('🚀 Sending command to edge function:', command);
      
      // Send to edge function with enhanced context
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'process-command',
          text: command,
          userId: userId,
          context: {
            currentPage: this.context.currentPage,
            productsAvailable: this.context.currentProducts.length,
            hasCart: true,
            onCheckout: this.context.onCheckout,
            currentProducts: this.context.currentProducts.slice(0, 10) // Send first 10 products for context
          }
        })
      });

      if (!response.ok) {
        console.warn('⚠️ Edge function request failed:', response.status);
        throw new Error(`Voice processing failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Edge function result:', result);
      
      if (result.success) {
        // Execute the action based on the intent
        await this.executeAction(result, userId);
        
        return {
          intent: result.intent,
          response: result.response,
          data: result.data
        };
      } else {
        console.warn('⚠️ Edge function returned error:', result);
        throw new Error('Voice processing returned error');
      }
    } catch (error) {
      console.warn('⚠️ Edge function processing failed, using comprehensive fallback:', error);
      return await this.processVoiceCommandFallback(command, userId);
    }
  }

  private async executeAction(result: any, userId?: string) {
    const { intent, data } = result;
    
    console.log('🎯 Executing action for intent:', intent, 'data:', data);

    switch (intent) {
      case 'place_order':
        if (typeof (window as any).handleCheckoutSubmit === 'function') {
          console.log('✅ Triggering checkout submission');
          (window as any).handleCheckoutSubmit();
        } else {
          console.warn('⚠️ Checkout submit function not available');
        }
        break;
      
      case 'goto_checkout':
        if (typeof (window as any).handleGotoCheckout === 'function') {
          console.log('✅ Navigating to checkout');
          (window as any).handleGotoCheckout();
        } else {
          console.warn('⚠️ Goto checkout function not available');
        }
        break;
      
      case 'address_selected':
        if (typeof (window as any).handleUseAddressByVoice === 'function') {
          const identifier = data?.addressIdentifier || '1';
          console.log('✅ Selecting address:', identifier);
          (window as any).handleUseAddressByVoice(`details ${identifier}`);
        } else {
          console.warn('⚠️ Address selection function not available');
        }
        break;
      
      case 'card_selected':
        if (typeof (window as any).handleUseCardByVoice === 'function') {
          const identifier = data?.cardIdentifier || '1';
          console.log('✅ Selecting card:', identifier);
          (window as any).handleUseCardByVoice(`card ${identifier}`);
        } else {
          console.warn('⚠️ Card selection function not available');
        }
        break;
      
      case 'add_to_cart_position':
        if (data?.position !== undefined) {
          const success = await this.addProductByPosition(data.position, userId);
          if (!success) {
            console.warn('⚠️ Failed to add product by position');
          }
        }
        break;
        
      case 'add_to_cart_rating':
        const success = await this.addProductByRating(userId);
        if (!success) {
          console.warn('⚠️ Failed to add product by rating');
        }
        break;
        
      case 'add_to_cart_name':
        if (data?.productName) {
          await this.addProductByName(data.productName, userId);
        }
        break;
        
      case 'add_to_cart_category':
        if (data?.category) {
          await this.addProductByCategory(data.category, userId);
        }
        break;
        
      case 'add_to_cart_size':
        if (data?.size) {
          await this.addProductBySize(data.size, userId);
        }
        break;
        
      case 'add_to_cart_color':
        if (data?.color) {
          await this.addProductByColor(data.color, userId);
        }
        break;
        
      case 'browse_products':
        if (typeof (window as any).handleBrowseProducts === 'function') {
          console.log('✅ Browsing products:', data?.category || 'all');
          (window as any).handleBrowseProducts(data?.category || '');
        } else {
          console.warn('⚠️ Browse products function not available');
        }
        break;
        
      case 'view_cart':
        if (typeof (window as any).handleViewCart === 'function') {
          console.log('✅ Viewing cart');
          (window as any).handleViewCart();
        } else {
          console.warn('⚠️ View cart function not available');
        }
        break;

      case 'go_home':
        if (typeof (window as any).handleGoHome === 'function') {
          console.log('✅ Going home');
          (window as any).handleGoHome();
        } else {
          console.warn('⚠️ Go home function not available');
        }
        break;
    }
  }

  // Enhanced fallback processing with comprehensive command detection
  private async processVoiceCommandFallback(command: string, userId?: string): Promise<{ intent: string; response: string; data?: any }> {
    const lowerCommand = command.toLowerCase().trim();
    
    console.log('🔧 Using comprehensive fallback processing for:', lowerCommand);
    console.log('📊 Fallback context:', {
      currentPage: this.context.currentPage,
      productsAvailable: this.context.currentProducts.length,
      onCheckout: this.context.onCheckout,
      userId: !!userId
    });
    
    // CRITICAL: Check add to cart commands FIRST before navigation
    // This prevents "add to cart" from being interpreted as "view cart"
    if (this.isAddToCartCommandFallback(lowerCommand)) {
      console.log('🛒 Add to cart command detected in fallback');
      return await this.handleAddToCartCommandFallback(lowerCommand, userId);
    }

    // Place Order Commands - HIGHEST PRIORITY
    if (this.isPlaceOrderCommandFallback(lowerCommand)) {
      return this.handlePlaceOrderCommandFallback(lowerCommand);
    }

    // Card Commands - VERY HIGH PRIORITY
    if (this.isCardCommandFallback(lowerCommand)) {
      return this.handleCardCommandFallback(lowerCommand);
    }

    // Address Commands - HIGH PRIORITY
    if (this.isAddressCommandFallback(lowerCommand)) {
      return this.handleAddressCommandFallback(lowerCommand);
    }

    // Checkout Navigation Commands
    if (this.isCheckoutNavigationCommandFallback(lowerCommand)) {
      return this.handleCheckoutNavigationCommandFallback(lowerCommand);
    }

    // Navigation commands (now after add-to-cart to avoid conflicts)
    if (this.isNavigationCommandFallback(lowerCommand)) {
      return this.handleNavigationCommandFallback(lowerCommand);
    }

    // Browse products
    if (lowerCommand.includes('show') || lowerCommand.includes('browse')) {
      return {
        intent: 'browse_products',
        response: 'Absolutely! Let me show you our amazing product collection.',
        data: { action: 'browse_products' }
      };
    }

    return {
      intent: 'unknown',
      response: 'I didn\'t quite catch that. Could you try saying something like "Show me products", "Add first item", "Go to my cart", or "Place order"?'
    };
  }

  // Enhanced command detection methods
  private isNavigationCommandFallback(command: string): boolean {
    // VERY specific navigation patterns that won't catch "add to cart" commands
    const navPatterns = [
      'go home', 'home page', 'main page', 'homepage',
      'take me home', 'back to home', 'home screen',
      // ONLY specific cart viewing patterns - NOT generic "cart"
      'view my cart', 'show my cart', 'see my cart', 'check my cart',
      'go to my cart', 'take me to my cart', 'navigate to my cart',
      'what\'s in my cart', 'show me my cart', 'display my cart',
      'open my cart', 'see what\'s in cart'
    ];
    
    return navPatterns.some(pattern => command.includes(pattern));
  }

  private handleNavigationCommandFallback(command: string): { intent: string; response: string; data?: any } {
    if (command.includes('home')) {
      return {
        intent: 'go_home',
        response: 'Taking you back to the homepage!',
        data: { action: 'go_home' }
      };
    }

    // Very specific cart viewing detection
    if (command.includes('view my cart') || command.includes('show my cart') || 
        command.includes('see my cart') || command.includes('check my cart') ||
        command.includes('go to my cart') || command.includes('take me to my cart') ||
        command.includes('what\'s in my cart') || command.includes('show me my cart')) {
      return {
        intent: 'view_cart',
        response: 'Perfect! Let\'s take a look at what\'s in your cart.',
        data: { action: 'view_cart' }
      };
    }

    return {
      intent: 'unknown',
      response: 'I\'m not sure where you\'d like to go. Try saying "Go home", "Show products", or "View my cart".'
    };
  }

  private isCardCommandFallback(command: string): boolean {
    const cardPatterns = [
      // Card selection
      'use card', 'select card', 'choose card', 'pick card',
      'card 1', 'card 2', 'card 3', 'card one', 'card two',
      'first card', 'second card', 'third card', 'my card',
      'use my card', 'select my card', 'choose my card',
      
      // Payment method
      'payment method', 'pay with', 'use payment', 'select payment',
      'choose payment method', 'pick payment method',
      
      // Natural variations
      'pay with card', 'use credit card', 'select credit card',
      'my first card', 'my second card', 'my default card'
    ]
    
    return cardPatterns.some(pattern => command.includes(pattern)) ||
           /card\s*(\d+|one|two|three|first|second|third|default)/i.test(command) ||
           /(use|select|choose|pay)\s*(with\s*)?(card|payment)/i.test(command)
  }

  private handleCardCommandFallback(command: string): { intent: string; response: string; data?: any } {
    let cardIdentifier = '1';
    const numberMatch = command.match(/(\d+)/);
    if (numberMatch) {
      cardIdentifier = numberMatch[0];
    }
    
    if (typeof (window as any).handleUseCardByVoice === 'function') {
      (window as any).handleUseCardByVoice(`card ${cardIdentifier}`);
    }
    
    return {
      intent: 'card_selected',
      response: `Perfect! I've selected your card ${cardIdentifier} for payment. You're all set to complete your order!`,
      data: { cardIdentifier, action: 'select_card' }
    };
  }

  private isAddressCommandFallback(command: string): boolean {
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

  private handleAddressCommandFallback(command: string): { intent: string; response: string; data?: any } {
    let addressIdentifier = '1';
    const numberMatch = command.match(/(\d+)/);
    if (numberMatch) {
      addressIdentifier = numberMatch[0];
    }
    
    if (typeof (window as any).handleUseAddressByVoice === 'function') {
      (window as any).handleUseAddressByVoice(`details ${addressIdentifier}`);
    }
    
    return {
      intent: 'address_selected',
      response: `Excellent! I've selected address ${addressIdentifier} for your delivery. Now you can choose your payment method.`,
      data: { addressIdentifier, action: 'select_address' }
    };
  }

  private isPlaceOrderCommandFallback(command: string): boolean {
    const orderPatterns = [
      'place order', 'complete order', 'finish order', 'submit order',
      'pay now', 'buy now', 'purchase now', 'confirm order',
      'place my order', 'complete my order', 'finish my purchase',
      'proceed with payment', 'complete payment', 'finalize order'
    ];
    
    return orderPatterns.some(pattern => command.includes(pattern));
  }

  private handlePlaceOrderCommandFallback(command: string): { intent: string; response: string; data?: any } {
    if (typeof (window as any).handleCheckoutSubmit === 'function') {
      (window as any).handleCheckoutSubmit();
      return {
        intent: 'place_order',
        response: 'Fantastic! I\'m processing your order right now. Thank you for shopping with us!',
        data: { action: 'submit_order' }
      };
    }

    return {
      intent: 'place_order_error',
      response: 'I\'d love to help you place your order! Please head to the checkout page first, then I can process it for you.'
    };
  }

  private isCheckoutNavigationCommandFallback(command: string): boolean {
    const checkoutPatterns = [
      'checkout', 'check out', 'go to checkout', 'goto checkout',
      'proceed to checkout', 'take me to checkout', 'navigate to checkout',
      'continue to checkout', 'start checkout', 'begin checkout',
      'proceed checkout', 'move to checkout'
    ];
    
    return checkoutPatterns.some(pattern => command.includes(pattern));
  }

  private handleCheckoutNavigationCommandFallback(command: string): { intent: string; response: string; data?: any } {
    if (typeof (window as any).handleGotoCheckout === 'function') {
      (window as any).handleGotoCheckout();
      return {
        intent: 'goto_checkout',
        response: 'Perfect! Taking you to checkout now. You can use voice commands to select your address and payment method!',
        data: { action: 'goto_checkout' }
      };
    }

    return {
      intent: 'goto_checkout',
      response: 'Absolutely! Let me take you to checkout where you can complete your purchase.',
      data: { action: 'goto_checkout' }
    };
  }

  private isAddToCartCommandFallback(command: string): boolean {
    // CRITICAL: First check if it's NOT a cart viewing command
    const cartViewingPatterns = [
      'view my cart', 'show my cart', 'see my cart', 'check my cart',
      'go to my cart', 'take me to my cart', 'what\'s in my cart', 'show me my cart',
      'open my cart', 'display my cart'
    ];
    
    // If it's a cart viewing command, return false
    if (cartViewingPatterns.some(pattern => command.includes(pattern))) {
      return false;
    }

    // Special handling for product-specific commands like "add iPhone 15 Pro to cart"
    const productSpecificPattern = /(add|buy|purchase|get)\s+.+\s+(to cart|to basket)/i;
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
    ];
    
    return addPatterns.some(pattern => command.includes(pattern));
  }

  private async handleAddToCartCommandFallback(command: string, userId?: string): Promise<{ intent: string; response: string; data?: any }> {
    if (!userId) {
      return {
        intent: 'auth_required',
        response: 'I\'d love to help you add items to your cart! Please sign in first so I can save your items.'
      };
    }

    console.log('🛒 Processing add to cart command:', command);
    console.log('📦 Available products:', this.context.currentProducts.length);

    // Product-specific commands like "add iPhone 15 Pro to cart"
    const productNameMatch = command.match(/(add|buy|purchase|get)\s+(.+?)\s+(to cart|to basket)/i);
    if (productNameMatch) {
      const productName = productNameMatch[2].trim();
      console.log('🎯 Product-specific command detected:', productName);
      
      const success = await this.addProductByName(productName, userId);
      if (success) {
        return {
          intent: 'add_to_cart_success',
          response: `Perfect! I've added ${productName} to your cart. Anything else you'd like to add?`,
          data: { productName }
        };
      } else {
        return {
          intent: 'add_to_cart_error',
          response: `I couldn't find "${productName}" in our current products. Try saying "Add the first product" or browse specific products first.`
        };
      }
    }

    // Position-based commands
    if (command.includes('first') || command.includes('1st') || command.includes('one')) {
      if (this.context.currentProducts.length > 0) {
        const success = await this.addProductToCart(this.context.currentProducts[0].id, userId);
        if (success) {
          return {
            intent: 'add_to_cart_success',
            response: `Awesome! I've added ${this.context.currentProducts[0].name} to your cart. Anything else you'd like to add?`,
            data: { product: this.context.currentProducts[0] }
          };
        }
      }
    }

    if (command.includes('second') || command.includes('2nd')) {
      if (this.context.currentProducts.length > 1) {
        const success = await this.addProductToCart(this.context.currentProducts[1].id, userId);
        if (success) {
          return {
            intent: 'add_to_cart_success',
            response: `Perfect! I've added ${this.context.currentProducts[1].name} to your cart. Keep shopping or go to checkout!`,
            data: { product: this.context.currentProducts[1] }
          };
        }
      }
    }

    if (command.includes('third') || command.includes('3rd') || command.includes('three')) {
      if (this.context.currentProducts.length > 2) {
        const success = await this.addProductToCart(this.context.currentProducts[2].id, userId);
        if (success) {
          return {
            intent: 'add_to_cart_success',
            response: `Excellent! I've added ${this.context.currentProducts[2].name} to your cart. What else would you like?`,
            data: { product: this.context.currentProducts[2] }
          };
        }
      }
    }

    // Best rated product
    if (command.includes('best') || command.includes('highest') || command.includes('top rated')) {
      if (this.context.currentProducts.length > 0) {
        const bestProduct = [...this.context.currentProducts].sort((a, b) => b.rating - a.rating)[0];
        const success = await this.addProductToCart(bestProduct.id, userId);
        if (success) {
          return {
            intent: 'add_to_cart_success',
            response: `Great choice! I've added the highest-rated product, ${bestProduct.name}, to your cart!`,
            data: { product: bestProduct }
          };
        }
      }
    }

    // Generic add command - check if products are available
    if (this.context.currentProducts.length === 0) {
      return {
        intent: 'add_to_cart_error',
        response: 'I\'d be happy to add something to your cart! First, let\'s browse some products. Try saying "Show me products" or "Browse electronics".'
      };
    }

    return {
      intent: 'add_to_cart_error',
      response: 'I\'d be happy to add something to your cart! Try saying "Add the first product", "Add the second product", or "Add the best rated item".'
    };
  }

  // Helper methods for product operations
  private async addProductByPosition(position: number, userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    console.log('🎯 Adding product by position:', position, 'Available products:', this.context.currentProducts.length);
    
    if (this.context.currentProducts.length === 0) {
      console.warn('⚠️ No products available for position-based selection');
      return false;
    }

    const index = position === -1 ? this.context.currentProducts.length - 1 : position;
    const product = this.context.currentProducts[index];

    if (!product) {
      console.warn('⚠️ Product not found at position:', position);
      return false;
    }

    return await this.addProductToCart(product.id, userId);
  }

  private async addProductByRating(userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    const products = this.context.currentProducts;
    if (products.length === 0) return false;

    const bestProduct = [...products].sort((a, b) => b.rating - a.rating)[0];
    return await this.addProductToCart(bestProduct.id, userId);
  }

  private async addProductByName(productName: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    console.log('🔍 Searching for product by name:', productName);
    
    // First try to find in current products
    const normalizedSearchName = productName.toLowerCase();
    let matchedProduct = this.context.currentProducts.find(p => 
      p.name.toLowerCase().includes(normalizedSearchName) ||
      (p.voice_keywords && p.voice_keywords.some(keyword => 
        normalizedSearchName.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(normalizedSearchName)
      ))
    );

    if (!matchedProduct) {
      // If not found in current products, search all products
      console.log('🔍 Product not in current context, searching all products...');
      try {
        const { data: allProducts, error } = await supabase
          .from('products')
          .select('*')
          .gte('stock_quantity', 1);

        if (!error && allProducts) {
          matchedProduct = allProducts.find(p => 
            p.name.toLowerCase().includes(normalizedSearchName) ||
            (p.voice_keywords && p.voice_keywords.some(keyword => 
              normalizedSearchName.includes(keyword.toLowerCase()) || 
              keyword.toLowerCase().includes(normalizedSearchName)
            ))
          );
        }
      } catch (error) {
        console.error('❌ Error searching all products:', error);
      }
    }

    if (matchedProduct) {
      console.log('✅ Found matching product:', matchedProduct.name);
      return await this.addProductToCart(matchedProduct.id, userId);
    }

    console.warn('⚠️ No product found matching:', productName);
    return false;
  }

  private async addProductByCategory(category: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    const products = this.context.currentProducts.filter(p => p.category === category);
    if (products.length === 0) return false;

    const selectedProduct = products[0];
    return await this.addProductToCart(selectedProduct.id, userId);
  }

  private async addProductBySize(size: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    const products = this.context.currentProducts.filter(p => 
      p.sizes && p.sizes.some(s => s.toLowerCase() === size.toLowerCase())
    );
    
    if (products.length === 0) return false;

    const selectedProduct = products[0];
    return await this.addProductToCart(selectedProduct.id, userId);
  }

  private async addProductByColor(color: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    const products = this.context.currentProducts.filter(p => 
      p.colors && p.colors.some(c => c.toLowerCase().includes(color.toLowerCase()))
    );
    
    if (products.length === 0) return false;

    const selectedProduct = products[0];
    return await this.addProductToCart(selectedProduct.id, userId);
  }

  private async addProductToCart(productId: string, userId: string): Promise<boolean> {
    try {
      console.log('🛒 Adding product to cart:', productId);
      
      const { data: existingItem } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        console.log('📦 Product already in cart, updating quantity');
        const { error } = await supabase
          .from('carts')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        console.log('📦 Adding new product to cart');
        const { error } = await supabase
          .from('carts')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: 1
          });
        
        if (error) throw error;
      }

      console.log('✅ Product added to cart successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      return false;
    }
  }

  private async logVoiceCommand(userId: string, command: string, intent?: string, response?: string) {
    try {
      await supabase.from('voice_commands').insert({
        user_id: userId,
        command,
        intent,
        response,
        success: true
      });
    } catch (error) {
      console.error('❌ Error logging voice command:', error);
    }
  }

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const voiceService = new VoiceService();