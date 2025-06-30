import React, { useState, useEffect } from 'react';
import { Star, Heart, Minus, Plus, Truck, RotateCcw, ShoppingCart, ArrowLeft, ChevronDown, Search, Package, Shield, Award, Eye } from 'lucide-react';
import { getProductWithDetails, getProductVariants, Product, ProductVariant, ProductImage } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  productId?: string;
  onBack?: () => void;
  onAddToCart?: () => void;
}

export function ProductDetail({ productId, onBack, onAddToCart }: ProductDetailProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProductData(productId);
    } else {
      // Load a sample product for demo purposes
      loadSampleProduct();
    }
  }, [productId]);

  const loadProductData = async (id: string) => {
    setLoading(true);
    try {
      const productData = await getProductWithDetails(id);
      if (productData) {
        setProduct(productData);
        const productVariants = await getProductVariants(id);
        setVariants(productVariants);
        
        // Set default selections
        if (productVariants.length > 0) {
          setSelectedVariant(productVariants[0]);
          setSelectedColor(productVariants[0].color || '');
          setSelectedSize(productVariants[0].size || '');
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleProduct = async () => {
    setLoading(true);
    try {
      // For demo, we'll load the first product from electronics category
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products?category=eq.electronics&limit=1`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      const products = await response.json();
      if (products && products.length > 0) {
        await loadProductData(products[0].id);
      }
    } catch (error) {
      console.error('Error loading sample product:', error);
      setLoading(false);
    }
  };

  const getProductImages = (product: Product): ProductImage[] => {
    if (product.images && product.images.length > 0) {
      return product.images.sort((a, b) => a.sort_order - b.sort_order);
    }
    // Fallback images
    return [
      {
        id: '1',
        product_id: product.id,
        image_url: product.image_url || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        alt_text: product.name,
        is_primary: true,
        sort_order: 1,
        created_at: ''
      },
      {
        id: '2',
        product_id: product.id,
        image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
        alt_text: `${product.name} - View 2`,
        is_primary: false,
        sort_order: 2,
        created_at: ''
      },
      {
        id: '3',
        product_id: product.id,
        image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        alt_text: `${product.name} - View 3`,
        is_primary: false,
        sort_order: 3,
        created_at: ''
      }
    ];
  };

  const getAvailableColors = () => {
    const colors = new Set(variants.map(v => v.color).filter(Boolean));
    return Array.from(colors);
  };

  const getAvailableSizes = () => {
    const sizes = new Set(
      variants
        .filter(v => !selectedColor || v.color === selectedColor)
        .map(v => v.size)
        .filter(Boolean)
    );
    return Array.from(sizes);
  };

  const getVariantForSelection = () => {
    return variants.find(v => 
      (!selectedColor || v.color === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
    );
  };

  const getCurrentPrice = () => {
    const variant = getVariantForSelection();
    return variant?.price || product?.price || 0;
  };

  const getCurrentStock = () => {
    const variant = getVariantForSelection();
    return variant?.stock_quantity || product?.stock_quantity || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0faff] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0076]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f0faff] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = getProductImages(product);
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const currentStock = getCurrentStock();
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontWeight: '500'
        }
      });
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Navigate to checkout would be handled by parent component
  };

  const breadcrumbs = [
    { name: 'Products', href: '#' },
    { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: '#' },
    { name: product.brand?.name || 'Brand', href: '#' },
    { name: product.name, href: '#' }
  ];

  return (
    <div className="bg-[#f0faff] min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#12131A] text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📞 +001234567890</span>
            <span>Get 50% Off on Selected Items | Shop Now</span>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-transparent border-none text-white text-sm focus:outline-none">
              <option>Eng</option>
            </select>
            <select className="bg-transparent border-none text-white text-sm focus:outline-none">
              <option>Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onBack}>
              <div className="w-8 h-8 bg-[#FF0076] rounded flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#12131A] font-['Quicksand']">VoiceShop</span>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF0076] transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button className="text-gray-700 hover:text-[#FF0076] transition-colors">Deals</button>
              <button className="text-gray-700 hover:text-[#FF0076] transition-colors">What's New</button>
            </nav>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Product"
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-[#FF0076] transition-colors">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF0076] transition-colors">
                <span className="w-5 h-5">👤</span>
                <span className="hidden sm:inline">Account</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF0076] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <button className="hover:text-[#FF0076] transition-colors">
                  {item.name}
                </button>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[#FF0076] hover:text-[#FF0076]/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
                <img
                  src={images[selectedImageIndex]?.image_url}
                  alt={images[selectedImageIndex]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                {images.length > 1 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/60 text-white text-sm px-3 py-1 rounded-full flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedImageIndex + 1}/{images.length}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-[#FF0076] ring-2 ring-[#FF0076]/20' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.brand && (
                  <div className="text-[#FF0076] font-semibold mb-2 text-lg">
                    {product.brand.name}
                  </div>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-lg text-gray-600">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                  <div className="flex items-center space-x-1">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-600 font-medium">Bestseller</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-b pb-6">
                <div className="flex items-baseline space-x-3 mb-3">
                  <span className="text-4xl lg:text-5xl font-bold text-[#12131A]">
                    {formatPrice(getCurrentPrice())}
                  </span>
                  <span className="text-xl text-gray-500">
                    or {formatPrice(getCurrentPrice() / 6)}/month
                  </span>
                </div>
                <p className="text-gray-500">
                  Suggested payments with 6 months special financing
                </p>
              </div>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#12131A] mb-4">Choose a Color</h3>
                  <div className="flex items-center space-x-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 rounded-lg transition-all hover:scale-105 ${
                          selectedColor === color
                            ? 'border-[#FF0076] bg-[#FF0076]/10 text-[#FF0076]'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#12131A] mb-4">Choose Size</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 border-2 rounded-lg transition-all hover:scale-105 text-center ${
                          selectedSize === size
                            ? 'border-[#FF0076] bg-[#FF0076]/10 text-[#FF0076] font-semibold'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#FF0076] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= getCurrentStock()}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#FF0076] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-[#FF0076] font-bold text-lg">
                    Only {getCurrentStock()} Items Left!
                  </p>
                  <p className="text-gray-500">Don't miss it</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#12131A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#12131A]/90 transition-colors shadow-lg"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-[#12131A] text-[#12131A] py-4 rounded-xl font-bold text-lg hover:bg-[#12131A] hover:text-white transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    💬 Try saying: "Add to cart" or "Buy this product now"
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF0076]/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-[#FF0076]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12131A] text-lg">Free Delivery</h4>
                    <p className="text-gray-600">
                      Enter your postal code for Delivery Availability
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12131A] text-lg">Return Delivery</h4>
                    <p className="text-gray-600">
                      Free 30-day delivery returns. <span className="text-[#FF0076] underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12131A] text-lg">Warranty</h4>
                    <p className="text-gray-600">
                      2-year manufacturer warranty included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-[#12131A] mb-8 font-['Quicksand']">
            Product Specifications
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[#12131A] mb-6">Technical Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Brand:</dt>
                  <dd className="font-semibold text-gray-900">{product.brand?.name || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Category:</dt>
                  <dd className="font-semibold text-gray-900 capitalize">{product.category}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Stock Quantity:</dt>
                  <dd className="font-semibold text-gray-900">{getCurrentStock()} units</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Rating:</dt>
                  <dd className="font-semibold text-gray-900">{product.rating}/5.0</dd>
                </div>
                {availableColors.length > 0 && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-600 font-medium">Available Colors:</dt>
                    <dd className="font-semibold text-gray-900">{availableColors.join(', ')}</dd>
                  </div>
                )}
                {availableSizes.length > 0 && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-600 font-medium">Available Sizes:</dt>
                    <dd className="font-semibold text-gray-900">{availableSizes.join(', ')}</dd>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12131A] mb-6">Product Attributes</h3>
              {product.attributes && product.attributes.length > 0 ? (
                <div className="space-y-4">
                  {product.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                      <dt className="text-gray-600 font-medium">{attr.attribute_name}:</dt>
                      <dd className="font-semibold text-gray-900">{attr.attribute_value}</dd>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#FF0076] rounded-full mt-2"></span>
                    <span>Premium quality materials and construction</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#FF0076] rounded-full mt-2"></span>
                    <span>Compatible with voice shopping commands</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#FF0076] rounded-full mt-2"></span>
                    <span>Fast and reliable delivery service</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#FF0076] rounded-full mt-2"></span>
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-[#FF0076] rounded-full mt-2"></span>
                    <span>24/7 customer support available</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}