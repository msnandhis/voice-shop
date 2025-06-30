import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ProductDetail } from './components/ProductDetail';
import { ProductCatalog } from './components/ProductCatalog';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Orders } from './components/Orders';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Deals } from './components/Deals';
import { WhatsNew } from './components/WhatsNew';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ManageAddresses } from './components/ManageAddresses';
import { PaymentSettings } from './components/PaymentSettings';
import { VoiceInterface } from './components/VoiceInterface';
import { useAuth } from './hooks/useAuth';
import { Product } from './lib/supabase';
import { voiceService } from './lib/voiceService';

type View = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'profile' | 'settings' | 'about' | 'contact' | 'deals' | 'whats-new' | 'login' | 'register' | 'manage-addresses' | 'payment-settings';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [voiceProducts, setVoiceProducts] = useState<Product[]>([]);
  const [voiceCategory, setVoiceCategory] = useState<string>('');

  const handleAuthClick = () => {
    setCurrentView('login');
  };

  const handleCartClick = () => {
    setCurrentView('cart');
    voiceService.updatePageContext('cart');
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    setVoiceProducts([]);
    setVoiceCategory('');
    voiceService.updatePageContext('home');
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setVoiceProducts([]);
    setVoiceCategory('');
    voiceService.updatePageContext(view);
  };

  const handleCheckout = () => {
    console.log('Navigating to checkout from cart');
    setCurrentView('checkout');
    voiceService.updatePageContext('checkout', true);
  };

  const handleCheckoutComplete = () => {
    setCurrentView('home');
    setVoiceProducts([]);
    setVoiceCategory('');
    voiceService.updatePageContext('home');
  };

  const handleVoiceCommand = (command: string, result: any) => {
    console.log('Voice command processed:', command, 'Result:', result);
    
    if (result.intent === 'browse_products' && result.data?.products) {
      setVoiceProducts(result.data.products);
      setVoiceCategory(result.data.category || '');
      setCurrentView('products');
      voiceService.updatePageContext('products');
    } else if (result.intent === 'view_cart') {
      console.log('Voice command: Navigating to cart');
      setCurrentView('cart');
      voiceService.updatePageContext('cart');
    } else if (result.intent === 'goto_checkout' || result.intent === 'checkout') {
      console.log('Voice command: Navigating to checkout');
      setCurrentView('checkout');
      voiceService.updatePageContext('checkout', true);
    } else if (result.intent === 'browse_products') {
      // Handle category browsing
      setVoiceCategory(result.data?.category || '');
      setCurrentView('products');
      voiceService.updatePageContext('products');
    } else if (result.intent === 'go_home') {
      console.log('Voice command: Going home');
      setCurrentView('home');
      voiceService.updatePageContext('home');
    }
  };

  // Expose global functions for voice commands
  useEffect(() => {
    console.log('Setting up global voice command functions');
    
    // Navigation functions
    (window as any).handleBrowseProducts = (category: string) => {
      console.log('Global function: Browse products with category:', category);
      setVoiceCategory(category);
      setCurrentView('products');
      voiceService.updatePageContext('products');
    };
    
    (window as any).handleViewCart = () => {
      console.log('Global function: View cart');
      setCurrentView('cart');
      voiceService.updatePageContext('cart');
    };
    
    (window as any).handleGotoCheckout = () => {
      console.log('Global function: Goto checkout');
      setCurrentView('checkout');
      voiceService.updatePageContext('checkout', true);
    };

    (window as any).handleViewOrders = () => {
      console.log('Global function: View orders');
      setCurrentView('orders');
      voiceService.updatePageContext('orders');
    };

    (window as any).handleViewProfile = () => {
      console.log('Global function: View profile');
      setCurrentView('profile');
      voiceService.updatePageContext('profile');
    };

    (window as any).handleViewSettings = () => {
      console.log('Global function: View settings');
      setCurrentView('settings');
      voiceService.updatePageContext('settings');
    };

    (window as any).handleGoHome = () => {
      console.log('Global function: Go home');
      setCurrentView('home');
      voiceService.updatePageContext('home');
    };

    return () => {
      console.log('Cleaning up global voice command functions');
      delete (window as any).handleBrowseProducts;
      delete (window as any).handleViewCart;
      delete (window as any).handleGotoCheckout;
      delete (window as any).handleViewOrders;
      delete (window as any).handleViewProfile;
      delete (window as any).handleViewSettings;
      delete (window as any).handleGoHome;
    };
  }, []);

  // Update voice service context when view changes
  useEffect(() => {
    const isCheckout = currentView === 'checkout';
    console.log('View changed to:', currentView, 'isCheckout:', isCheckout);
    voiceService.updatePageContext(currentView, isCheckout);
  }, [currentView]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF0076]/10 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF0076] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading VoiceShop...</p>
        </div>
      </div>
    );
  }

  // Handle auth views
  if (currentView === 'login') {
    return (
      <Login 
        onBack={() => setCurrentView('home')}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <Register 
        onBack={() => setCurrentView('home')}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faff] flex flex-col">
      {/* Main Content */}
      <div className="flex-grow">
        {currentView === 'home' ? (
          <>
            <LandingPage onNavigation={handleNavigation} />
            <Footer />
          </>
        ) : currentView === 'product-detail' ? (
          <ProductDetail 
            onBack={() => setCurrentView('products')}
            onAddToCart={() => setCurrentView('cart')}
          />
        ) : (
          <>
            <Header
              onAuthClick={handleAuthClick}
              onCartClick={handleCartClick}
              onLogoClick={handleLogoClick}
              onNavigation={handleNavigation}
              currentView={currentView}
            />
            
            {/* Dynamic content based on current view */}
            {currentView === 'products' && (
              <ProductCatalog
                products={voiceProducts.length > 0 ? voiceProducts : undefined}
                category={voiceCategory}
              />
            )}
            
            {currentView === 'cart' && (
              <Cart onCheckout={handleCheckout} />
            )}
            
            {currentView === 'checkout' && (
              <Checkout
                onBack={() => setCurrentView('cart')}
                onComplete={handleCheckoutComplete}
              />
            )}
            
            {currentView === 'orders' && (
              <Orders />
            )}
            
            {currentView === 'profile' && (
              <Profile />
            )}
            
            {currentView === 'settings' && (
              <Settings />
            )}
            
            {currentView === 'about' && (
              <About />
            )}
            
            {currentView === 'contact' && (
              <Contact />
            )}
            
            {currentView === 'deals' && (
              <Deals />
            )}
            
            {currentView === 'whats-new' && (
              <WhatsNew />
            )}
            
            {currentView === 'manage-addresses' && (
              <ManageAddresses />
            )}
            
            {currentView === 'payment-settings' && (
              <PaymentSettings />
            )}
            
            <Footer />
          </>
        )}
      </div>
      
      {/* Floating Voice Assistant - Always Visible */}
      <VoiceInterface onVoiceCommand={handleVoiceCommand} />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;