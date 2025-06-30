import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, Search, Filter, Eye, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Order } from '../lib/supabase';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

interface OrderWithItems extends Order {
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image_url?: string;
    } | null;
  }>;
}

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export function Orders() {
  const { userProfile } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadOrders();
    }
  }, [userProfile]);

  const loadOrders = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            quantity,
            price,
            product:products(
              id,
              name,
              image_url
            )
          )
        `)
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } else {
        console.log('Loaded orders:', data);
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayForOrder = async (orderId: string) => {
    if (!userProfile) {
      toast.error('Please sign in to make a payment');
      return;
    }

    if (!stripePromise) {
      toast.error('Payment system is not properly configured');
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Find the order
      const order = orders.find(o => o.id === orderId);
      if (!order || !order.order_items) {
        throw new Error('Order details not found');
      }

      // Format cart items for the API
      const cartItems = order.order_items.map(item => ({
        product_id: item.product?.id,
        quantity: item.quantity,
        product: item.product
      }));

      // Create Stripe Checkout Session for the pending order
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          userId: userProfile.id,
          orderId // Pass the existing order ID
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
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
          Order History
        </h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent bg-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {orders.length === 0 ? 'No orders yet' : 'No orders found'}
          </h3>
          <p className="text-gray-600 mb-8">
            {orders.length === 0 
              ? 'Start shopping to see your orders here!' 
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {orders.length === 0 && (
            <div className="text-sm text-gray-500">
              <p>Voice commands you can try:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"Show me products"</li>
                <li>"Add the first product to my cart"</li>
                <li>"Take me to checkout"</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 font-['Quicksand']">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#FF0076]">
                    {formatPrice(order.total_amount)}
                  </p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-sm text-[#FF0076] hover:text-[#FF0076]/80 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Order Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment Status</p>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'}
                    </span>
                    
                    {order.payment_status === 'pending' && (
                      <button
                        onClick={() => handlePayForOrder(order.id)}
                        disabled={processingPayment}
                        className="ml-2 inline-flex items-center px-2 py-1 rounded-md bg-[#FF0076] text-white text-xs hover:bg-[#FF0076]/90 transition-colors"
                      >
                        {processingPayment ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
                
                {order.tracking_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Tracking Number</p>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {order.tracking_number}
                    </p>
                  </div>
                )}
              </div>

              {order.estimated_delivery && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated Delivery:</span> {' '}
                    {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {order.payment_status === 'pending' && (
                      <span className="ml-1 text-amber-600">(awaiting payment)</span>
                    )}
                  </p>
                </div>
              )}

              {/* Order Items Preview */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Items ({order.order_items.length})
                  </p>
                  <div className="flex space-x-3 overflow-x-auto">
                    {order.order_items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex-shrink-0 flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                        <img
                          src={item.product?.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                          alt={item.product?.name || 'Product'}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">
                            {item.product?.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <div className="flex-shrink-0 flex items-center justify-center w-20 h-16 bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-600">+{order.order_items.length - 3} more</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Banner for Pending Orders */}
              {order.payment_status === 'pending' && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                      Payment required to process this order. 
                      <button 
                        onClick={() => handlePayForOrder(order.id)}
                        disabled={processingPayment}
                        className="ml-2 font-medium underline hover:text-amber-800 transition-colors"
                      >
                        Complete payment now
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-['Quicksand']">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Order ID</p>
                      <p className="font-medium">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-medium text-[#FF0076] text-lg">
                        {formatPrice(selectedOrder.total_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="text-[#FF0076] w-5 h-5 mr-2 flex-shrink-0" />
                        <p className="font-medium text-gray-700">Payment Status</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                          {selectedOrder.payment_status?.charAt(0).toUpperCase() + selectedOrder.payment_status?.slice(1) || 'Unknown'}
                        </span>
                        
                        {selectedOrder.payment_status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(null);
                              handlePayForOrder(selectedOrder.id);
                            }}
                            disabled={processingPayment}
                            className="ml-2 text-[#FF0076] text-sm font-medium hover:underline"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {selectedOrder.payment_status === 'pending' && (
                      <div className="mt-3 bg-amber-50 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-700">
                            Your order will be processed after payment is completed. Complete your payment to avoid order cancellation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</p>
                      <p>{selectedOrder.shipping_address.address_line_1}</p>
                      {selectedOrder.shipping_address.address_line_2 && (
                        <p>{selectedOrder.shipping_address.address_line_2}</p>
                      )}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip_code}</p>
                      {selectedOrder.shipping_address.phone && (
                        <p>{selectedOrder.shipping_address.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tracking Information */}
                {selectedOrder.tracking_number && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tracking Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Tracking Number</p>
                          <p className="font-mono font-medium">{selectedOrder.tracking_number}</p>
                        </div>
                        {selectedOrder.estimated_delivery && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Estimated Delivery</p>
                            <p className="font-medium">
                              {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                          <img
                            src={item.product?.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                            alt={item.product?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product?.name || 'Unknown Product'}
                            </h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}