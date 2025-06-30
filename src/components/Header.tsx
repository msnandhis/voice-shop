import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X, Mic, Package, Settings as SettingsIcon, Home, Info, Phone, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  onAuthClick?: () => void;
  onCartClick?: () => void;
  onLogoClick?: () => void;
  onNavigation?: (view: 'home' | 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'settings' | 'about' | 'contact' | 'deals' | 'whats-new' | 'login' | 'register' | 'privacy' | 'terms' | 'refund' | 'faq') => void;
  currentView?: string;
}

export function Header({ onAuthClick, onCartClick, onLogoClick, onNavigation, currentView }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const publicNavItems = [
    { name: 'Home', id: 'home', icon: Home },
    { name: 'Products', id: 'products', icon: Mic },
    { name: 'About', id: 'about', icon: Info },
    { name: 'Contact', id: 'contact', icon: Phone }
  ];

  const userNavItems = [
    { name: 'Cart', id: 'cart', icon: ShoppingCart },
    { name: 'Orders', id: 'orders', icon: Package },
    { name: 'Profile', id: 'profile', icon: User },
    { name: 'Settings', id: 'settings', icon: SettingsIcon }
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'cart' && onCartClick) {
      onCartClick();
    } else if (itemId === 'home' && onLogoClick) {
      onLogoClick();
    } else if (onNavigation) {
      onNavigation(itemId as any);
    }
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    if (typeof window.handleBrowseProducts === 'function') {
      window.handleBrowseProducts(category);
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { id: 'shoes', name: 'Shoes' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Execute search by navigating to products with the search term
    if (typeof window.handleBrowseProducts === 'function') {
      window.handleBrowseProducts('');
      // Store search query in sessionStorage for the ProductCatalog to use
      sessionStorage.setItem('searchQuery', searchQuery);
      // Reset search input
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#12131A] text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📞 +001234567890</span>
            <span>Get 50% Off on Selected Items | Shop Now</span>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-transparent border-none text-white text-sm">
              <option>Eng</option>
            </select>
            <select className="bg-transparent border-none text-white text-sm">
              <option>Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={onLogoClick}
              className="flex items-center space-x-2 text-xl font-bold text-[#12131A] hover:text-[#FF0076] transition-colors font-['Quicksand']"
            >
              <div className="w-8 h-8 bg-[#FF0076] rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span>VoiceShop</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF0076] transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-2xl">{category.id === 'shoes' ? '👟' : 
                                                    category.id === 'electronics' ? '📱' : 
                                                    category.id === 'clothing' ? '👕' : 
                                                    category.id === 'home' ? '🏠' : 
                                                    category.id === 'fitness' ? '💪' : 
                                                    category.id === 'accessories' ? '👜' : '📦'}</span>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="text-gray-700 hover:text-[#FF0076] transition-colors"
                onClick={() => onNavigation?.('deals')}
              >
                Deals
              </button>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <form className="relative w-full" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-[#FF0076] transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onCartClick}
                    className="relative p-2 text-gray-700 hover:text-[#FF0076] transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FF0076] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => onNavigation?.('profile')}
                    className="p-2 text-gray-700 hover:text-[#FF0076] transition-colors"
                    title="Your Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FF0076] text-white font-medium hover:bg-[#FF0076]/90 transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">
              {/* Mobile Search */}
              <form className="mb-4" onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076]"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FF0076]"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <nav className="flex flex-col space-y-4">
                {/* Public Navigation */}
                {publicNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        text-left text-base font-medium transition-colors flex items-center space-x-3
                        ${currentView === item.id 
                          ? 'text-[#FF0076]' 
                          : 'text-gray-700 hover:text-[#FF0076]'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}

                {/* Categories Section */}
                <div className="py-2">
                  <p className="text-sm text-gray-500 uppercase font-semibold mb-2">Categories</p>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="w-full py-2 text-left text-base font-medium text-gray-700 hover:text-[#FF0076] transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Deals */}
                <button
                  onClick={() => handleNavClick('deals')}
                  className={`
                    text-left text-base font-medium transition-colors flex items-center space-x-3
                    ${currentView === 'deals' 
                      ? 'text-[#FF0076]' 
                      : 'text-gray-700 hover:text-[#FF0076]'
                    }
                  `}
                >
                  <span className="w-5 h-5">🏷️</span>
                  <span>Deals</span>
                </button>

                {/* User Navigation and Actions */}
                {user ? (
                  <>
                    {/* User Navigation Items */}
                    <div className="border-t border-gray-200 pt-4">
                      {userNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`
                              text-left text-base font-medium transition-colors flex items-center space-x-3 mb-4
                              ${currentView === item.id 
                                ? 'text-[#FF0076]' 
                                : 'text-gray-700 hover:text-[#FF0076]'
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                            {item.id === 'cart' && getTotalItems() > 0 && (
                              <span className="bg-[#FF0076] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getTotalItems()}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* User Account Actions */}
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onAuthClick?.();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FF0076] text-white font-medium hover:bg-[#FF0076]/90 transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}