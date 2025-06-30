/*
  # Add Saved Addresses for Enhanced Checkout

  1. New Tables
    - `saved_addresses` - User's saved shipping/billing addresses
    - Enhanced orders table for tracking

  2. Security
    - Enable RLS on saved_addresses table
    - Add policies for users to manage their own addresses

  3. Features
    - Multiple saved addresses per user
    - Default address selection
    - Order tracking information
*/

-- Create saved addresses table
CREATE TABLE IF NOT EXISTS saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL, -- e.g., "Home", "Work", "Details 1"
  first_name text NOT NULL,
  last_name text NOT NULL,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text DEFAULT 'US' NOT NULL,
  phone text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on saved_addresses
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- Policies for saved addresses
CREATE POLICY "Users can manage own saved addresses" ON saved_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Add tracking info to orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery date;
  END IF;
END $$;

-- Add trigger for updated_at on saved_addresses
CREATE TRIGGER on_saved_addresses_updated
  BEFORE UPDATE ON saved_addresses
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample saved address for existing users (for demo purposes)
INSERT INTO saved_addresses (user_id, name, first_name, last_name, address_line_1, city, state, zip_code, phone, is_default)
SELECT 
  p.id,
  'Details 1',
  COALESCE(SPLIT_PART(p.full_name, ' ', 1), 'John'),
  COALESCE(SPLIT_PART(p.full_name, ' ', 2), 'Doe'),
  '123 Main Street',
  'San Francisco',
  'CA',
  '94102',
  '(555) 123-4567',
  true
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM saved_addresses sa WHERE sa.user_id = p.id
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_default ON saved_addresses(user_id, is_default);