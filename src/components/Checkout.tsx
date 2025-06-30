import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, MapPin, User, Package, Calendar, Calendar as CardIcon, XCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useSavedAddresses } from '../hooks/useSavedAddresses';
import { useSavedCards } from '../hooks/useSavedCards';
import { supabase } from '../lib/supabase';
import { SavedAddress, SavedCard } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

interface CheckoutProps {
  onBack?: () => void;
  onComplete?: () => void;
}

// Load Stripe outside of component render to avoid recreating it
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export function Checkout({ onBack, onComplete }: CheckoutProps) {
  const { userProfile } = useAuth();
  const { cart, getTotalPrice, clearCart, refreshCart } = useCart();
  const { addresses, loading: addressLoading, getDefaultAddress, getAddressByName } = useSavedAddresses();
  const { cards, loading: cardsLoading, getDefaultCard, getCardByName, getCardByNumber } = useSavedCards();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [useNewCard, setUseNewCard] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [newAddressData, setNewAddressData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  
  // Check if Stripe is properly configured
  if (!stripePublishableKey) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-['Quicksand']">
            Payment Setup Required
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            To enable payments, please configure your Stripe API key in the environment variables.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-700 mb-2">
              <strong>Missing:</strong> VITE_STRIPE_PUBLISHABLE_KEY
            </p>
            <p className="text-sm text-red-600">
              Please add your Stripe publishable key to the .env file and restart the development server.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Check for status params for Stripe redirect
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');
    const sessionId = query.get('session_id');
    
    if (status) {
      if (status === 'success' && sessionId) {
        toast.success('Payment successful! Processing your order...');
        handleOrderCompletion(sessionId);
      } else if (status === 'cancel') {
        toast.error('Payment was cancelled. Please try again when you\'re ready.');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    // Auto-select default address and card when data loads
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    }

    if (cards.length > 0 && !selectedCard) {
      const defaultCard = getDefaultCard();
      if (defaultCard) {
        setSelectedCard(defaultCard);
      }
    }
  }, [addresses, cards, selectedAddress, selectedCard, getDefaultAddress, getDefaultCard]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddress(address);
    setUseNewAddress(false);
  };

  const handleCardSelect = (card: SavedCard) => {
    setSelectedCard(card);
    setUseNewCard(false);
  };

  const handleUseAddressByVoice = (addressIdentifier: string) => {
    const address = getAddressByName(addressIdentifier);
    if (address) {
      setSelectedAddress(address);
      setUseNewAddress(false);
      toast.success(`Using ${address.name} for shipping`);
      return true;
    }
    return false;
  };

  const handleUseCardByVoice = (cardIdentifier: string) => {
    // Handle voice commands like "use card 1", "select card 2", etc.
    let card = null;
    
    // Try by name first
    card = getCardByName(cardIdentifier);
    
    // If not found by name, try by number
    if (!card) {
      const numberMatch = cardIdentifier.match(/(\d+)/);
      if (numberMatch) {
        card = getCardByNumber(numberMatch[1]);
      }
    }

    if (card) {
      setSelectedCard(card);
      setUseNewCard(false);
      toast.success(`Using ${card.name} (ending in ${card.last_four}) for payment`);
      return true;
    }
    return false;
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddressData(prev => ({ ...prev, [name]: value }));
  };

  const generateTrackingNumber = () => {
    return 'VS' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3); // 3-5 days
    return deliveryDate.toISOString().split('T')[0];
  };
  
  const handleOrderCompletion = async (sessionId: string) => {
    setProcessing(true);
    
    try {
      // Get the shipping address from the completed Checkout Session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-webhook-handler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'verify_session', 
          session_id: sessionId 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify payment session');
      }
      
      const sessionData = await response.json();
      
      if (!sessionData.success) {
        throw new Error('Payment verification failed');
      }
      
      const shippingAddress = sessionData.session.shipping?.address;
      const customerName = sessionData.session.shipping?.name;
      const customerEmail = sessionData.session.customer_details?.email;
      const amountTotal = sessionData.session.amount_total / 100; // Convert from cents
      
      // Format name into first and last name
      let firstName = '';
      let lastName = '';
      
      if (customerName) {
        const nameParts = customerName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      
      // Create formatted address for database
      const formattedAddress = {
        first_name: firstName || userProfile?.full_name?.split(' ')[0] || '',
        last_name: lastName || userProfile?.full_name?.split(' ').slice(1).join(' ') || '',
        address_line_1: shippingAddress?.line1 || '',
        address_line_2: shippingAddress?.line2 || '',
        city: shippingAddress?.city || '',
        state: shippingAddress?.state || '',
        zip_code: shippingAddress?.postal_code || '',
        country: shippingAddress?.country || 'US',
        phone: sessionData.session.customer_details?.phone || ''
      };
      
      const trackingNumber = generateTrackingNumber();
      const estimatedDelivery = getEstimatedDelivery();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userProfile?.id,
          total_amount: amountTotal,
          status: 'processing',
          payment_status: 'completed',
          shipping_address: formattedAddress,
          tracking_number: trackingNumber,
          estimated_delivery: estimatedDelivery
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Save order details for success page
      setOrderDetails({
        ...order,
        shippingAddress: formattedAddress,
        paymentMethod: {
          card_brand: sessionData.session.payment_intent?.payment_method_types[0] || 'Credit Card',
          last_four: sessionData.session.payment_intent?.last4 || '****'
        },
        itemCount: cart.length,
        items: cart
      });
      
      setCompleted(true);
      toast.success('Order placed successfully!');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Delay completion to give user time to see success screen
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 5000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your order. Please contact support.');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userProfile) {
      toast.error('Please sign in to complete your purchase');
      return;
    }

    if ((!selectedAddress && !useNewAddress) || (!selectedCard && !useNewCard)) {
      toast.error('Please select both shipping address and payment method');
      return;
    }

    if (!stripePromise) {
      toast.error('Payment system is not properly configured. Please contact support.');
      return;
    }

    setProcessing(true);
    
    try {
      // Create Stripe Checkout Session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cart,
          userId: userProfile.id
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      // Either redirect to the URL or use redirectToCheckout
      if (data.url) {
        window.location.href = data.url;
      } else {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  // Expose functions for voice commands
  useEffect(() => {
    (window as any).handleUseAddressByVoice = handleUseAddressByVoice;
    (window as any).handleUseCardByVoice = handleUseCardByVoice;
    (window as any).handleCheckoutSubmit = handleSubmit;
    
    return () => {
      delete (window as any).handleUseAddressByVoice;
      delete (window as any).handleUseCardByVoice;
      delete (window as any).handleCheckoutSubmit;
    };
  }, [addresses, cards, selectedAddress, selectedCard, useNewAddress, useNewCard]);

  if (completed && orderDetails) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-['Quicksand']">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-xl p-8 mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-['Quicksand'] text-center">
              Order Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Order Total</p>
                <p className="text-2xl font-bold text-[#FF0076]">
                  {formatPrice(orderDetails.total_amount)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Items Ordered</p>
                <p className="text-xl font-semibold text-gray-900">
                  {orderDetails.itemCount} {orderDetails.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            
            {/* Items List */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Items in Your Order:</h4>
              <div className="space-y-2">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-sm text-gray-700">
                      {item.product?.name} (x{item.quantity})
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CardIcon className="w-6 h-6 text-[#FF0076] mr-3" />
                  <span className="font-medium text-gray-700">Payment Method</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {orderDetails.paymentMethod.card_brand} •••• {orderDetails.paymentMethod.last_four}
                </span>
              </div>
            </div>
            
            {/* Tracking Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Shipping & Tracking</h4>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Package className="w-6 h-6 text-[#FF0076] mr-3" />
                    <span className="font-medium text-gray-700">Tracking Number</span>
                  </div>
                  <span className="text-lg font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                    {orderDetails.tracking_number}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  You can track your package using this number on our website or with our shipping partners.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-[#FF0076] mr-3" />
                    <span className="font-medium text-gray-700">Estimated Delivery</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(orderDetails.estimated_delivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  We'll send you updates as your order moves through our fulfillment process.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-[#FF0076] mr-3 mt-1" />
                  <div>
                    <span className="font-medium text-gray-700 block mb-2">Shipping Address</span>
                    <div className="text-gray-900">
                      <p className="font-medium">
                        {orderDetails.shippingAddress.first_name} {orderDetails.shippingAddress.last_name}
                      </p>
                      <p>{orderDetails.shippingAddress.address_line_1}</p>
                      {orderDetails.shippingAddress.address_line_2 && (
                        <p>{orderDetails.shippingAddress.address_line_2}</p>
                      )}
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip_code}
                      </p>
                      {orderDetails.shippingAddress.phone && (
                        <p className="text-gray-600">{orderDetails.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>📧 You'll receive an email confirmation with your order details</p>
              <p>📦 We'll notify you when your order ships with tracking information</p>
              <p>🚚 Track your package using the tracking number above</p>
              <p>💬 Try saying "Show me products" to continue shopping!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalPrice();
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + tax;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>
        
        <h1 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
          Checkout
        </h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Voice Commands Help */}
          <div className="bg-gradient-to-r from-[#FF0076]/10 to-blue-50 border border-[#FF0076]/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#FF0076] mb-2">Voice Commands Available:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
              <div>
                <p className="font-medium">Address:</p>
                <p>"Use details 1"</p>
                <p>"Use address 2"</p>
              </div>
              <div>
                <p className="font-medium">Payment:</p>
                <p>"Use card 1"</p>
                <p>"Select card 2"</p>
              </div>
              <div>
                <p className="font-medium">Order:</p>
                <p>"Place order"</p>
                
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Quicksand']">
              Shipping Address
            </h3>

            {addressLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                {/* Saved Addresses */}
                {addresses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Saved Addresses</h4>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedAddress?.id === address.id && !useNewAddress
                              ? 'border-[#FF0076] bg-[#FF0076]/5'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => handleAddressSelect(address)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{address.name}</span>
                                {address.is_default && (
                                  <span className="text-xs bg-[#FF0076] text-white px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.first_name} {address.last_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.address_line_1}
                                {address.address_line_2 && `, ${address.address_line_2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              {address.phone && (
                                <p className="text-sm text-gray-600">{address.phone}</p>
                              )}
                            </div>
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1
                              ${selectedAddress?.id === address.id && !useNewAddress
                                ? 'border-[#FF0076] bg-[#FF0076]'
                                : 'border-gray-300'
                              }
                            `}>
                              {selectedAddress?.id === address.id && !useNewAddress && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Address Option */}
                <div
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all mb-4
                    ${useNewAddress
                      ? 'border-[#FF0076] bg-[#FF0076]/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => {
                    setUseNewAddress(true);
                    setSelectedAddress(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Use New Address</span>
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex-shrink-0
                      ${useNewAddress
                        ? 'border-[#FF0076] bg-[#FF0076]'
                        : 'border-gray-300'
                      }
                    `}>
                      {useNewAddress && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* New Address Form */}
                {useNewAddress && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={newAddressData.firstName}
                          onChange={handleNewAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={newAddressData.lastName}
                          onChange={handleNewAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={newAddressData.address}
                        onChange={handleNewAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={newAddressData.city}
                          onChange={handleNewAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={newAddressData.state}
                          onChange={handleNewAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={newAddressData.zipCode}
                        onChange={handleNewAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddressData.phone}
                        onChange={handleNewAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Quicksand']">
              Payment Information
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to Stripe to complete your secure payment.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-6">
              <Lock className="w-5 h-5 text-blue-600 mt-1 mr-2" />
              <p className="text-sm text-blue-700">
                Your payment information is secured by Stripe. We never store your card details.
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <span className="text-gray-700">Credit/Debit Card</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={processing || (!userProfile)}
            className={`
              w-full inline-flex items-center justify-center px-6 py-4 font-semibold rounded-lg text-lg
              transition-all duration-300 transform hover:scale-[1.02]
              ${processing || (!userProfile)
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#FF0076] hover:bg-[#FF0076]/90 shadow-lg hover:shadow-xl'
              } text-white
            `}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processing Your Order...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-3" />
                Pay with Stripe - {formatPrice(finalTotal)}
              </>
            )}
          </button>
          
          <div className="text-center text-sm text-gray-500">
            <p>💬 Say "Place order" or "Pay now" to complete your purchase</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Quicksand']">
            Order Summary
          </h3>
          
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.product?.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                  alt={item.product?.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice((item.product?.price || 0) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}