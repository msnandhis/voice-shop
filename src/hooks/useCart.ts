import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Product } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useCart() {
  const { userProfile, profileLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && !profileLoading) {
      loadCart();
    } else if (!profileLoading) {
      setCart([]);
    }
  }, [userProfile, profileLoading]);

  const loadCart = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      // Get cart items directly from carts table with product details
      const { data: cartItems } = await supabase
        .from('carts')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userProfile.id);

      setCart(cartItems || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!userProfile) {
      throw new Error('You must be logged in to add items to cart');
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing cart item:', fetchError);
        throw new Error('Failed to check cart. Please try again.');
      }

      if (existingItem) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('carts')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
          throw new Error('Failed to update cart. Please try again.');
        }
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('carts')
          .insert({
            user_id: userProfile.id,
            product_id: productId,
            quantity
          });

        if (insertError) {
          console.error('Error adding to cart:', insertError);
          if (insertError.code === '23503') {
            throw new Error('Account setup incomplete. Please sign out and sign back in.');
          }
          throw new Error('Failed to add item to cart. Please try again.');
        }
      }

      // Immediately reload cart to update UI
      await loadCart();
    } catch (error) {
      console.error('Error in addToCart:', error);
      // Re-throw the error so calling components can handle it
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('carts')
        .update({ quantity })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating quantity:', error);
        throw new Error('Failed to update quantity. Please try again.');
      }

      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error removing from cart:', error);
        throw new Error('Failed to remove item from cart. Please try again.');
      }

      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!userProfile) return;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', userProfile.id);

      if (error) {
        console.error('Error clearing cart:', error);
        throw new Error('Failed to clear cart. Please try again.');
      }

      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    loading: loading || profileLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refreshCart: loadCart
  };
}