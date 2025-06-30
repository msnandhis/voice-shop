import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Mic } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Header } from './Header';
import { Footer } from './Footer';

interface LoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onBack, onSwitchToRegister }: LoginProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back! Signed in successfully.');
        onBack(); // Close auth and return to main app
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = () => {
    setFormData({
      email: 'nandy@voiceshop.netlify.app',
      password: 'nandy@voiceshop.netlify.app'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0faff]">
      {/* Header */}
      <Header 
        onAuthClick={() => {}} 
        onCartClick={onBack} 
        onLogoClick={onBack} 
        onNavigation={() => onBack()} 
      />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Info Side - Left */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#FF0076] to-[#FF408A] items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FF0076]/80 to-[#FF408A]/80 opacity-70"></div>
              
              <div className="relative z-10 text-center px-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold font-['Quicksand'] text-white">VoiceShop</h1>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 leading-tight text-white">Shop with your voice</h2>
                <p className="text-white/90 mb-6">
                  Experience the future of shopping with our voice-powered platform
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-4 text-left">
                  <p className="text-white font-medium mb-2">Try saying:</p>
                  <p className="text-white/90 text-sm">"Show me Nike sneakers"</p>
                  <p className="text-white/90 text-sm">"Add the first product to cart"</p>
                </div>
              </div>
            </div>
            
            {/* Form Side - Right */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <button 
                onClick={onBack} 
                className="flex items-center text-[#FF0076] mb-8 hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to shopping
              </button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a href="#" className="text-sm text-[#FF0076] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Enter your password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-3.5 px-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#FF0076] hover:bg-[#FF0076]/90 shadow-lg hover:shadow-xl'
                    } text-white
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <span className="mx-4 text-sm text-gray-500">or</span>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                <button 
                  type="button" 
                  onClick={useDemoAccount}
                  className="w-full py-3 px-4 border-2 border-[#FF0076] text-[#FF0076] rounded-lg font-semibold hover:bg-[#FF0076]/5 transition-colors"
                >
                  Use Demo Account
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onSwitchToRegister}
                    className="text-[#FF0076] hover:text-[#FF0076]/80 font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}