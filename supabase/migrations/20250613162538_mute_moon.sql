/*
  # Add Saved Cards for Enhanced Checkout

  1. New Tables
    - `saved_cards` - User's saved payment cards
    
  2. Security
    - Enable RLS on saved_cards table
    - Add policies for users to manage their own cards

  3. Features
    - Multiple saved cards per user
    - Default card selection
    - Secure card storage (last 4 digits only for display)
*/

-- Create saved cards table
CREATE TABLE IF NOT EXISTS saved_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL, -- e.g., "Personal Card", "Work Card", "Card 1"
  card_brand text NOT NULL, -- e.g., "Visa", "Mastercard", "Amex"
  last_four text NOT NULL, -- Last 4 digits for display
  expiry_month text NOT NULL,
  expiry_year text NOT NULL,
  cardholder_name text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on saved_cards
ALTER TABLE saved_cards ENABLE ROW LEVEL SECURITY;

-- Policies for saved cards
CREATE POLICY "Users can manage own saved cards" ON saved_cards
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at on saved_cards
CREATE TRIGGER on_saved_cards_updated
  BEFORE UPDATE ON saved_cards
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample saved cards for existing users (for demo purposes)
INSERT INTO saved_cards (user_id, name, card_brand, last_four, expiry_month, expiry_year, cardholder_name, is_default)
SELECT 
  p.id,
  'Card 1',
  'Visa',
  '4242',
  '12',
  '2028',
  COALESCE(p.full_name, 'John Doe'),
  true
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM saved_cards sc WHERE sc.user_id = p.id
);

-- Add second card for demo
INSERT INTO saved_cards (user_id, name, card_brand, last_four, expiry_month, expiry_year, cardholder_name, is_default)
SELECT 
  p.id,
  'Card 2',
  'Mastercard',
  '5555',
  '08',
  '2027',
  COALESCE(p.full_name, 'John Doe'),
  false
FROM profiles p
WHERE EXISTS (
  SELECT 1 FROM saved_cards sc WHERE sc.user_id = p.id
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_cards_user_id ON saved_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_cards_default ON saved_cards(user_id, is_default);