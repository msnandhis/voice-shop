import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SavedCard } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSavedCards() {
  const { userProfile } = useAuth();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadCards();
    } else {
      setCards([]);
    }
  }, [userProfile]);

  const loadCards = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_cards')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading saved cards:', error);
        setCards([]);
      } else {
        setCards(data || []);
      }
    } catch (error) {
      console.error('Error loading saved cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCard = async (card: Omit<SavedCard, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userProfile) return;

    try {
      // If this is being set as default, unset other defaults first
      if (card.is_default) {
        await supabase
          .from('saved_cards')
          .update({ is_default: false })
          .eq('user_id', userProfile.id);
      }

      const { error } = await supabase
        .from('saved_cards')
        .insert({
          ...card,
          user_id: userProfile.id
        });

      if (error) {
        console.error('Error saving card:', error);
        throw new Error('Failed to save card');
      }

      await loadCards();
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  };

  const updateCard = async (id: string, updates: Partial<SavedCard>) => {
    try {
      // If this is being set as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from('saved_cards')
          .update({ is_default: false })
          .eq('user_id', userProfile?.id);
      }

      const { error } = await supabase
        .from('saved_cards')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating card:', error);
        throw new Error('Failed to update card');
      }

      await loadCards();
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting card:', error);
        throw new Error('Failed to delete card');
      }

      await loadCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const getDefaultCard = () => {
    return cards.find(card => card.is_default) || cards[0];
  };

  const getCardByName = (name: string) => {
    return cards.find(card => 
      card.name.toLowerCase().includes(name.toLowerCase()) ||
      card.name.toLowerCase() === name.toLowerCase()
    );
  };

  const getCardByNumber = (number: string) => {
    const cardIndex = parseInt(number) - 1;
    return cards[cardIndex];
  };

  return {
    cards,
    loading,
    saveCard,
    updateCard,
    deleteCard,
    getDefaultCard,
    getCardByName,
    getCardByNumber,
    refreshCards: loadCards
  };
}