import React, { useState, useEffect } from 'react';
import { ShoppingBag, Mic, Star, Truck, Shield, Headphones, ArrowRight, ChevronDown, Search, Heart, TrendingUp, Award, ChevronLeft, ChevronRight, Mail, User } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { voiceService } from '../lib/voiceService';
import toast from 'react-hot-toast';

interface LandingPageProps {
  onNavigation: (view: 'products' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'profile' | 'settings' | 'about' | 'contact' | 'deals' | 'whats-new' | 'login' | 'register') => void;
}

export function LandingPage({ onNavigation }: LandingPageProps) {
  const { user } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [bannerSlides, setBannerSlides] = useState<any[]>([]);
  const [loadingBannerSlides, setLoadingBannerSlides] = useState(true);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Busy Mom',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      rating: 5,
      text: 'VoiceShop has revolutionized my shopping experience! I can add items to my cart while cooking dinner or taking care of my kids. It\'s incredibly convenient and accurate.'
    },
    {
      name: 'David Chen',
      role: 'Tech Professional',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      rating: 5,
      text: 'The voice recognition is spot-on. I can browse products, compare prices, and make purchases without ever touching my phone. This is the future of e-commerce!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Accessibility Advocate',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      rating: 5,
      text: 'As someone with mobility challenges, VoiceShop has made online shopping accessible and enjoyable. The voice commands work perfectly every time.'
    }
  ];

  const categories = [
    { 
      name: 'Electronics', 
      icon: '📱', 
      count: '150+ Items',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Shoes', 
      icon: '👟', 
      count: '200+ Items',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      color: 'from-green-500 to-teal-600'
    },
    { 
      name: 'Clothing', 
      icon: '👕', 
      count: '300+ Items',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      color: 'from-pink-500 to-red-600'
    },
    { 
      name: 'Home', 
      icon: '🏠', 
      count: '100+ Items',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
      color: 'from-orange-500 to-yellow-600'
    },
    { 
      name: 'Fitness', 
      icon: '💪', 
      count: '80+ Items',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg',
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      name: 'Beauty', 
      icon: '💄', 
      count: '120+ Items',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
      color: 'from-pink-500 to-purple-600'
    }
  ];

  useEffect(() => {
    if (featuredProducts.length > 0) {
      console.log("Updating voice context with featured products:", featuredProducts.length);
      voiceService.updateContext(featuredProducts, 'featured', 'Featured Products');
    }
  }, [featuredProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [bannerSlides]);

  useEffect(() => {
    loadFeaturedProducts();
    loadBannerProducts();
  }, []);

  const loadBannerProducts = async () => {
    setLoadingBannerSlides(true);
    try {
      // Get 3 top-rated products from different categories for the banner
      const { data: bannerProducts, error } = await supabase
        .from('products')
        .select('*, brand:brands(*)')
        .gte('rating', 4.5)
        .gte('stock_quantity', 1)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      if (bannerProducts && bannerProducts.length > 0) {
        const slides = bannerProducts.map((product, index) => {
          let category = product.category || '';
          let gradients = ['from-pink-50 to-blue-50', 'from-blue-50 to-purple-50', 'from-purple-50 to-pink-50'];
          
          return {
            id: product.id,
            title: product.name,
            subtitle: product.description ? 
              (product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description) : 
              `Experience ${product.name} with VoiceShop`,
            buttonText: `Shop Now`,
            image: product.image_url || `https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg`,
            gradient: gradients[index % gradients.length],
            category: category,
            brand: product.brand?.name || ''
          };
        });

        setBannerSlides(slides);
      } else {
        // Fallback slides if no products found
        setBannerSlides([
          {
            id: null,
            title: 'Grab Up to 50% Off On Voice Shopping',
            subtitle: 'Experience the future of e-commerce with hands-free voice commands',
            buttonText: 'Shop Now',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
            gradient: 'from-pink-50 to-blue-50',
            category: '',
            brand: ''
          },
          {
            id: null,
            title: 'New Electronics Collection',
            subtitle: 'Latest smartphones, laptops, and gadgets with voice control',
            buttonText: 'Explore Electronics',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            gradient: 'from-blue-50 to-purple-50',
            category: 'electronics',
            brand: ''
          },
          {
            id: null,
            title: 'Premium Audio Experience',
            subtitle: 'High-quality headphones and speakers for audiophiles',
            buttonText: 'Shop Audio',
            image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
            gradient: 'from-purple-50 to-pink-50',
            category: 'electronics',
            brand: ''
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading banner products:', error);
      // Set fallback slides on error
      setBannerSlides([
        {
          id: null,
          title: 'Shop With Your Voice',
          subtitle: 'Experience the future of e-commerce with hands-free voice commands',
          buttonText: 'Shop Now',
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
          gradient: 'from-pink-50 to-blue-50',
          category: '',
          brand: ''
        }
      ]);
    } finally {
      setLoadingBannerSlides(false);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('stock_quantity', 1)
        .order('rating', { ascending: false })
        .limit(8);

      if (error) throw error;
      setFeaturedProducts(data || []);
      
      // Update voice context with featured products
      if (data && data.length > 0) {
        voiceService.updateContext(data, 'featured', 'Featured Products');
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontWeight: '500'
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    onNavigation('product-detail');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    }
  };

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

  const handleBannerProductClick = (slideId: string | null, category: string) => {
    if (slideId) {
      // If we have a product ID, select that product and navigate to product detail
      const product = featuredProducts.find(p => p.id === slideId);
      if (product) {
        setSelectedProduct(product);
        onNavigation('product-detail');
      } else {
        // If product not found in featuredProducts, navigate to products with category
        onNavigation('products');
      }
    } else if (category) {
      // If no product ID but we have a category, navigate to products with that category
      if (typeof window.handleBrowseProducts === 'function') {
        window.handleBrowseProducts(category);
      }
    } else {
      // Default to products page
      onNavigation('products');
    }
  };

  return (
    <div className="bg-[#f0faff]">
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
              <option>Esp</option>
              <option>Fra</option>
            </select>
            <select className="bg-transparent border-none text-white text-sm focus:outline-none">
              <option>US</option>
              <option>CA</option>
              <option>UK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigation('products')}>
              <div className="w-8 h-8 bg-[#FF0076] rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#12131A] font-['Quicksand']">VoiceShop</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF0076] transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        onClick={() => onNavigation('products')}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.count}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="text-gray-700 hover:text-[#FF0076] transition-colors"
                onClick={() => onNavigation('deals')}
              >
                Deals
              </button>
              <button 
                className="text-gray-700 hover:text-[#FF0076] transition-colors"
                onClick={() => onNavigation('whats-new')}
              >
                What's New
              </button>
            </nav>

            {/* Search Bar */}
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

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <button 
                className="text-gray-700 hover:text-[#FF0076] transition-colors"
                onClick={() => user ? onNavigation('profile') : onNavigation('login')}
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-700 hover:text-[#FF0076] transition-colors relative"
                onClick={() => onNavigation('cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {user && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF0076] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Carousel */}
      <section className="bg-gradient-to-r from-pink-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
            <div className="relative h-96 lg:h-[500px]">
              {loadingBannerSlides ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF0076] border-t-transparent"></div>
                </div>
              ) : (
                bannerSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentBannerSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 items-center h-full bg-gradient-to-r ${slide.gradient}`}>
                      <div className="p-12 lg:p-16">
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#12131A] mb-6 font-['Quicksand'] leading-tight">
                          {slide.title.split(' ').map((word, i) => (
                            <span key={i} className={word.includes('Voice') || word.includes('50%') ? 'text-[#FF0076]' : ''}>
                              {word}{' '}
                            </span>
                          ))}
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed">
                          {slide.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={() => handleBannerProductClick(slide.id, slide.category)}
                            className="inline-flex items-center px-8 py-4 bg-[#FF0076] text-white rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            {slide.buttonText}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </button>
                        </div>
                      </div>
                      <div className="relative h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Carousel Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBannerSlide ? 'bg-[#FF0076]' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentBannerSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={() => setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover products across all categories with voice commands
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => onNavigation('products')}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                </div>
                <h3 className="text-center font-semibold text-gray-900 group-hover:text-[#FF0076] transition-colors">
                  {category.name}
                </h3>
                <p className="text-center text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-[#f0faff]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
                Products For You!
              </h2>
              <p className="text-xl text-gray-600">
                Try voice commands: "Add the first product" or "Show me the best rated item"
              </p>
            </div>
            <button
              onClick={() => onNavigation('products')}
              className="hidden lg:inline-flex items-center px-6 py-3 bg-[#FF0076] text-white rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                  <div className="relative">
                    <img
                      src={product.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#FF0076] text-white text-xs px-2 py-1 rounded-full font-medium">
                        #{index + 1}
                      </span>
                    </div>
                    {product.stock_quantity < 10 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-[#FF0076] text-white text-xs px-2 py-1 rounded-full font-medium">
                          Only {product.stock_quantity} left!
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-[#FF0076] uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 
                      className="font-semibold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-[#FF0076] transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center space-x-1 mb-4">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-[#FF0076]">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Popular</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#FF0076] hover:text-white hover:border-[#FF0076] transition-all duration-300 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12 lg:hidden">
            <button
              onClick={() => onNavigation('products')}
              className="inline-flex items-center px-8 py-4 bg-[#FF0076] text-white rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Why Choose VoiceShop?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of e-commerce with our innovative voice-powered shopping platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Shopping</h3>
              <p className="text-gray-600 leading-relaxed">Shop with natural voice commands - just speak and we'll understand</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Fast and free delivery on all orders. Enter postal code for availability</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Return Policy</h3>
              <p className="text-gray-600 leading-relaxed">Free 30-day returns with easy voice-initiated return process</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">Voice-powered customer support available around the clock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who love voice shopping
            </p>
          </div>
          
          <div className="relative bg-white rounded-3xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>
              
              <blockquote className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-[#FF0076] font-medium">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-[#FF0076]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Truck className="w-12 h-12" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">2-Day</div>
              <div className="text-xl opacity-90">Fast Delivery</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Products</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Award className="w-12 h-12" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-xl opacity-90">Uptime</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Mic className="w-12 h-12" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
              <div className="text-xl opacity-90">Voice Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-[#FF0076]/10 to-blue-50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Stay Updated with VoiceShop
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get the latest products, voice features, and exclusive deals delivered to your inbox
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#FF0076] text-white rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* No footer here - it's rendered in the parent App component */}
    </div>
  );
}