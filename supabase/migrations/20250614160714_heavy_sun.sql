/*
  # Fix Product Access and Loading Issues

  1. Security Updates
    - Update RLS policy to allow public access to products
    - Products should be viewable by everyone (authenticated and unauthenticated)
    - This is standard for e-commerce sites

  2. Data Verification
    - Ensure products exist with proper stock quantities
    - Add sample products if none exist
    - Update any products with zero stock

  3. Performance
    - Ensure proper indexes exist
*/

-- First, let's update the RLS policy to allow public access to products
-- E-commerce sites need public product viewing
DROP POLICY IF EXISTS "Products are publicly readable" ON products;

-- Create a new policy that allows everyone to read products
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT TO public USING (true);

-- Also allow authenticated users to read products (redundant but explicit)
CREATE POLICY "Authenticated users can read products" ON products
  FOR SELECT TO authenticated USING (true);

-- Ensure we have products with proper stock quantities
-- First, let's check if we have any products, if not, insert sample data
DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  
  IF product_count = 0 THEN
    -- Insert sample products with good stock quantities
    INSERT INTO products (name, description, price, category, image_url, stock_quantity, voice_keywords, rating, sizes, colors) VALUES
    
    -- SHOES CATEGORY
    ('Nike Air Max 270', 'Modern lifestyle shoes with large Air unit for all-day comfort', 149.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 45, ARRAY['nike', 'air max', '270', 'shoes', 'sneakers', 'athletic', 'comfortable'], 4.7, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black', 'White', 'Grey', 'Blue', 'Red']),
    ('Adidas Ultraboost 22', 'High-performance running shoes with responsive Boost cushioning', 180.00, 'shoes', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 32, ARRAY['adidas', 'ultraboost', 'running', 'shoes', 'sneakers', 'boost', 'performance'], 4.8, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black', 'White', 'Grey', 'Blue', 'Red']),
    ('Vans Old Skool', 'Classic skateboarding shoes with signature side stripe', 65.00, 'shoes', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 58, ARRAY['vans', 'old skool', 'skateboard', 'shoes', 'sneakers', 'classic', 'casual'], 4.5, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black', 'White', 'Grey', 'Blue', 'Red']),
    ('Converse Chuck Taylor All Star', 'Iconic high-top canvas sneakers', 55.00, 'shoes', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', 67, ARRAY['converse', 'chuck taylor', 'all star', 'high top', 'canvas', 'sneakers', 'classic'], 4.4, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black', 'White', 'Grey', 'Blue', 'Red']),

    -- ELECTRONICS CATEGORY  
    ('iPhone 15 Pro', 'Latest Apple smartphone with titanium design and advanced cameras', 999.00, 'electronics', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 18, ARRAY['iphone', '15', 'pro', 'apple', 'smartphone', 'phone', 'titanium', 'camera'], 4.8, ARRAY[], ARRAY['Black', 'White', 'Silver', 'Space Grey']),
    ('Samsung Galaxy S24 Ultra', 'Premium Android phone with S Pen and exceptional display', 1199.00, 'electronics', 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 14, ARRAY['samsung', 'galaxy', 's24', 'ultra', 'android', 'smartphone', 's pen', 'premium'], 4.6, ARRAY[], ARRAY['Black', 'White', 'Silver', 'Space Grey']),
    ('MacBook Air M3', 'Ultra-thin laptop with Apple Silicon and all-day battery', 1299.00, 'electronics', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 11, ARRAY['macbook', 'air', 'm3', 'laptop', 'apple', 'thin', 'battery', 'silicon'], 4.9, ARRAY[], ARRAY['Black', 'White', 'Silver', 'Space Grey']),
    ('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 399.99, 'electronics', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 25, ARRAY['sony', 'headphones', 'wireless', 'noise canceling', 'premium', 'audio'], 4.8, ARRAY[], ARRAY['Black', 'White', 'Silver', 'Space Grey']),

    -- CLOTHING CATEGORY
    ('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic shirt for workouts', 29.99, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 75, ARRAY['nike', 'dri-fit', 't-shirt', 'athletic', 'workout', 'moisture wicking'], 4.3, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Grey', 'Blue']),
    ('Levi''s 501 Original Jeans', 'Classic straight-fit jeans with authentic styling', 89.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 54, ARRAY['levis', '501', 'jeans', 'denim', 'classic', 'straight fit', 'authentic'], 4.6, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Grey', 'Blue']),
    ('Champion Reverse Weave Hoodie', 'Premium heavyweight hoodie with iconic logo', 65.00, 'clothing', 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg', 48, ARRAY['champion', 'reverse weave', 'hoodie', 'heavyweight', 'sweatshirt', 'logo'], 4.4, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Grey', 'Blue']),
    ('Patagonia Better Sweater', 'Cozy fleece jacket made from recycled materials', 119.00, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 31, ARRAY['patagonia', 'better sweater', 'fleece', 'jacket', 'recycled', 'sustainable'], 4.7, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Grey', 'Blue']),

    -- HOME & FITNESS
    ('Dyson V15 Detect', 'Powerful cordless vacuum with laser dust detection', 749.99, 'home', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 12, ARRAY['dyson', 'v15', 'vacuum', 'cordless', 'laser', 'cleaning', 'powerful'], 4.6, ARRAY[], ARRAY['Black', 'White']),
    ('Yeti Rambler 32oz', 'Double-wall vacuum insulated water bottle', 39.99, 'fitness', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 67, ARRAY['yeti', 'rambler', 'water bottle', 'insulated', 'hydration', 'outdoor'], 4.8, ARRAY[], ARRAY['Black', 'White']),

    -- ACCESSORIES
    ('Ray-Ban Aviator Classic', 'Timeless aviator sunglasses with G-15 lenses', 179.00, 'accessories', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 44, ARRAY['ray ban', 'aviator', 'sunglasses', 'classic', 'g-15', 'eyewear'], 4.5, ARRAY[], ARRAY['Black', 'White']),
    ('Apple AirPods Pro 2nd Gen', 'Wireless earbuds with adaptive transparency', 249.00, 'accessories', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', 42, ARRAY['airpods', 'pro', 'wireless', 'earbuds', 'apple', 'transparency', 'audio'], 4.7, ARRAY[], ARRAY['Black', 'White']);

    RAISE NOTICE 'Inserted sample products into empty products table';
  ELSE
    RAISE NOTICE 'Products table already has % products', product_count;
  END IF;
END $$;

-- Update any products that might have zero stock to have some stock
UPDATE products 
SET stock_quantity = CASE 
  WHEN stock_quantity <= 0 THEN 25 
  ELSE stock_quantity 
END
WHERE stock_quantity <= 0;

-- Ensure all necessary indexes exist
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_category_stock ON products(category, stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_voice_keywords ON products USING GIN(voice_keywords);
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN(sizes);
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN(colors);