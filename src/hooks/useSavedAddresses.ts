import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SavedAddress } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSavedAddresses() {
  const { userProfile } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadAddresses();
    } else {
      setAddresses([]);
    }
  }, [userProfile]);

  const loadAddresses = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading saved addresses:', error);
        setAddresses([]);
      } else {
        setAddresses(data || []);
      }
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (address: Omit<SavedAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userProfile) return;

    try {
      // If this is being set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from('saved_addresses')
          .update({ is_default: false })
          .eq('user_id', userProfile.id);
      }

      const { error } = await supabase
        .from('saved_addresses')
        .insert({
          ...address,
          user_id: userProfile.id
        });

      if (error) {
        console.error('Error saving address:', error);
        throw new Error('Failed to save address');
      }

      await loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, updates: Partial<SavedAddress>) => {
    try {
      // If this is being set as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from('saved_addresses')
          .update({ is_default: false })
          .eq('user_id', userProfile?.id);
      }

      const { error } = await supabase
        .from('saved_addresses')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating address:', error);
        throw new Error('Failed to update address');
      }

      await loadAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_addresses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting address:', error);
        throw new Error('Failed to delete address');
      }

      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.is_default) || addresses[0];
  };

  const getAddressByName = (name: string) => {
    return addresses.find(addr => 
      addr.name.toLowerCase().includes(name.toLowerCase()) ||
      addr.name.toLowerCase() === name.toLowerCase()
    );
  };

  return {
    addresses,
    loading,
    saveAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
    getAddressByName,
    refreshAddresses: loadAddresses
  };
}