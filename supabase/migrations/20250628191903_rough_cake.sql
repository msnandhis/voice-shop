-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  logo_url text,
  website_url text,
  country text,
  founded_year integer,
  created_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  color_variant text, -- Which color this image represents
  created_at timestamptz DEFAULT now()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  sku text UNIQUE NOT NULL,
  color text,
  size text,
  material text,
  price numeric(10,2),
  stock_quantity integer DEFAULT 0,
  weight numeric(8,2), -- in grams
  dimensions jsonb, -- {length: x, width: y, height: z}
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create product_attributes table
CREATE TABLE IF NOT EXISTS product_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  attribute_name text NOT NULL,
  attribute_value text NOT NULL,
  attribute_type text DEFAULT 'text', -- text, number, boolean, json
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables (public read access)
CREATE POLICY "Public read access for brands" ON brands FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for product_images" ON product_images FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for product_variants" ON product_variants FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for product_attributes" ON product_attributes FOR SELECT TO public USING (true);

-- Add brand_id to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand_id'
  ) THEN
    ALTER TABLE products ADD COLUMN brand_id uuid REFERENCES brands(id);
  END IF;
END $$;

-- Insert brands
INSERT INTO brands (name, description, logo_url, country, founded_year) VALUES
  ('Nike', 'Just Do It - Leading athletic wear and footwear brand', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 'USA', 1964),
  ('Adidas', 'Impossible is Nothing - German multinational corporation', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 'Germany', 1949),
  ('Apple', 'Think Different - Technology company', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 'USA', 1976),
  ('Samsung', 'Imagine the Possibilities - South Korean multinational', 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 'South Korea', 1938),
  ('Sony', 'Be Moved - Japanese multinational conglomerate', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'Japan', 1946),
  ('Levi''s', 'Quality never goes out of style', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 'USA', 1853),
  ('Patagonia', 'Build the best product, cause no unnecessary harm', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'USA', 1973),
  ('IKEA', 'The wonderful everyday - Swedish furniture retailer', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 'Sweden', 1943),
  ('Dyson', 'Engineering company specializing in household appliances', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 'UK', 1991),
  ('Yeti', 'Built for the wild - Premium coolers and drinkware', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 'USA', 2006),
  ('Vans', 'Off The Wall - Skateboarding culture brand', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 'USA', 1966),
  ('Converse', 'Classic American footwear brand', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', 'USA', 1908);

-- Clear existing products and insert enhanced products with proper brand relationships
DELETE FROM products;

-- Insert enhanced products with brands
WITH brand_lookup AS (
  SELECT id as brand_id, name as brand_name FROM brands
)
INSERT INTO products (name, description, price, category, image_url, stock_quantity, voice_keywords, rating, sizes, colors, brand_id) 
SELECT 
  p.name,
  p.description,
  p.price,
  p.category,
  p.image_url,
  p.stock_quantity,
  p.voice_keywords,
  p.rating,
  p.sizes,
  p.colors,
  b.brand_id
FROM (VALUES
  -- SHOES CATEGORY
  ('Nike Air Max 270', 'Revolutionary Nike Air Max 270 features Nike''s biggest heel Air unit yet for a soft ride that feels as impossible as it looks. Engineered mesh upper wraps your foot in breathable comfort, while a heel overlay rounds out the edgy design.', 149.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 45, ARRAY['nike', 'air max', '270', 'shoes', 'sneakers', 'athletic', 'comfortable', 'running'], 4.7, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black/White', 'Triple White', 'Navy/Orange', 'Red/Black', 'Grey/Blue'], 'Nike'),
  ('Adidas Ultraboost 22', 'Feel the energy return with every step in these high-performance running shoes. They feature responsive BOOST midsole cushioning and a Primeknit+ upper that adapts to the changing shape of your foot through your stride.', 180.00, 'shoes', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 32, ARRAY['adidas', 'ultraboost', 'running', 'shoes', 'sneakers', 'boost', 'performance', 'primeknit'], 4.8, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Core Black', 'Cloud White', 'Solar Yellow', 'Pulse Blue', 'Grey Three'], 'Adidas'),
  ('Nike React Infinity Run', 'Designed to help reduce injury and keep you running. More foam and improved upper details provide a secure and cushioned feel. A wider shape provides a more stable ride.', 159.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 28, ARRAY['nike', 'react', 'infinity', 'running', 'shoes', 'cushioned', 'stability'], 4.6, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black/White', 'Pure Platinum', 'Blue Void', 'White/Black'], 'Nike'),
  ('Vans Old Skool', 'Classic skateboarding shoes with signature side stripe and waffle outsole for superior grip and boardfeel.', 65.00, 'shoes', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 58, ARRAY['vans', 'old skool', 'skateboard', 'shoes', 'sneakers', 'classic', 'casual'], 4.5, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black/White', 'True White', 'Port Royale', 'Dress Blues', 'Checkerboard'], 'Vans'),
  ('Converse Chuck Taylor All Star', 'The iconic high-top canvas sneaker that has been a style staple for over a century. Timeless design meets modern comfort.', 55.00, 'shoes', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', 67, ARRAY['converse', 'chuck taylor', 'all star', 'high top', 'canvas', 'sneakers', 'classic'], 4.4, ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'], ARRAY['Black', 'White', 'Red', 'Navy', 'Optical White'], 'Converse'),
  
  -- ELECTRONICS CATEGORY  
  ('iPhone 15 Pro', 'iPhone 15 Pro. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.', 999.00, 'electronics', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 18, ARRAY['iphone', '15', 'pro', 'apple', 'smartphone', 'phone', 'titanium', 'camera', 'a17'], 4.8, ARRAY['128GB', '256GB', '512GB', '1TB'], ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'], 'Apple'),
  ('Samsung Galaxy S24 Ultra', 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with all the industry-leading camera, note-taking and gaming capabilities you love.', 1199.00, 'electronics', 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 14, ARRAY['samsung', 'galaxy', 's24', 'ultra', 'android', 'smartphone', 's pen', 'premium', 'camera'], 4.6, ARRAY['256GB', '512GB', '1TB'], ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'], 'Samsung'),
  ('Sony WH-1000XM5', 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with High-Resolution Audio compatibility. Up to 30-hour battery life with quick charge.', 399.99, 'electronics', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 25, ARRAY['sony', 'headphones', 'wireless', 'noise canceling', 'premium', 'audio', '1000xm5'], 4.8, ARRAY[]::text[], ARRAY['Black', 'Silver'], 'Sony'),
  ('MacBook Air M3', 'Supercharged by the next-generation M3 chip, the redesigned MacBook Air is more capable than ever. With up to 18 hours of battery life.', 1299.00, 'electronics', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 11, ARRAY['macbook', 'air', 'm3', 'laptop', 'apple', 'thin', 'battery', 'silicon'], 4.9, ARRAY['256GB', '512GB', '1TB', '2TB'], ARRAY['Silver', 'Space Gray', 'Gold', 'Midnight'], 'Apple'),
  ('iPad Pro 12.9"', 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and support for Apple Pencil hover.', 1099.00, 'electronics', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 16, ARRAY['ipad', 'pro', 'tablet', 'apple', 'm2', 'retina', 'professional', 'display'], 4.7, ARRAY['128GB', '256GB', '512GB', '1TB', '2TB'], ARRAY['Silver', 'Space Gray'], 'Apple'),

  -- CLOTHING CATEGORY
  ('Levi''s 501 Original Jeans', 'The original blue jean since 1873. The 501 Original is a cultural icon that continues to evolve while honoring its historical legacy. Cut from premium cotton with a hint of stretch.', 89.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 54, ARRAY['levis', '501', 'jeans', 'denim', 'classic', 'straight fit', 'authentic', 'cotton'], 4.6, ARRAY['28W x 30L', '29W x 30L', '30W x 30L', '30W x 32L', '31W x 30L', '32W x 30L', '32W x 32L', '33W x 30L', '34W x 30L', '34W x 32L', '36W x 30L', '36W x 32L'], ARRAY['Dark Stonewash', 'Medium Stonewash', 'Light Stonewash', 'Black', 'Raw Denim'], 'Levi''s'),
  ('Patagonia Better Sweater Fleece', 'Our classic fleece jacket is made from recycled polyester fleece with a sweater-knit aesthetic and classic stand-up collar. Fair Trade Certified sewn.', 119.00, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 31, ARRAY['patagonia', 'better sweater', 'fleece', 'jacket', 'recycled', 'sustainable', 'outdoor'], 4.7, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy Blue', 'Black', 'Oatmeal Heather', 'Stone Blue', 'Nickel'], 'Patagonia'),
  ('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic shirt designed to help keep you dry and comfortable during your workout.', 29.99, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 75, ARRAY['nike', 'dri-fit', 't-shirt', 'athletic', 'workout', 'moisture wicking'], 4.3, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Grey', 'Red'], 'Nike'),

  -- HOME CATEGORY
  ('Dyson V15 Detect', 'The most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. Advanced whole-machine filtration captures 99.99% of particles, dust and allergens as small as 0.3 microns.', 749.99, 'home', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 12, ARRAY['dyson', 'v15', 'detect', 'vacuum', 'cordless', 'laser', 'cleaning', 'powerful'], 4.6, ARRAY[]::text[], ARRAY['Yellow/Nickel', 'Red/Nickel'], 'Dyson'),
  ('IKEA Kallax Shelf Unit', 'Perfect for storing everything from books and games to decorative items. Can be used horizontally or vertically. Choose whether you want to place it on the floor or mount it on the wall.', 79.99, 'home', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 35, ARRAY['ikea', 'kallax', 'shelf', 'storage', 'furniture', 'versatile', 'organization', 'bookshelf'], 4.4, ARRAY['2x2', '2x4', '4x4', '1x4'], ARRAY['White', 'Black-Brown', 'Birch Effect', 'Oak Effect'], 'IKEA'),

  -- FITNESS CATEGORY
  ('Yeti Rambler 32oz', 'This supremely insulated, durable bottle is built for whatever life brings. The Rambler Bottle is a necessary addition to your daypack, gym bag, or cup holder.', 39.99, 'fitness', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 67, ARRAY['yeti', 'rambler', 'water bottle', 'insulated', 'hydration', 'outdoor', '32oz', 'stainless steel'], 4.8, ARRAY['18oz', '26oz', '32oz', '46oz', '64oz'], ARRAY['Black', 'White', 'Navy', 'Seafoam', 'Charcoal', 'Stainless'], 'Yeti'),
  ('Nike Pro Training Set', 'Complete workout set including leggings and sports bra. Dri-FIT technology helps keep you dry and comfortable.', 89.99, 'fitness', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 38, ARRAY['nike', 'pro', 'training', 'workout', 'set', 'activewear', 'fitness'], 4.5, ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Dark Grey', 'Purple'], 'Nike')
) AS p(name, description, price, category, image_url, stock_quantity, voice_keywords, rating, sizes, colors, brand_name)
JOIN brand_lookup b ON b.brand_name = p.brand_name;

-- Insert product images (multiple images per product)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, color_variant)
SELECT 
  p.id,
  image_data.image_url,
  image_data.alt_text,
  image_data.is_primary,
  image_data.sort_order,
  image_data.color_variant
FROM products p
CROSS JOIN LATERAL (
  VALUES 
    -- Nike Air Max 270 images
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg' END, 'Nike Air Max 270 - Main View', true, 1, 'Black/White'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg' END, 'Nike Air Max 270 - Side View', false, 2, 'Black/White'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg' END, 'Nike Air Max 270 - White Variant', false, 3, 'Triple White'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg' END, 'Nike Air Max 270 - Detail View', false, 4, 'Black/White'),
    
    -- iPhone 15 Pro images
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg' END, 'iPhone 15 Pro - Front View', true, 1, 'Natural Titanium'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg' END, 'iPhone 15 Pro - Back View', false, 2, 'Natural Titanium'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg' END, 'iPhone 15 Pro - Blue Titanium', false, 3, 'Blue Titanium'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'https://images.pexels.com/photos/18105/pexels-photo.jpg' END, 'iPhone 15 Pro - Profile View', false, 4, 'Natural Titanium'),
    
    -- Sony WH-1000XM5 images
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg' END, 'Sony WH-1000XM5 - Main View', true, 1, 'Black'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg' END, 'Sony WH-1000XM5 - Side View', false, 2, 'Black'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg' END, 'Sony WH-1000XM5 - Silver Variant', false, 3, 'Silver'),
    
    -- MacBook Air M3 images
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'https://images.pexels.com/photos/18105/pexels-photo.jpg' END, 'MacBook Air M3 - Main View', true, 1, 'Silver'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg' END, 'MacBook Air M3 - Open View', false, 2, 'Silver'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg' END, 'MacBook Air M3 - Space Gray', false, 3, 'Space Gray'),
    
    -- Levi's 501 images
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg' END, 'Levi''s 501 - Main View', true, 1, 'Dark Stonewash'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg' END, 'Levi''s 501 - Back View', false, 2, 'Dark Stonewash'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg' END, 'Levi''s 501 - Light Wash', false, 3, 'Light Stonewash'),
    
    -- Other products
    (CASE WHEN p.name = 'Patagonia Better Sweater Fleece' THEN 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg' END, 'Patagonia Better Sweater - Main View', true, 1, 'Navy Blue'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg' END, 'Dyson V15 Detect - Main View', true, 1, 'Yellow/Nickel'),
    (CASE WHEN p.name = 'Yeti Rambler 32oz' THEN 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg' END, 'Yeti Rambler - Main View', true, 1, 'Black')
) AS image_data(image_url, alt_text, is_primary, sort_order, color_variant)
WHERE image_data.image_url IS NOT NULL;

-- Insert product variants (color/size combinations)
INSERT INTO product_variants (product_id, sku, color, size, material, price, stock_quantity, weight, dimensions)
SELECT 
  p.id,
  variant_data.sku,
  variant_data.color,
  variant_data.size,
  variant_data.material,
  variant_data.price,
  variant_data.stock_quantity,
  variant_data.weight,
  variant_data.dimensions
FROM products p
CROSS JOIN LATERAL (
  VALUES 
    -- Nike Air Max 270 variants
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'NIKE-AM270-BW-8' END, 'Black/White', '8', 'Mesh/Rubber', 149.99, 15, 380, '{"length": 29, "width": 11, "height": 10}'::jsonb),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'NIKE-AM270-BW-9' END, 'Black/White', '9', 'Mesh/Rubber', 149.99, 12, 390, '{"length": 30, "width": 11, "height": 10}'::jsonb),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'NIKE-AM270-TW-8' END, 'Triple White', '8', 'Mesh/Rubber', 149.99, 8, 380, '{"length": 29, "width": 11, "height": 10}'::jsonb),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'NIKE-AM270-TW-9' END, 'Triple White', '9', 'Mesh/Rubber', 149.99, 10, 390, '{"length": 30, "width": 11, "height": 10}'::jsonb),
    
    -- iPhone 15 Pro variants
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'IPHONE15P-NT-128' END, 'Natural Titanium', '128GB', 'Titanium/Glass', 999.00, 5, 187, '{"length": 146.6, "width": 70.6, "height": 8.25}'::jsonb),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'IPHONE15P-NT-256' END, 'Natural Titanium', '256GB', 'Titanium/Glass', 1099.00, 7, 187, '{"length": 146.6, "width": 70.6, "height": 8.25}'::jsonb),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'IPHONE15P-BT-128' END, 'Blue Titanium', '128GB', 'Titanium/Glass', 999.00, 3, 187, '{"length": 146.6, "width": 70.6, "height": 8.25}'::jsonb),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'IPHONE15P-BT-256' END, 'Blue Titanium', '256GB', 'Titanium/Glass', 1099.00, 3, 187, '{"length": 146.6, "width": 70.6, "height": 8.25}'::jsonb),
    
    -- Sony WH-1000XM5 variants
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'SONY-WH1000XM5-BLK' END, 'Black', 'Standard', 'Plastic/Foam', 399.99, 15, 250, '{"length": 254, "width": 203, "height": 76}'::jsonb),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'SONY-WH1000XM5-SLV' END, 'Silver', 'Standard', 'Plastic/Foam', 399.99, 10, 250, '{"length": 254, "width": 203, "height": 76}'::jsonb),
    
    -- Levi's 501 variants
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'LEVIS-501-DS-32X30' END, 'Dark Stonewash', '32W x 30L', '100% Cotton', 89.99, 20, 650, '{"length": 76, "width": 81, "height": 3}'::jsonb),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'LEVIS-501-DS-32X32' END, 'Dark Stonewash', '32W x 32L', '100% Cotton', 89.99, 18, 680, '{"length": 81, "width": 81, "height": 3}'::jsonb),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'LEVIS-501-MS-32X30' END, 'Medium Stonewash', '32W x 30L', '100% Cotton', 89.99, 15, 650, '{"length": 76, "width": 81, "height": 3}'::jsonb),
    
    -- MacBook Air M3 variants
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'MBA-M3-SLV-256' END, 'Silver', '256GB', 'Aluminum', 1299.00, 4, 1240, '{"length": 304.1, "width": 215, "height": 11.3}'::jsonb),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'MBA-M3-SG-256' END, 'Space Gray', '256GB', 'Aluminum', 1299.00, 3, 1240, '{"length": 304.1, "width": 215, "height": 11.3}'::jsonb),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'MBA-M3-SLV-512' END, 'Silver', '512GB', 'Aluminum', 1499.00, 2, 1240, '{"length": 304.1, "width": 215, "height": 11.3}'::jsonb)
) AS variant_data(sku, color, size, material, price, stock_quantity, weight, dimensions)
WHERE variant_data.sku IS NOT NULL;

-- Insert product attributes
INSERT INTO product_attributes (product_id, attribute_name, attribute_value, attribute_type)
SELECT 
  p.id,
  attr_data.attribute_name,
  attr_data.attribute_value,
  attr_data.attribute_type
FROM products p
CROSS JOIN LATERAL (
  VALUES 
    -- Nike Air Max 270 attributes
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Technology' END, 'Air Max', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Closure' END, 'Lace-up', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Heel Type' END, 'Air Unit', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Recommended Use' END, 'Lifestyle', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Target Gender' END, 'Unisex', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Upper Material' END, 'Engineered Mesh', 'text'),
    (CASE WHEN p.name = 'Nike Air Max 270' THEN 'Sole Material' END, 'Rubber', 'text'),
    
    -- iPhone 15 Pro attributes
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Processor' END, 'A17 Pro', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Display Size' END, '6.1 inches', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Display Technology' END, 'Super Retina XDR', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Camera System' END, 'Triple 48MP/12MP/12MP', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Battery Life' END, 'Up to 23 hours video', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Operating System' END, 'iOS 17', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Connectivity' END, '5G', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Charging Port' END, 'USB-C', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Water Resistance' END, 'IP68', 'text'),
    (CASE WHEN p.name = 'iPhone 15 Pro' THEN 'Face ID' END, 'Yes', 'boolean'),
    
    -- Sony WH-1000XM5 attributes
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Driver Size' END, '30mm', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Frequency Response' END, '4Hz-40kHz', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Battery Life' END, '30 hours', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Charging Time' END, '3 hours', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Quick Charge' END, '3 min = 3 hours', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Connectivity' END, 'Bluetooth 5.2', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Codecs Supported' END, 'SBC, AAC, LDAC', 'text'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Noise Canceling' END, 'Yes', 'boolean'),
    (CASE WHEN p.name = 'Sony WH-1000XM5' THEN 'Touch Controls' END, 'Yes', 'boolean'),
    
    -- MacBook Air M3 attributes
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Processor' END, 'Apple M3 chip', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'CPU Cores' END, '8-core', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'GPU Cores' END, '8-core or 10-core', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Display Size' END, '13.6 inches', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Display Technology' END, 'Liquid Retina', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Memory' END, '8GB or 16GB or 24GB', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Battery Life' END, 'Up to 18 hours', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Operating System' END, 'macOS', 'text'),
    (CASE WHEN p.name = 'MacBook Air M3' THEN 'Ports' END, '2x Thunderbolt, MagSafe 3', 'text'),
    
    -- Levi's 501 attributes
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Fit Type' END, 'Straight', 'text'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Rise' END, 'Mid Rise', 'text'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Closure' END, 'Button Fly', 'text'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Care Instructions' END, 'Machine Wash Cold', 'text'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Country of Origin' END, 'Various', 'text'),
    (CASE WHEN p.name = 'Levi''s 501 Original Jeans' THEN 'Fabric Composition' END, '100% Cotton', 'text'),
    
    -- Patagonia Better Sweater attributes
    (CASE WHEN p.name = 'Patagonia Better Sweater Fleece' THEN 'Material' END, 'Recycled Polyester', 'text'),
    (CASE WHEN p.name = 'Patagonia Better Sweater Fleece' THEN 'Certification' END, 'Fair Trade Certified', 'text'),
    (CASE WHEN p.name = 'Patagonia Better Sweater Fleece' THEN 'Collar Type' END, 'Stand-up', 'text'),
    (CASE WHEN p.name = 'Patagonia Better Sweater Fleece' THEN 'Care Instructions' END, 'Machine Wash Cold', 'text'),
    
    -- Dyson V15 attributes
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Suction Power' END, '230 AW', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Run Time' END, 'Up to 60 minutes', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Bin Capacity' END, '0.77L', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Filtration' END, 'Advanced whole-machine HEPA', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Special Features' END, 'Laser dust detection', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Warranty' END, '2 years', 'text'),
    (CASE WHEN p.name = 'Dyson V15 Detect' THEN 'Cyclone Technology' END, 'Radial Root Cyclone', 'text')
) AS attr_data(attribute_name, attribute_value, attribute_type)
WHERE attr_data.attribute_name IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(product_id, is_available);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product_id ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_name ON product_attributes(product_id, attribute_name);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);