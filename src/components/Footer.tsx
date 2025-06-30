import React from 'react';
import { Mic } from 'lucide-react';

interface FooterProps {
  onNavigation?: (view: 'home' | 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'settings' | 'about' | 'contact' | 'deals' | 'whats-new' | 'login' | 'register') => void;
}

export function Footer({ onNavigation }: FooterProps) {
  const handleNavClick = (view: 'about' | 'contact' | 'deals') => {
    if (onNavigation) {
      onNavigation(view);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (typeof window.handleBrowseProducts === 'function') {
      window.handleBrowseProducts(category);
    }
  };

  return (
    <footer className="bg-[#12131A] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#FF0076] rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-['Quicksand']">VoiceShop</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The future of e-commerce is here. Shop entirely through voice commands for a seamless, 
              accessible, and hands-free shopping experience.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <span className="text-sm">hello@voiceshop.app</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-['Quicksand']">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick(''); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Products</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Contact</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('deals'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Deals</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-['Quicksand']">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('shoes'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Shoes</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('electronics'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Electronics</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('clothing'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Clothing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('accessories'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Accessories</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VoiceShop. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Powered by</span>
              <span className="text-[#FF0076] text-sm font-medium">ElevenLabs & Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}