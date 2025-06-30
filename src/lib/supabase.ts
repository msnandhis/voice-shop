import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  country?: string;
  founded_year?: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  voice_keywords: string[];
  stock_quantity: number;
  rating: number;
  sizes: string[];
  colors: string[];
  brand_id?: string;
  created_at: string;
  brand?: Brand;
  images?: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  color_variant?: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number;
  stock_quantity: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_available: boolean;
  created_at: string;
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_name: string;
  attribute_value: string;
  attribute_type: 'text' | 'number' | 'boolean' | 'json';
  created_at: string;
}

// CartItem represents an item in the carts table (which contains cart items directly)
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  name: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedCard {
  id: string;
  user_id: string;
  name: string;
  card_brand: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  cardholder_name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  shipping_address?: any;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
}

export interface VoiceCommand {
  id: string;
  user_id: string;
  command: string;
  intent?: string;
  response?: string;
  success: boolean;
  created_at: string;
}

// Helper functions for fetching enhanced product data
export const getProductWithDetails = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      variants:product_variants(*),
      attributes:product_attributes(*)
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product details:', error);
    return null;
  }

  return data;
};

export const getProductsWithDetails = async (filters?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*)
    `)
    .gte('stock_quantity', 1)
    .order('created_at', { ascending: false });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
};

export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .eq('is_available', true)
    .order('color', { ascending: true })
    .order('size', { ascending: true });

  if (error) {
    console.error('Error fetching product variants:', error);
    return [];
  }

  return data || [];
};

export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching product images:', error);
    return [];
  }

  return data || [];
};

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return data || [];
};