import React, { useState, useEffect } from 'react';
import { Tag, Clock, ShoppingCart, Star, TrendingDown, Zap, Gift, Heart, Filter } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function Deals() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');

  const categories = [
    { id: 'all', name: 'All Deals', count: 0 },
    { id: 'electronics', name: 'Electronics', count: 0 },
    { id: 'shoes', name: 'Shoes', count: 0 },
    { id: 'clothing', name: 'Clothing', count: 0 },
    { id: 'home', name: 'Home', count: 0 },
    { id: 'fitness', name: 'Fitness', count: 0 }
  ];

  const dealTypes = [
    {
      title: 'Flash Sale',
      icon: Zap,
      description: 'Limited time offers with huge discounts',
      color: 'from-[#FF0076] to-[#FF408A]',
      textColor: 'text-[#FF0076]',
      bgColor: 'bg-[#FF0076]/10'
    },
    {
      title: 'Bundle Deals',
      icon: Gift,
      description: 'Buy more, save more with our bundle offers',
      color: 'from-[#FF0076] to-[#FF408A]',
      textColor: 'text-[#FF0076]',
      bgColor: 'bg-[#FF0076]/10'
    },
    {
      title: 'Clearance',
      icon: TrendingDown,
      description: 'Last chance to grab these amazing products',
      color: 'from-[#FF0076] to-[#FF408A]',
      textColor: 'text-[#FF0076]',
      bgColor: 'bg-[#FF0076]/10'
    }
  ];

  const flashDeals = [
    {
      title: 'Electronics Mega Sale',
      subtitle: 'Up to 70% off smartphones, laptops & accessories',
      timeLeft: '2h 45m',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      discount: '70%'
    },
    {
      title: 'Fashion Flash Sale',
      subtitle: 'Trendy clothing and shoes at unbeatable prices',
      timeLeft: '5h 12m',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      discount: '60%'
    },
    {
      title: 'Home & Living',
      subtitle: 'Transform your space with our home deals',
      timeLeft: '1d 3h',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
      discount: '50%'
    }
  ];

  useEffect(() => {
    loadDealProducts();
  }, [selectedCategory, sortBy]);

  const loadDealProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .gte('stock_quantity', 1);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      // Sort by different criteria
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('price', { ascending: true }); // Show cheapest first for deals
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      
      // Add artificial discount information for demo
      const productsWithDeals = (data || []).map(product => ({
        ...product,
        originalPrice: product.price * (1 + Math.random() * 0.5 + 0.2), // 20-70% off
        discountPercent: Math.floor(Math.random() * 50) + 20, // 20-70% off
        dealType: ['Flash Sale', 'Limited Offer', 'Clearance', 'Bundle Deal'][Math.floor(Math.random() * 4)],
        isHot: Math.random() > 0.7,
        timeLeft: Math.random() > 0.5 ? `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` : null
      }));

      setDealProducts(productsWithDeals);
    } catch (error) {
      console.error('Error loading deal products:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: any) => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
    }
    
    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-[#f0faff] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-['Quicksand']">
              🔥 Mega Deals & Offers
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Save up to 70% on thousands of products with voice shopping
            </p>
            <div className="flex justify-center items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Limited Time Offers</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Tag className="w-5 h-5" />
                <span className="font-semibold">Up to 70% Off</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              ⚡ Flash Deals
            </h2>
            <p className="text-xl text-gray-600">Limited time offers - grab them before they're gone!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flashDeals.map((deal, index) => (
              <div key={index} className="relative bg-gradient-to-br from-[#FF0076]/5 to-blue-50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-[#FF0076] text-white text-sm font-bold px-3 py-1 rounded-full">
                    {deal.discount} OFF
                  </div>
                </div>
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-sm text-[#FF0076] text-sm font-medium px-3 py-1 rounded-full flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{deal.timeLeft}</span>
                  </div>
                </div>
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#12131A] mb-2">{deal.title}</h3>
                  <p className="text-gray-600 mb-4">{deal.subtitle}</p>
                  <button className="w-full bg-[#FF0076] text-white py-3 rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Deal Categories
            </h2>
            <p className="text-xl text-gray-600">Choose your favorite type of savings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dealTypes.map((dealType, index) => {
              const IconComponent = dealType.icon;
              return (
                <div key={index} className={`${dealType.bgColor} rounded-3xl p-8 text-center hover:shadow-xl transition-shadow`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${dealType.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${dealType.textColor} mb-3`}>{dealType.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{dealType.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-8">
            <h2 className="text-3xl font-bold text-[#12131A] font-['Quicksand']">
              All Deals
            </h2>
            
            <div className="flex-1"></div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
              >
                <option value="discount">Best Deals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
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
              {dealProducts.map((product: any, index) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border-2 border-[#FF0076]/10">
                  {/* Deal Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-[#FF0076] text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discountPercent}%
                    </div>
                  </div>

                  {/* Hot Deal Badge */}
                  {product.isHot && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-[#FF0076] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>HOT</span>
                      </div>
                    </div>
                  )}

                  {/* Product Position */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="bg-[#FF0076] text-white text-xs px-2 py-1 rounded-full font-medium">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={product.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-12 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-[#FF0076] uppercase tracking-wide bg-[#FF0076]/10 px-2 py-1 rounded-full">
                        {product.dealType}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 font-['Quicksand'] line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-[#FF0076]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 font-medium">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </p>
                    </div>

                    {product.timeLeft && (
                      <div className="mb-4 p-2 bg-[#FF0076]/10 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 text-[#FF0076]">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Ends in {product.timeLeft}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity <= 0}
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white hover:from-[#FF0076]/90 hover:to-[#FF408A]/90 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {dealProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new deals</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 font-['Quicksand']">
            Never Miss a Deal!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to get notified about flash sales, exclusive deals, and limited-time offers
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-l-xl text-gray-900 focus:outline-none"
            />
            <button className="px-8 py-4 bg-white text-[#FF0076] rounded-r-xl font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            💬 Try saying: "Subscribe to deals" or "Show me flash sales"
          </p>
        </div>
      </section>
    </div>
  );
}