/*
  # Fix Products Catalog and Ensure Data Loading

  1. Tables
     - Ensure products table has all necessary columns
     - Add comprehensive product catalog
     - Fix any data inconsistencies

  2. Security
     - Ensure RLS policies allow product reading
     - Add proper indexes for performance

  3. Data
     - Insert comprehensive product catalog
     - Ensure voice keywords are properly formatted
*/

-- First, let's make sure we have all the necessary columns
DO $$
BEGIN
  -- Add voice_keywords if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'voice_keywords'
  ) THEN
    ALTER TABLE products ADD COLUMN voice_keywords text[] DEFAULT '{}';
  END IF;
END $$;

-- Clear existing products to avoid conflicts
DELETE FROM products;

-- Insert comprehensive product catalog
INSERT INTO products (name, description, price, category, image_url, stock_quantity, voice_keywords) VALUES

-- SHOES CATEGORY
('Nike Air Max 270', 'Modern lifestyle shoes with large Air unit for all-day comfort', 149.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 45, ARRAY['nike', 'air max', '270', 'shoes', 'sneakers', 'athletic', 'comfortable']),
('Adidas Ultraboost 22', 'High-performance running shoes with responsive Boost cushioning', 180.00, 'shoes', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 32, ARRAY['adidas', 'ultraboost', 'running', 'shoes', 'sneakers', 'boost', 'performance']),
('Vans Old Skool', 'Classic skateboarding shoes with signature side stripe', 65.00, 'shoes', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 58, ARRAY['vans', 'old skool', 'skateboard', 'shoes', 'sneakers', 'classic', 'casual']),
('Converse Chuck Taylor All Star', 'Iconic high-top canvas sneakers', 55.00, 'shoes', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', 67, ARRAY['converse', 'chuck taylor', 'all star', 'high top', 'canvas', 'sneakers', 'classic']),
('Jordan Air Max Retro', 'Basketball-inspired sneakers with retro styling', 159.99, 'shoes', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', 29, ARRAY['jordan', 'air max', 'retro', 'basketball', 'shoes', 'sneakers', 'style']),
('Puma RS-X', 'Bold lifestyle sneakers with chunky silhouette', 89.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 41, ARRAY['puma', 'rs-x', 'lifestyle', 'shoes', 'sneakers', 'chunky', 'bold']),
('New Balance 990v5', 'Premium made-in-USA running shoes', 185.00, 'shoes', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 22, ARRAY['new balance', '990', 'premium', 'running', 'shoes', 'made in usa', 'quality']),
('Allbirds Tree Runners', 'Sustainable sneakers made from eucalyptus tree fiber', 98.00, 'shoes', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 36, ARRAY['allbirds', 'tree runners', 'sustainable', 'eco friendly', 'shoes', 'comfort']),

-- ELECTRONICS CATEGORY  
('iPhone 15 Pro', 'Latest Apple smartphone with titanium design and advanced cameras', 999.00, 'electronics', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 18, ARRAY['iphone', '15', 'pro', 'apple', 'smartphone', 'phone', 'titanium', 'camera']),
('Samsung Galaxy S24 Ultra', 'Premium Android phone with S Pen and exceptional display', 1199.00, 'electronics', 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 14, ARRAY['samsung', 'galaxy', 's24', 'ultra', 'android', 'smartphone', 's pen', 'premium']),
('MacBook Air M3', 'Ultra-thin laptop with Apple Silicon and all-day battery', 1299.00, 'electronics', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 11, ARRAY['macbook', 'air', 'm3', 'laptop', 'apple', 'thin', 'battery', 'silicon']),
('iPad Pro 12.9"', 'Professional tablet with M2 chip and Liquid Retina display', 1099.00, 'electronics', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 16, ARRAY['ipad', 'pro', 'tablet', 'apple', 'm2', 'retina', 'professional', 'display']),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 399.99, 'electronics', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 25, ARRAY['sony', 'headphones', 'wireless', 'noise canceling', 'premium', 'audio']),
('Nintendo Switch OLED', 'Handheld gaming console with vibrant OLED screen', 349.99, 'electronics', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 20, ARRAY['nintendo', 'switch', 'oled', 'gaming', 'console', 'handheld', 'games']),
('PlayStation 5', 'Next-gen gaming console with lightning-fast loading', 499.99, 'electronics', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', 8, ARRAY['playstation', 'ps5', 'gaming', 'console', 'sony', 'next gen', 'fast']),
('Apple Watch Series 9', 'Advanced smartwatch with health monitoring', 429.00, 'electronics', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 33, ARRAY['apple watch', 'series 9', 'smartwatch', 'health', 'fitness', 'wearable']),
('AirPods Pro 2nd Gen', 'Wireless earbuds with adaptive transparency', 249.00, 'electronics', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', 42, ARRAY['airpods', 'pro', 'wireless', 'earbuds', 'apple', 'transparency', 'audio']),
('Dell XPS 13', 'Premium ultrabook with InfinityEdge display', 1249.00, 'electronics', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 9, ARRAY['dell', 'xps', 'ultrabook', 'laptop', 'premium', 'infinity edge', 'display']),

-- CLOTHING CATEGORY
('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic shirt for workouts', 29.99, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 75, ARRAY['nike', 'dri-fit', 't-shirt', 'athletic', 'workout', 'moisture wicking']),
('Levi''s 501 Original Jeans', 'Classic straight-fit jeans with authentic styling', 89.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 54, ARRAY['levis', '501', 'jeans', 'denim', 'classic', 'straight fit', 'authentic']),
('Champion Reverse Weave Hoodie', 'Premium heavyweight hoodie with iconic logo', 65.00, 'clothing', 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg', 48, ARRAY['champion', 'reverse weave', 'hoodie', 'heavyweight', 'sweatshirt', 'logo']),
('Patagonia Better Sweater', 'Cozy fleece jacket made from recycled materials', 119.00, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 31, ARRAY['patagonia', 'better sweater', 'fleece', 'jacket', 'recycled', 'sustainable']),
('Ralph Lauren Polo Shirt', 'Classic cotton polo with iconic pony logo', 89.50, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 43, ARRAY['ralph lauren', 'polo', 'shirt', 'cotton', 'classic', 'pony', 'preppy']),
('Uniqlo Heattech Thermal', 'Ultra-warm base layer for cold weather', 19.90, 'clothing', 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg', 68, ARRAY['uniqlo', 'heattech', 'thermal', 'base layer', 'warm', 'winter']),
('Zara Oversized Blazer', 'Modern tailored blazer for professional wear', 99.90, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 27, ARRAY['zara', 'blazer', 'oversized', 'tailored', 'professional', 'modern']),
('H&M Wide-Leg Trousers', 'Comfortable wide-leg pants for casual wear', 39.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 52, ARRAY['h&m', 'trousers', 'wide leg', 'pants', 'casual', 'comfortable']),

-- HOME & LIFESTYLE
('IKEA Kallax Shelf Unit', 'Versatile storage solution for any room', 79.99, 'home', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 35, ARRAY['ikea', 'kallax', 'shelf', 'storage', 'furniture', 'versatile', 'organization']),
('Dyson V15 Detect', 'Powerful cordless vacuum with laser dust detection', 749.99, 'home', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 12, ARRAY['dyson', 'v15', 'vacuum', 'cordless', 'laser', 'cleaning', 'powerful']),
('Ninja Foodi Air Fryer', 'Multi-functional air fryer for healthy cooking', 199.99, 'home', 'https://images.pexels.com/photos/4638221/pexels-photo-4638221.jpeg', 22, ARRAY['ninja', 'foodi', 'air fryer', 'cooking', 'healthy', 'kitchen', 'appliance']),
('West Elm Mid-Century Coffee Table', 'Stylish walnut coffee table with hairpin legs', 449.00, 'home', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 15, ARRAY['west elm', 'coffee table', 'mid century', 'walnut', 'furniture', 'living room']),

-- FITNESS & SPORTS
('Peloton Bike+', 'Interactive exercise bike with live classes', 2495.00, 'fitness', 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 4, ARRAY['peloton', 'bike', 'exercise', 'fitness', 'interactive', 'classes', 'cardio']),
('Nike Pro Training Set', 'Complete workout set with leggings and sports bra', 89.99, 'fitness', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 38, ARRAY['nike', 'pro', 'training', 'workout', 'set', 'activewear', 'fitness']),
('Bowflex SelectTech Dumbbells', 'Adjustable dumbbells from 5 to 52.5 pounds', 349.00, 'fitness', 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 18, ARRAY['bowflex', 'dumbbells', 'adjustable', 'weights', 'strength', 'home gym']),
('Yeti Rambler 32oz', 'Double-wall vacuum insulated water bottle', 39.99, 'fitness', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 67, ARRAY['yeti', 'rambler', 'water bottle', 'insulated', 'hydration', 'outdoor']),

-- ACCESSORIES
('Ray-Ban Aviator Classic', 'Timeless aviator sunglasses with G-15 lenses', 179.00, 'accessories', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 44, ARRAY['ray ban', 'aviator', 'sunglasses', 'classic', 'g-15', 'eyewear']),
('Coach Leather Crossbody', 'Premium leather crossbody bag with chain strap', 295.00, 'accessories', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 19, ARRAY['coach', 'crossbody', 'bag', 'leather', 'premium', 'chain', 'handbag']),
('Apple AirTag 4-Pack', 'Precision finding device for your belongings', 99.00, 'accessories', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 56, ARRAY['apple', 'airtag', 'tracking', 'finding', 'bluetooth', 'locate']),
('Fossil Gen 6 Smartwatch', 'Wear OS smartwatch with health tracking', 259.00, 'accessories', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 28, ARRAY['fossil', 'gen 6', 'smartwatch', 'wear os', 'health', 'tracking']),

-- BEAUTY & PERSONAL CARE
('Dyson Supersonic Hair Dryer', 'Professional hair dryer with intelligent heat control', 429.99, 'beauty', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 21, ARRAY['dyson', 'supersonic', 'hair dryer', 'professional', 'heat control', 'styling']),
('Fenty Beauty Pro Filt''r Foundation', 'Soft matte foundation in 40 shades', 36.00, 'beauty', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 73, ARRAY['fenty', 'beauty', 'foundation', 'makeup', 'matte', 'inclusive']),

-- BOOKS & MEDIA
('Atomic Habits by James Clear', 'Life-changing guide to building good habits', 18.99, 'books', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 89, ARRAY['atomic habits', 'james clear', 'book', 'self help', 'habits', 'productivity']),
('The Seven Husbands of Evelyn Hugo', 'Captivating novel about a Hollywood icon', 16.99, 'books', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 92, ARRAY['seven husbands', 'evelyn hugo', 'novel', 'fiction', 'hollywood', 'bestseller']),

-- FOOD & BEVERAGE
('Blue Bottle Coffee', 'Single-origin artisanal coffee beans', 22.00, 'food', 'https://images.pexels.com/photos/4638221/pexels-photo-4638221.jpeg', 64, ARRAY['blue bottle', 'coffee', 'beans', 'artisanal', 'single origin', 'gourmet']),
('Hydro Flask 40oz Wide Mouth', 'Insulated water bottle with flex cap', 44.95, 'accessories', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 85, ARRAY['hydro flask', 'water bottle', 'insulated', 'wide mouth', 'flex cap', 'hydration']);

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_products_voice_keywords ON products USING GIN(voice_keywords);
CREATE INDEX IF NOT EXISTS idx_products_category_stock ON products(category, stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity);

-- Ensure RLS policies allow reading products
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Products are publicly readable" ON products;
  
  -- Create new policy
  CREATE POLICY "Products are publicly readable" ON products
    FOR SELECT TO authenticated USING (true);
EXCEPTION
  WHEN duplicate_object THEN
    -- Policy already exists, do nothing
    NULL;
END $$;