import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Mic } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Header } from './Header';
import { Footer } from './Footer';

interface RegisterProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onBack, onSwitchToLogin }: RegisterProps) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Welcome to VoiceShop!');
        onBack(); // Close auth and return to main app
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {/* Info Side */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#FF0076] to-[#FF408A] items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FF0076]/80 to-[#FF408A]/80 opacity-70"></div>
              
              <div className="relative z-10 text-center px-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold font-['Quicksand'] text-white">VoiceShop</h1>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-white leading-tight">Join the voice shopping revolution</h2>
                <p className="text-white/90 mb-6">
                  Create your account today to experience the future of e-commerce
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-left">
                  <p className="text-white font-medium mb-2">Benefits:</p>
                  <ul className="space-y-2">
                    <li className="text-white/90 text-sm">• Shop hands-free with voice commands</li>
                    <li className="text-white/90 text-sm">• Save payment methods and addresses</li>
                    <li className="text-white/90 text-sm">• Track your orders in real time</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <button 
                onClick={onBack} 
                className="flex items-center text-[#FF0076] mb-8 hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to shopping
              </button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#12131A] mb-2 font-['Quicksand']">Create Account</h2>
                <p className="text-gray-600">Join the future of voice-powered shopping</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Create a password"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
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
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={onSwitchToLogin}
                      className="text-[#FF0076] hover:text-[#FF0076]/80 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}