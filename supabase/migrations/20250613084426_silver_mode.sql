/*
  # Add Sample Products Data

  1. Sample Data
    - Add various products across different categories
    - Include shoes, electronics, and clothing
    - Set appropriate stock quantities and prices
    - Add voice keywords for each product

  2. Products Added
    - Nike Air Max 270 (shoes)
    - Adidas Ultraboost (shoes)
    - iPhone 15 Pro (electronics)
    - Samsung Galaxy S24 (electronics)
    - Classic White T-Shirt (clothing)
    - Levi's Denim Jeans (clothing)
    - And more...
*/

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock_quantity, voice_keywords) VALUES
  (
    'Nike Air Max 270',
    'Comfortable running shoes with excellent cushioning and modern design.',
    129.99,
    'shoes',
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    25,
    ARRAY['nike', 'air max', 'running', 'shoes', 'sneakers', 'athletic']
  ),
  (
    'Adidas Ultraboost 22',
    'Premium running shoes with responsive cushioning and energy return.',
    180.00,
    'shoes',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    18,
    ARRAY['adidas', 'ultraboost', 'running', 'shoes', 'sneakers', 'boost']
  ),
  (
    'Vans Old Skool',
    'Classic skateboarding shoes with timeless style and durability.',
    65.00,
    'shoes',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
    32,
    ARRAY['vans', 'old skool', 'skateboard', 'shoes', 'sneakers', 'casual']
  ),
  (
    'iPhone 15 Pro',
    'Latest Apple smartphone with advanced camera system and titanium design.',
    999.00,
    'electronics',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
    12,
    ARRAY['iphone', 'apple', 'smartphone', 'phone', 'mobile', 'electronics']
  ),
  (
    'Samsung Galaxy S24',
    'Flagship Android smartphone with excellent display and camera capabilities.',
    849.00,
    'electronics',
    'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800',
    15,
    ARRAY['samsung', 'galaxy', 'android', 'smartphone', 'phone', 'electronics']
  ),
  (
    'MacBook Air M3',
    'Lightweight laptop with exceptional performance and battery life.',
    1299.00,
    'electronics',
    'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    8,
    ARRAY['macbook', 'apple', 'laptop', 'computer', 'electronics', 'portable']
  ),
  (
    'Classic White T-Shirt',
    'Premium cotton t-shirt with comfortable fit and timeless style.',
    29.99,
    'clothing',
    'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
    50,
    ARRAY['t-shirt', 'tshirt', 'white', 'cotton', 'clothing', 'casual']
  ),
  (
    'Levi''s 501 Denim Jeans',
    'Classic straight-fit jeans made from premium denim.',
    89.99,
    'clothing',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    28,
    ARRAY['levis', 'jeans', 'denim', 'pants', 'clothing', 'casual']
  ),
  (
    'Nike Dri-FIT Hoodie',
    'Comfortable hoodie with moisture-wicking technology for active wear.',
    75.00,
    'clothing',
    'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=800',
    22,
    ARRAY['nike', 'hoodie', 'sweatshirt', 'clothing', 'athletic', 'casual']
  ),
  (
    'Sony WH-1000XM5 Headphones',
    'Industry-leading noise-canceling wireless headphones with premium sound.',
    399.99,
    'electronics',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    14,
    ARRAY['sony', 'headphones', 'wireless', 'noise canceling', 'audio', 'electronics']
  ),
  (
    'Apple Watch Series 9',
    'Advanced smartwatch with health monitoring and fitness tracking.',
    429.00,
    'electronics',
    'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    20,
    ARRAY['apple watch', 'smartwatch', 'fitness', 'health', 'wearable', 'electronics']
  ),
  (
    'Converse Chuck Taylor All Star',
    'Iconic high-top sneakers with classic canvas construction.',
    55.00,
    'shoes',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
    35,
    ARRAY['converse', 'chuck taylor', 'all star', 'sneakers', 'shoes', 'classic']
  );