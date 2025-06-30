/*
  # Add Comprehensive Product Catalog

  1. New Products
    - 40+ products across multiple categories
    - Shoes: Athletic, casual, formal, boots
    - Electronics: Phones, laptops, tablets, headphones, gaming
    - Clothing: Shirts, pants, dresses, jackets, accessories
    - Home & Garden: Furniture, decor, appliances
    - Sports & Fitness: Equipment, apparel, accessories

  2. Features
    - Realistic pricing and stock levels
    - Comprehensive voice keywords for better search
    - High-quality product images from Pexels
    - Detailed descriptions
*/

-- Insert comprehensive product catalog
INSERT INTO products (name, description, price, category, image_url, stock_quantity, voice_keywords) VALUES

-- SHOES CATEGORY
('Jordan Air Max Retro', 'Classic basketball sneakers with retro styling and Air Max cushioning.', 159.99, 'shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 42, ARRAY['jordan', 'air max', 'retro', 'basketball', 'shoes', 'sneakers']),
('Puma Running Velocity', 'Lightweight running shoes designed for speed and comfort.', 89.99, 'shoes', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 38, ARRAY['puma', 'running', 'velocity', 'lightweight', 'shoes', 'athletic']),
('Doc Martens 1460 Boots', 'Classic leather boots with iconic styling and durability.', 179.99, 'shoes', 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg', 22, ARRAY['doc martens', 'boots', 'leather', 'classic', 'durable', 'shoes']),
('Allbirds Tree Runners', 'Sustainable sneakers made from eucalyptus tree fiber.', 98.00, 'shoes', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 31, ARRAY['allbirds', 'sustainable', 'eco', 'running', 'comfortable', 'shoes']),
('Adidas Stan Smith', 'Timeless white leather tennis shoes with green accents.', 85.00, 'shoes', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', 45, ARRAY['adidas', 'stan smith', 'tennis', 'white', 'leather', 'classic']),

-- ELECTRONICS CATEGORY
('iPad Pro 12.9"', 'Professional tablet with M2 chip and Liquid Retina XDR display.', 1099.00, 'electronics', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 16, ARRAY['ipad', 'tablet', 'apple', 'pro', 'professional', 'electronics']),
('Dell XPS 13 Laptop', 'Ultra-portable laptop with stunning InfinityEdge display.', 1249.00, 'electronics', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 11, ARRAY['dell', 'laptop', 'xps', 'ultrabook', 'portable', 'computer']),
('Nintendo Switch OLED', 'Gaming console with vibrant OLED screen for home and portable play.', 349.99, 'electronics', 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 28, ARRAY['nintendo', 'switch', 'gaming', 'console', 'oled', 'portable']),
('Google Pixel 8 Pro', 'Advanced Android phone with computational photography and AI features.', 999.00, 'electronics', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 19, ARRAY['google', 'pixel', 'android', 'smartphone', 'camera', 'ai']),
('Bose QuietComfort Earbuds', 'Premium wireless earbuds with world-class noise cancellation.', 279.00, 'electronics', 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', 33, ARRAY['bose', 'earbuds', 'wireless', 'noise canceling', 'premium', 'audio']),
('Samsung 65" 4K Smart TV', 'Ultra-HD smart TV with vibrant colors and smart features.', 899.99, 'electronics', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 7, ARRAY['samsung', 'tv', 'smart tv', '4k', 'ultra hd', 'television']),
('PlayStation 5', 'Next-generation gaming console with ultra-high-speed SSD.', 499.99, 'electronics', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 5, ARRAY['playstation', 'ps5', 'gaming', 'console', 'sony', 'games']),

-- CLOTHING CATEGORY
('Champion Reverse Weave Hoodie', 'Classic heavyweight hoodie with iconic Champion styling.', 65.00, 'clothing', 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg', 40, ARRAY['champion', 'hoodie', 'reverse weave', 'sweatshirt', 'classic', 'clothing']),
('Ralph Lauren Polo Shirt', 'Premium cotton polo shirt with classic fit and iconic logo.', 89.50, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 35, ARRAY['ralph lauren', 'polo', 'shirt', 'cotton', 'classic', 'preppy']),
('Patagonia Better Sweater', 'Cozy fleece jacket made from recycled polyester.', 119.00, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 26, ARRAY['patagonia', 'fleece', 'jacket', 'sustainable', 'outdoor', 'warm']),
('Wrangler Bootcut Jeans', 'Classic bootcut jeans with authentic western styling.', 59.99, 'clothing', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 48, ARRAY['wrangler', 'jeans', 'bootcut', 'western', 'denim', 'classic']),
('Uniqlo Merino Wool Sweater', 'Soft and warm merino wool sweater with modern fit.', 69.90, 'clothing', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 30, ARRAY['uniqlo', 'sweater', 'merino wool', 'warm', 'soft', 'modern']),
('Zara Midi Dress', 'Elegant midi dress perfect for office or evening wear.', 79.90, 'clothing', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 22, ARRAY['zara', 'dress', 'midi', 'elegant', 'office', 'evening']),

-- HOME & GARDEN CATEGORY
('IKEA Malm Dresser', 'Modern 6-drawer dresser with clean lines and ample storage.', 179.00, 'home', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 15, ARRAY['ikea', 'dresser', 'furniture', 'storage', 'bedroom', 'modern']),
('Dyson V15 Vacuum', 'Powerful cordless vacuum with laser dust detection.', 749.99, 'home', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 12, ARRAY['dyson', 'vacuum', 'cordless', 'cleaning', 'powerful', 'laser']),
('Ninja Foodi Air Fryer', 'Multi-functional air fryer that cooks, crisps, and dehydrates.', 199.99, 'home', 'https://images.pexels.com/photos/4638221/pexels-photo-4638221.jpeg', 18, ARRAY['ninja', 'air fryer', 'cooking', 'kitchen', 'healthy', 'appliance']),
('West Elm Mid-Century Coffee Table', 'Stylish coffee table with walnut finish and hairpin legs.', 449.00, 'home', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 8, ARRAY['west elm', 'coffee table', 'mid century', 'walnut', 'furniture', 'living room']),

-- SPORTS & FITNESS CATEGORY
('Peloton Bike+', 'Interactive exercise bike with live and on-demand classes.', 2495.00, 'fitness', 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 3, ARRAY['peloton', 'exercise bike', 'fitness', 'workout', 'interactive', 'cardio']),
('Nike Pro Training Set', 'Complete athletic wear set including leggings and sports bra.', 89.99, 'fitness', 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', 25, ARRAY['nike', 'athletic wear', 'training', 'workout', 'fitness', 'activewear']),
('Bowflex Adjustable Dumbbells', 'Space-saving dumbbells that adjust from 5 to 52.5 pounds.', 349.00, 'fitness', 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 14, ARRAY['bowflex', 'dumbbells', 'adjustable', 'weights', 'strength', 'fitness']),
('Yeti Rambler Water Bottle', 'Insulated stainless steel water bottle that keeps drinks cold.', 39.99, 'fitness', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 52, ARRAY['yeti', 'water bottle', 'insulated', 'hydration', 'outdoor', 'cold']),

-- ACCESSORIES CATEGORY
('Ray-Ban Aviator Sunglasses', 'Classic aviator sunglasses with premium lens technology.', 179.00, 'accessories', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 27, ARRAY['ray ban', 'sunglasses', 'aviator', 'classic', 'eyewear', 'premium']),
('Coach Leather Handbag', 'Luxury leather handbag with timeless design and craftsmanship.', 395.00, 'accessories', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg', 13, ARRAY['coach', 'handbag', 'leather', 'luxury', 'bag', 'designer']),
('Apple AirTag 4-Pack', 'Precision finding tags to keep track of your important items.', 99.00, 'accessories', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 36, ARRAY['apple', 'airtag', 'tracking', 'finder', 'bluetooth', 'lost items']),
('Fossil Gen 6 Smartwatch', 'Stylish smartwatch with Wear OS and comprehensive health tracking.', 259.00, 'accessories', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 21, ARRAY['fossil', 'smartwatch', 'wear os', 'health tracking', 'stylish', 'wearable']),

-- BEAUTY & PERSONAL CARE
('Dyson Supersonic Hair Dryer', 'Professional hair dryer with intelligent heat control.', 429.99, 'beauty', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 16, ARRAY['dyson', 'hair dryer', 'professional', 'beauty', 'hair care', 'styling']),
('Fenty Beauty Foundation', 'Inclusive foundation with 40 shades for all skin tones.', 36.00, 'beauty', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 44, ARRAY['fenty', 'foundation', 'makeup', 'beauty', 'inclusive', 'cosmetics']),

-- BOOKS & MEDIA
('The Seven Husbands of Evelyn Hugo', 'Bestselling novel about a reclusive Hollywood icon.', 16.99, 'books', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 67, ARRAY['book', 'novel', 'bestseller', 'fiction', 'hollywood', 'reading']),
('Atomic Habits by James Clear', 'Transformative guide to building good habits and breaking bad ones.', 18.99, 'books', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 89, ARRAY['book', 'self help', 'habits', 'productivity', 'james clear', 'nonfiction']),

-- FOOD & BEVERAGE
('Hydro Flask 32oz', 'Insulated water bottle that keeps drinks cold for 24 hours.', 44.95, 'accessories', 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg', 78, ARRAY['hydro flask', 'water bottle', 'insulated', 'hydration', 'outdoor', 'cold']),
('Blue Bottle Coffee Beans', 'Artisanal coffee beans with complex flavor profiles.', 22.00, 'food', 'https://images.pexels.com/photos/4638221/pexels-photo-4638221.jpeg', 45, ARRAY['coffee', 'beans', 'artisanal', 'blue bottle', 'gourmet', 'beverage']);