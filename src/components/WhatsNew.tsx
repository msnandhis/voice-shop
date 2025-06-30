import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, TrendingUp, Star, ShoppingCart, Heart, Filter, Tag, Zap, Crown } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function WhatsNew() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'All Categories', count: 0 },
    { id: 'electronics', name: 'Electronics', count: 0 },
    { id: 'shoes', name: 'Shoes', count: 0 },
    { id: 'clothing', name: 'Clothing', count: 0 },
    { id: 'home', name: 'Home', count: 0 },
    { id: 'fitness', name: 'Fitness', count: 0 },
    { id: 'accessories', name: 'Accessories', count: 0 }
  ];

  const newFeatures = [
    {
      title: 'Voice Shopping 2.0',
      description: 'Enhanced AI understanding with natural language processing',
      icon: Sparkles,
      color: 'from-[#FF0076] to-[#FF408A]',
      date: 'Just Released'
    },
    {
      title: 'Smart Recommendations',
      description: 'Personalized product suggestions based on your preferences',
      icon: TrendingUp,
      color: 'from-[#FF0076] to-[#FF408A]',
      date: 'This Week'
    },
    {
      title: 'Express Checkout',
      description: 'Complete your purchase in seconds with voice commands',
      icon: Zap,
      color: 'from-[#FF0076] to-[#FF408A]',
      date: 'New'
    }
  ];

  const collections = [
    {
      title: 'Summer Essentials',
      subtitle: 'Beat the heat with our curated summer collection',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      products: 150,
      isNew: true
    },
    {
      title: 'Tech Innovations',
      subtitle: 'Latest gadgets and electronic devices',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      products: 89,
      isNew: true
    },
    {
      title: 'Workout Ready',
      subtitle: 'New fitness gear for your active lifestyle',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg',
      products: 67,
      isNew: false
    }
  ];

  useEffect(() => {
    loadNewProducts();
    loadTrendingProducts();
  }, [selectedCategory, sortBy]);

  const loadNewProducts = async () => {
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
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(16);

      if (error) throw error;
      
      // Add artificial "new" information for demo
      const productsWithNewInfo = (data || []).map(product => ({
        ...product,
        isNew: Math.random() > 0.5,
        isTrending: Math.random() > 0.7,
        launchDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
        badge: ['New Arrival', 'Just Launched', 'Fresh', 'Latest'][Math.floor(Math.random() * 4)]
      }));

      setNewProducts(productsWithNewInfo);
    } catch (error) {
      console.error('Error loading new products:', error);
      toast.error('Failed to load new products');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('stock_quantity', 1)
        .gte('rating', 4.5)
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      const trendingWithInfo = (data || []).map(product => ({
        ...product,
        trendingScore: Math.floor(Math.random() * 100) + 1,
        viewsToday: Math.floor(Math.random() * 1000) + 100
      }));

      setTrendingProducts(trendingWithInfo);
    } catch (error) {
      console.error('Error loading trending products:', error);
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-[#f0faff] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-['Quicksand']">
              ✨ What's New
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Discover the latest products, features, and collections at VoiceShop
            </p>
            <div className="flex justify-center items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Updated Daily</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Latest Arrivals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              🚀 Latest Features
            </h2>
            <p className="text-xl text-gray-600">Exciting new features to enhance your shopping experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-[#FF0076]/5 to-blue-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-[#FF0076]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                      {feature.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#12131A] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Collections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              🎯 New Collections
            </h2>
            <p className="text-xl text-gray-600">Curated collections featuring the latest trends</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div key={index} className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                {collection.isNew && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-[#FF0076] text-white text-sm font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>New</span>
                    </div>
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm opacity-90">{collection.products} products</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#12131A] mb-2">{collection.title}</h3>
                  <p className="text-gray-600 mb-4">{collection.subtitle}</p>
                  <button className="w-full bg-[#FF0076] text-white py-3 rounded-xl font-semibold hover:bg-[#FF0076]/90 transition-colors">
                    Explore Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              📈 Trending Now
            </h2>
            <p className="text-xl text-gray-600">Most popular products this week</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product: any, index) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border-2 border-[#FF0076]/10">
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-[#FF0076] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>#{index + 1}</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm text-[#FF0076] text-xs font-medium px-2 py-1 rounded-full">
                    {product.viewsToday} views today
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-12 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-[#FF0076] uppercase tracking-wide bg-[#FF0076]/10 px-2 py-1 rounded-full">
                      Trending
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
                    <span className="text-2xl font-bold text-[#FF0076]">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white hover:from-[#FF0076]/90 hover:to-[#FF408A]/90 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-8">
            <h2 className="text-3xl font-bold text-[#12131A] font-['Quicksand']">
              🆕 Latest Arrivals
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
                <option value="newest">Newest First</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
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
              {newProducts.map((product: any, index) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                  {/* New Badge */}
                  {product.isNew && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-[#FF0076] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.badge}
                      </div>
                    </div>
                  )}

                  {/* Trending Badge */}
                  {product.isTrending && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-[#FF0076] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                        <Crown className="w-3 h-3" />
                        <span>Hot</span>
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
                    <button className="absolute top-12 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#FF0076] uppercase tracking-wide">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(product.launchDate)}
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
                      <span className="text-2xl font-bold text-[#FF0076]">
                        {formatPrice(product.price)}
                      </span>
                    </div>

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

          {newProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No new products found</h3>
              <p className="text-gray-600 mb-4">Check back soon for the latest arrivals</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 font-['Quicksand']">
            Stay Ahead of the Curve
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be the first to know about new arrivals, features, and exclusive launches
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
            💬 Try saying: "Show me what's new" or "What are the latest products?"
          </p>
        </div>
      </section>
    </div>
  );
}