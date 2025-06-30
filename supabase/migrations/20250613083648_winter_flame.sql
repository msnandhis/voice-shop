/*
  # Add Voice Shopping Features to Existing Schema

  1. New Features
    - Add voice_keywords column to products table for voice search
    - Add payment_status and shipping_address to orders table
    - Create voice_commands table for logging voice interactions

  2. Security
    - Enable RLS on voice_commands table
    - Add policies for voice_commands access
    - Preserve existing product policies

  3. Performance
    - Add indexes for voice search functionality
    - Add indexes for voice commands logging
*/

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add voice_keywords column to products if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'voice_keywords'
  ) THEN
    ALTER TABLE products ADD COLUMN voice_keywords text[] DEFAULT '{}';
  END IF;
END $$;

-- Add payment_status to orders if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
END $$;

-- Add shipping_address to orders if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_address jsonb;
  END IF;
END $$;

-- Create voice commands log table if it doesn't exist
CREATE TABLE IF NOT EXISTS voice_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  command text NOT NULL,
  intent text,
  response text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on voice_commands table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'voice_commands' AND rowsecurity = true
  ) THEN
    ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create voice commands policy only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voice_commands' 
    AND policyname = 'Users can manage own voice commands'
  ) THEN
    CREATE POLICY "Users can manage own voice commands" ON voice_commands
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Insert sample products with voice keywords (only if table is empty or products don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nike Air Max 90') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Nike Air Max 90', 'Classic Nike sneakers with Air Max technology', 129.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', ARRAY['nike', 'sneakers', 'air max', 'shoes', 'athletic'], 50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Adidas Ultraboost 22') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Adidas Ultraboost 22', 'Premium running shoes with Boost technology', 189.99, 'shoes', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', ARRAY['adidas', 'ultraboost', 'running', 'shoes', 'athletic'], 30);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple iPhone 15') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Apple iPhone 15', 'Latest iPhone with advanced camera system', 999.99, 'electronics', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', ARRAY['iphone', 'apple', 'phone', 'smartphone', 'electronics'], 25);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy S24') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 899.99, 'electronics', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', ARRAY['samsung', 'galaxy', 'android', 'phone', 'smartphone'], 20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Levis 501 Jeans') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Levis 501 Jeans', 'Classic straight-leg denim jeans', 69.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', ARRAY['levis', 'jeans', 'denim', 'clothing', 'pants'], 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nike Dri-FIT T-Shirt') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic t-shirt', 29.99, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', ARRAY['nike', 'shirt', 'athletic', 'clothing', 'workout'], 75);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'AirPods Pro') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('AirPods Pro', 'Wireless earbuds with noise cancellation', 249.99, 'electronics', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', ARRAY['airpods', 'earbuds', 'wireless', 'audio', 'apple'], 40);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Patagonia Fleece Jacket') THEN
    INSERT INTO products (name, description, price, category, image_url, voice_keywords, stock_quantity) VALUES
      ('Patagonia Fleece Jacket', 'Warm and comfortable fleece jacket', 149.99, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', ARRAY['patagonia', 'jacket', 'fleece', 'outdoor', 'clothing'], 35);
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_products_voice_keywords ON products USING GIN(voice_keywords);
CREATE INDEX IF NOT EXISTS idx_voice_commands_user_id ON voice_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_created_at ON voice_commands(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category_stock ON products(category, stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);