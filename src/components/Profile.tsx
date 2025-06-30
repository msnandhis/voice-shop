import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit3, Save, X, MapPin, CreditCard, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSavedAddresses } from '../hooks/useSavedAddresses';
import { useSavedCards } from '../hooks/useSavedCards';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Profile() {
  const { userProfile, user } = useAuth();
  const { addresses, refreshAddresses } = useSavedAddresses();
  const { cards, refreshCards } = useSavedCards();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    savedCards: 0
  });

  useEffect(() => {
    if (userProfile) {
      setEditData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || ''
      });
      loadUserStats();
    }
  }, [userProfile]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      savedAddresses: addresses.length,
      savedCards: cards.length
    }));
  }, [addresses, cards]);

  const loadUserStats = async () => {
    if (!userProfile) return;

    try {
      // Get total orders and spending
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', userProfile.id);

      if (!error && orders) {
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders,
          totalSpent
        }));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      full_name: userProfile?.full_name || '',
      email: userProfile?.email || ''
    });
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
          My Profile
        </h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-['Quicksand']">
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userProfile.full_name || 'User'}
                  </h3>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(userProfile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.full_name}
                      onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userProfile.full_name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-900">{userProfile.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Created
                  </label>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-900">
                      {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <p className="text-gray-900 py-2">
                    {new Date(userProfile.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <Package className="w-8 h-8 text-[#FF0076] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">$</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.savedAddresses}</p>
              <p className="text-sm text-gray-600">Addresses</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <CreditCard className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.savedCards}</p>
              <p className="text-sm text-gray-600">Payment Methods</p>
            </div>
          </div>

          {/* User Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Order History Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Package className="w-10 h-10 text-[#FF0076] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Quicksand']">Order History</h3>
              <p className="text-gray-600 mb-4 text-sm">View and track your past orders and purchases</p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.handleViewOrders(); }} className="inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/90">
                View orders <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Manage Addresses Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <MapPin className="w-10 h-10 text-[#FF0076] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Quicksand']">Addresses</h3>
              <p className="text-gray-600 mb-4 text-sm">Manage your shipping and billing addresses</p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "#/manage-addresses"; }} className="inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/90">
                Manage addresses <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Payment Methods Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <CreditCard className="w-10 h-10 text-[#FF0076] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Quicksand']">Payment Methods</h3>
              <p className="text-gray-600 mb-4 text-sm">Update your saved payment methods</p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "#/payment-settings"; }} className="inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/90">
                Manage payments <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Quicksand'] flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#FF0076]" />
                Saved Addresses
              </h3>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  window.location.href = "#/manage-addresses"; 
                }}
                className="text-sm text-[#FF0076] hover:underline"
              >
                View All
              </a>
            </div>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.slice(0, 2).map((address) => (
                  <div key={address.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{address.name}</span>
                      {address.is_default && (
                        <span className="text-xs bg-[#FF0076] text-white px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.address_line_1}, {address.city}, {address.state}
                    </p>
                  </div>
                ))}
                {addresses.length > 2 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{addresses.length - 2} more addresses
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">No saved addresses</p>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "#/manage-addresses";
                  }}
                  className="text-sm text-[#FF0076] hover:underline mt-2 inline-block"
                >
                  Add address
                </a>
              </div>
            )}
          </div>

          {/* Saved Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Quicksand'] flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#FF0076]" />
                Payment Methods
              </h3>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "#/payment-settings";
                }}
                className="text-sm text-[#FF0076] hover:underline"
              >
                View All
              </a>
            </div>
            {cards.length > 0 ? (
              <div className="space-y-3">
                {cards.slice(0, 2).map((card) => (
                  <div key={card.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{card.name}</span>
                      {card.is_default && (
                        <span className="text-xs bg-[#FF0076] text-white px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {card.card_brand} •••• {card.last_four}
                    </p>
                  </div>
                ))}
                {cards.length > 2 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{cards.length - 2} more cards
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">No saved payment methods</p>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "#/payment-settings";
                  }}
                  className="text-sm text-[#FF0076] hover:underline mt-2 inline-block"
                >
                  Add payment method
                </a>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Quicksand'] flex items-center">
                <Package className="w-5 h-5 mr-2 text-[#FF0076]" />
                Recent Orders
              </h3>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.handleViewOrders();
                }}
                className="text-sm text-[#FF0076] hover:underline"
              >
                View All
              </a>
            </div>
            {stats.totalOrders > 0 ? (
              <p className="text-gray-700">
                You have placed {stats.totalOrders} {stats.totalOrders === 1 ? 'order' : 'orders'} with us.
              </p>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">No orders yet</p>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.handleBrowseProducts('');
                  }}
                  className="text-sm text-[#FF0076] hover:underline mt-2 inline-block"
                >
                  Start shopping
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}