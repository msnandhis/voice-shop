import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, Filter, Grid, List, SlidersHorizontal, Eye } from 'lucide-react';
import { getProductsWithDetails, getBrands, Brand, Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { voiceService } from '../lib/voiceService';
import toast from 'react-hot-toast';

interface ProductCatalogProps {
  searchQuery?: string;
  category?: string;
  products?: Product[];
}

export function ProductCatalog({ searchQuery, category, products: externalProducts }: ProductCatalogProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Products', count: 0 },
    { id: 'shoes', name: 'Shoes', count: 0 },
    { id: 'electronics', name: 'Electronics', count: 0 },
    { id: 'clothing', name: 'Clothing', count: 0 },
    { id: 'home', name: 'Home & Garden', count: 0 },
    { id: 'fitness', name: 'Fitness', count: 0 },
    { id: 'accessories', name: 'Accessories', count: 0 },
    { id: 'beauty', name: 'Beauty', count: 0 },
    { id: 'books', name: 'Books', count: 0 },
    { id: 'food', name: 'Food & Beverage', count: 0 }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' }
  ];

  useEffect(() => {
    loadBrands();
    
    // Check for search query in sessionStorage (from header search)
    const storedSearchQuery = sessionStorage.getItem('searchQuery');
    if (storedSearchQuery) {
      setSearchTerm(storedSearchQuery);
      // Clear it after using it
      sessionStorage.removeItem('searchQuery');
    }
  }, []);

  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
      setError(null);
      voiceService.updateContext(externalProducts, category || '', searchQuery || '');
    } else {
      loadProducts();
    }
  }, [externalProducts, searchTerm, selectedCategory, selectedBrand, sortBy, priceRange, minRating]);

  const loadBrands = async () => {
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Loading products...', { selectedCategory, searchTerm, sortBy });
      
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: 50
      };

      let productsData = await getProductsWithDetails(filters);

      // Apply additional client-side filters
      if (selectedBrand !== 'all') {
        productsData = productsData.filter(product => product.brand?.name === selectedBrand);
      }

      productsData = productsData.filter(product => 
        product.price >= priceRange[0] && 
        product.price <= priceRange[1] &&
        product.rating >= minRating
      );

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          productsData.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          productsData.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          productsData.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          productsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'name':
          productsData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          productsData.sort((a, b) => b.rating - a.rating);
      }

      console.log('✅ Loaded products:', productsData.length);
      setProducts(productsData);
      voiceService.updateContext(productsData, selectedCategory, searchTerm);
      
      if (productsData.length === 0 && !searchTerm && selectedCategory === 'all') {
        setError('No products found in the database. Please check your database connection.');
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setError('An unexpected error occurred while loading products');
      setProducts([]);
      toast.error('Failed to load products. Please try again.');
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('featured');
    setPriceRange([0, 1000]);
    setMinRating(0);
  };

  const getProductImages = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images.sort((a, b) => a.sort_order - b.sort_order);
    }
    return [{ image_url: product.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', alt_text: product.name }];
  };

  const getPrimaryImage = (product: Product) => {
    const images = getProductImages(product);
    const primaryImage = images.find(img => img.is_primary);
    return primaryImage?.image_url || images[0]?.image_url || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
          {externalProducts ? 'Voice Search Results' : 'Product Catalog'}
        </h1>
        <p className="text-gray-600 text-lg">
          {externalProducts 
            ? `Found ${products.length} products ${category ? `in ${category}` : ''}`
            : 'Browse our premium products or use voice commands to find what you\'re looking for'
          }
        </p>
        {externalProducts && (
          <div className="mt-4 p-3 bg-[#FF0076]/10 rounded-lg border border-[#FF0076]/20 inline-block">
            <p className="text-[#FF0076] font-medium">
              Voice search results {category && `for "${category}"`}
            </p>
          </div>
        )}
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full">
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FF0076]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent min-w-[160px]"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent min-w-[160px]"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>{brand.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent min-w-[160px]"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#FF0076] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-[#FF0076] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 bg-[#FF0076] text-white rounded-lg hover:bg-[#FF0076]/90 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Voice commands:</strong> "Add the first product", "Add Nike sneakers", "Add the best rated item"</p>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {products.length} result{products.length !== 1 ? 's' : ''} 
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {selectedBrand !== 'all' && ` from ${selectedBrand}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        {products.length > 0 && (
          <p className="text-sm text-gray-500">
            Try: "Add the first product" or "Add the best rated Nike shoes"
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center text-center">
            <div className="text-red-600">
              <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
              <p>{error}</p>
              <button
                onClick={loadProducts}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {products.map((product, index) => (
            <div key={product.id} className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative ${viewMode === 'list' ? 'flex' : ''}`}>
              {/* Position indicator for voice commands */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#FF0076] text-white text-xs px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </span>
              </div>
              
              {/* Brand badge */}
              {product.brand && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium border">
                    {product.brand.name}
                  </span>
                </div>
              )}
              
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : ''}`}>
                <img
                  src={getPrimaryImage(product)}
                  alt={product.name}
                  className={`${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'} object-cover group-hover:scale-105 transition-transform duration-300`}
                />
                <div className="absolute top-12 right-3">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {product.stock_quantity < 10 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Low Stock
                    </span>
                  </div>
                )}
                {/* Multiple images indicator */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.images.length}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="mb-2">
                  <span className="text-xs font-medium text-[#FF0076] uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 font-['Quicksand'] line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-[#FF0076]">
                    {formatPrice(product.price)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                </div>

                {/* Size and Color info */}
                {(product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0) ? (
                  <div className="mb-4 space-y-2">
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Sizes:</span> {product.sizes.slice(0, 4).join(', ')}
                        {product.sizes.length > 4 && '...'}
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Colors:</span> {product.colors.slice(0, 3).join(', ')}
                        {product.colors.length > 3 && '...'}
                      </div>
                    )}
                  </div>
                ) : null}
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity <= 0}
                  className={`
                    w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium
                    transition-all duration-300 transform hover:scale-[1.02]
                    ${product.stock_quantity > 0 
                      ? 'bg-[#FF0076] text-white hover:bg-[#FF0076]/90 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or browse all products</p>
          <div className="text-sm text-gray-500">
            <p>Voice commands you can try:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>"Show me all products"</li>
              <li>"Add the first product"</li>
              <li>"Add Nike sneakers"</li>
              <li>"Add the best rated item"</li>
            </ul>
          </div>
        </div>
      )}

      {/* Product Count */}
      {products.length > 0 && !loading && (
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
          <p className="text-sm mt-2">
            Use voice commands like "Add the first product" or "Add Nike Air Max shoes"
          </p>
        </div>
      )}
    </div>
  );
}