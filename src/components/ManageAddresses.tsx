import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useSavedAddresses } from '../hooks/useSavedAddresses';
import { useAuth } from '../hooks/useAuth';
import { SavedAddress } from '../lib/supabase';
import toast from 'react-hot-toast';

export function ManageAddresses() {
  const { userProfile } = useAuth();
  const { addresses, loading, saveAddress, updateAddress, deleteAddress, refreshAddresses } = useSavedAddresses();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    phone: '',
    is_default: false
  });

  useEffect(() => {
    if (userProfile) {
      refreshAddresses();
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
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'US',
      phone: '',
      is_default: false
    });
    setIsAddingNew(false);
    setIsEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing address
        await updateAddress(formData.id, {
          name: formData.name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          phone: formData.phone,
          is_default: formData.is_default
        });
        toast.success('Address updated successfully!');
      } else {
        // Add new address
        await saveAddress({
          name: formData.name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          phone: formData.phone,
          is_default: formData.is_default
        });
        toast.success('Address added successfully!');
      }

      resetForm();
      refreshAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleEdit = (address: SavedAddress) => {
    setFormData({
      id: address.id,
      name: address.name,
      first_name: address.first_name,
      last_name: address.last_name,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      phone: address.phone || '',
      is_default: address.is_default
    });
    setIsEditing(address.id);
    setIsAddingNew(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      try {
        await deleteAddress(id);
        toast.success('Address deleted successfully!');
        setConfirmDelete(null);
        refreshAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address. Please try again.');
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateAddress(id, { is_default: true });
      toast.success('Default address updated successfully!');
      refreshAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address. Please try again.');
    }
  };

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to manage your addresses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
          Manage Addresses
        </h1>
        <p className="text-gray-600">Add, edit, and manage your saved shipping addresses</p>
      </div>

      {/* Address Form */}
      {(isAddingNew || isEditing) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 font-['Quicksand']">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="E.g., Home, Work, Details 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              />
              <p className="text-xs text-gray-500 mt-1">A name to help you identify this address</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apartment, Suite, etc. (optional)
              </label>
              <input
                type="text"
                name="address_line_2"
                value={formData.address_line_2}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
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
                Set as default address
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
              >
                {isEditing ? 'Update Address' : 'Add Address'}
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
          Add New Address
        </button>
      )}

      {/* Addresses List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 font-['Quicksand']">
          Your Addresses
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
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any saved addresses yet</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center px-6 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`bg-white rounded-2xl shadow-sm border ${address.is_default ? 'border-[#FF0076]' : 'border-gray-100'} p-6`}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">{address.name}</h3>
                    {address.is_default && (
                      <span className="text-xs bg-[#FF0076] text-white px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#FF0076] transition-colors"
                        title="Set as default"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#FF0076] transition-colors"
                      title="Edit address"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        confirmDelete === address.id 
                        ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-red-500'
                      }`}
                      title={confirmDelete === address.id ? "Confirm delete" : "Delete address"}
                    >
                      {confirmDelete === address.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    {confirmDelete === address.id && (
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
                  <p className="font-medium">{address.first_name} {address.last_name}</p>
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && (
                    <p>{address.address_line_2}</p>
                  )}
                  <p>
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && (
                    <p className="text-gray-500">{address.phone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}