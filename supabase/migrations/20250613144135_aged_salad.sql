/*
  # Add Product Attributes for Enhanced Voice Shopping

  1. New Columns
    - rating: Product rating (1-5 stars)
    - sizes: Available sizes for products  
    - colors: Available colors for products

  2. Data Updates
    - Set realistic ratings based on brands and categories
    - Add appropriate sizes for shoes and clothing
    - Add common color options for all categories

  3. Indexes
    - Add indexes for efficient filtering by rating, sizes, and colors
*/

-- Add rating column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'rating'
  ) THEN
    ALTER TABLE products ADD COLUMN rating numeric(2,1) DEFAULT 4.5;
  END IF;
END $$;

-- Add sizes array column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sizes'
  ) THEN
    ALTER TABLE products ADD COLUMN sizes text[] DEFAULT '{}';
  END IF;
END $$;

-- Add colors array column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'colors'
  ) THEN
    ALTER TABLE products ADD COLUMN colors text[] DEFAULT '{}';
  END IF;
END $$;

-- Update existing products with ratings, sizes, and colors
UPDATE products SET 
  rating = CASE 
    WHEN name LIKE '%Nike%' OR name LIKE '%Adidas%' OR name LIKE '%Jordan%' THEN 4.7
    WHEN name LIKE '%Apple%' OR name LIKE '%Sony%' THEN 4.8
    WHEN name LIKE '%Samsung%' OR name LIKE '%PlayStation%' THEN 4.6
    WHEN category = 'shoes' THEN 4.5
    WHEN category = 'electronics' THEN 4.4
    ELSE 4.3
  END,
  sizes = CASE 
    WHEN category = 'shoes' THEN ARRAY['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']
    WHEN category = 'clothing' THEN ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']
    ELSE ARRAY[]::text[]
  END,
  colors = CASE 
    WHEN category = 'shoes' THEN ARRAY['Black', 'White', 'Grey', 'Blue', 'Red']
    WHEN category = 'clothing' THEN ARRAY['Black', 'White', 'Navy', 'Grey', 'Blue']
    WHEN category = 'electronics' THEN ARRAY['Black', 'White', 'Silver', 'Space Grey']
    ELSE ARRAY['Black', 'White']
  END
WHERE rating IS NULL OR sizes = '{}' OR colors = '{}';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN(sizes);
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN(colors);