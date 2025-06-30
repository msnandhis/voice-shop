import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useSavedCards } from '../hooks/useSavedCards';
import { useAuth } from '../hooks/useAuth';
import { SavedCard } from '../lib/supabase';
import toast from 'react-hot-toast';

export function PaymentSettings() {
  const { userProfile } = useAuth();
  const { cards, loading, saveCard, updateCard, deleteCard, refreshCards } = useSavedCards();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    card_brand: 'Visa',
    last_four: '',
    expiry_month: '',
    expiry_year: '',
    cardholder_name: '',
    is_default: false
  });

  useEffect(() => {
    if (userProfile) {
      refreshCards();
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      card_brand: 'Visa',
      last_four: '',
      expiry_month: '',
      expiry_year: '',
      cardholder_name: '',
      is_default: false
    });
    setIsAddingNew(false);
    setIsEditing(null);
  };

  const validateCardForm = () => {
    // Validation for last 4 digits
    if (!/^\d{4}$/.test(formData.last_four)) {
      toast.error('Please enter the last 4 digits of your card number');
      return false;
    }

    // Validate expiry month
    if (!/^(0?[1-9]|1[0-2])$/.test(formData.expiry_month)) {
      toast.error('Please enter a valid month (1-12)');
      return false;
    }

    // Validate expiry year
    const currentYear = new Date().getFullYear();
    const lastTwoDigits = currentYear % 100;
    let enteredYear = parseInt(formData.expiry_year);
    
    // If they entered 4 digits (e.g. 2025), convert to 2 digits
    if (formData.expiry_year.length === 4) {
      enteredYear = enteredYear % 100;
    }
    
    if (!/^\d{2}$/.test(formData.expiry_year) && !/^\d{4}$/.test(formData.expiry_year)) {
      toast.error('Please enter a valid year (YY or YYYY format)');
      return false;
    }
    
    if (enteredYear < lastTwoDigits) {
      toast.error('The expiry year cannot be in the past');
      return false;
    }

    // Store the last two digits of the year
    formData.expiry_year = formData.expiry_year.length === 4 ? 
      formData.expiry_year.slice(-2) : formData.expiry_year;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCardForm()) {
      return;
    }

    try {
      if (isEditing) {
        // Update existing card
        await updateCard(formData.id, {
          name: formData.name,
          card_brand: formData.card_brand,
          last_four: formData.last_four,
          expiry_month: formData.expiry_month,
          expiry_year: formData.expiry_year,
          cardholder_name: formData.cardholder_name,
          is_default: formData.is_default
        });
        toast.success('Payment method updated successfully!');
      } else {
        // Add new card
        await saveCard({
          name: formData.name,
          card_brand: formData.card_brand,
          last_four: formData.last_four,
          expiry_month: formData.expiry_month,
          expiry_year: formData.expiry_year,
          cardholder_name: formData.cardholder_name,
          is_default: formData.is_default
        });
        toast.success('Payment method added successfully!');
      }

      resetForm();
      refreshCards();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method. Please try again.');
    }
  };

  const handleEdit = (card: SavedCard) => {
    setFormData({
      id: card.id,
      name: card.name,
      card_brand: card.card_brand,
      last_four: card.last_four,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      cardholder_name: card.cardholder_name,
      is_default: card.is_default
    });
    setIsEditing(card.id);
    setIsAddingNew(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      try {
        await deleteCard(id);
        toast.success('Payment method deleted successfully!');
        setConfirmDelete(null);
        refreshCards();
      } catch (error) {
        console.error('Error deleting payment method:', error);
        toast.error('Failed to delete payment method. Please try again.');
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateCard(id, { is_default: true });
      toast.success('Default payment method updated successfully!');
      refreshCards();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method. Please try again.');
    }
  };

  const getCardIcon = (cardBrand: string) => {
    switch (cardBrand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to manage your payment methods</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
          Payment Methods
        </h1>
        <p className="text-gray-600">Add, edit, and manage your saved payment methods</p>
      </div>

      {/* Note about security */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-blue-700 font-medium mb-1">Security Notice</p>
          <p className="text-sm text-blue-600">
            For your security, we only store the last 4 digits of your card number. In a real production environment, card information would be tokenized and stored securely with a payment processor like Stripe.
          </p>
        </div>
      </div>

      {/* Payment Method Form */}
      {(isAddingNew || isEditing) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 font-['Quicksand']">
            {isEditing ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Nickname *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="E.g., Personal Card, Work Card"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              />
              <p className="text-xs text-gray-500 mt-1">A name to help you identify this card</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type *
                </label>
                <select
                  name="card_brand"
                  value={formData.card_brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                  <option value="Discover">Discover</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last 4 Digits *
                </label>
                <input
                  type="text"
                  name="last_four"
                  value={formData.last_four}
                  onChange={handleInputChange}
                  required
                  pattern="\d{4}"
                  maxLength={4}
                  placeholder="1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
                <p className="text-xs text-gray-500 mt-1">For security, we only store the last 4 digits</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholder_name"
                value={formData.cardholder_name}
                onChange={handleInputChange}
                required
                placeholder="Name as it appears on card"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month *
                </label>
                <input
                  type="text"
                  name="expiry_month"
                  value={formData.expiry_month}
                  onChange={handleInputChange}
                  required
                  placeholder="MM (e.g., 01)"
                  maxLength={2}
                  pattern="(0?[1-9]|1[0-2])"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year *
                </label>
                <input
                  type="text"
                  name="expiry_year"
                  value={formData.expiry_year}
                  onChange={handleInputChange}
                  required
                  placeholder="YY or YYYY (e.g., 27 or 2027)"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={formData.is_default}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#FF0076] focus:ring-[#FF0076] border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
              >
                {isEditing ? 'Update Payment Method' : 'Add Payment Method'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Button */}
      {!isAddingNew && !isEditing && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center px-6 py-3 mb-8 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Payment Method
        </button>
      )}

      {/* Payment Methods List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 font-['Quicksand']">
          Your Payment Methods
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any saved payment methods yet</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center px-6 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Payment Method
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className={`bg-white rounded-2xl shadow-sm border ${card.is_default ? 'border-[#FF0076]' : 'border-gray-100'} p-6`}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <span className="text-2xl mr-2">{getCardIcon(card.card_brand)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                    </div>
                    {card.is_default && (
                      <span className="text-xs bg-[#FF0076] text-white px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    {!card.is_default && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#FF0076] transition-colors"
                        title="Set as default"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(card)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#FF0076] transition-colors"
                      title="Edit payment method"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        confirmDelete === card.id 
                        ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-red-500'
                      }`}
                      title={confirmDelete === card.id ? "Confirm delete" : "Delete payment method"}
                    >
                      {confirmDelete === card.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    {confirmDelete === card.id && (
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p className="font-medium">{card.card_brand} •••• {card.last_four}</p>
                  <p>{card.cardholder_name}</p>
                  <p className="text-gray-500">Expires {card.expiry_month}/{card.expiry_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}