import React from 'react';
import { Mic } from 'lucide-react';

interface FooterProps {
  onNavigation?: (view: 'home' | 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'settings' | 'about' | 'contact' | 'deals' | 'whats-new' | 'login' | 'register' | 'privacy' | 'terms' | 'refund' | 'faq') => void;
}

export function Footer({ onNavigation }: FooterProps) {
  const handleNavClick = (view: 'about' | 'contact' | 'deals' | 'privacy' | 'terms' | 'refund' | 'faq') => {
    if (onNavigation) {
      onNavigation(view);
      // Scroll to top when navigating to a new page
      window.scrollTo(0, 0);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (typeof window.handleBrowseProducts === 'function') {
      window.handleBrowseProducts(category);
      // Scroll to top when navigating to a new page
      window.scrollTo(0, 0);
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

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-['Quicksand']">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Terms & Conditions</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('refund'); }} className="text-gray-300 hover:text-[#FF0076] transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-center">
          <p className="text-gray-400 text-sm text-center">
            © 2025 VoiceShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}