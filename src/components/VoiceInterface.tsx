import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { voiceService } from '../lib/voiceService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface VoiceInterfaceProps {
  onVoiceCommand?: (command: string, result: any) => void;
}

export function VoiceInterface({ onVoiceCommand }: VoiceInterfaceProps) {
  const { userProfile, profileLoading } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [commandHistory, setCommandHistory] = useState<Array<{command: string, response: string, timestamp: Date}>>([]);

  useEffect(() => {
    setIsSupported(voiceService.isSupported() && voiceService.isSpeechSynthesisSupported());
  }, []);

  const showContextualToast = (result: any) => {
    const toastStyle = {
      background: 'linear-gradient(135deg, #FF0076 0%, #FF408A 100%)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      padding: '12px 16px'
    };

    switch (result.intent) {
      case 'add_to_cart_success':
      case 'add_to_cart_position':
      case 'add_to_cart_rating':
      case 'add_to_cart_name':
        toast.success('🛒 Product added to cart!', { style: toastStyle });
        break;
      case 'address_selected':
        toast.success('📍 Shipping address selected!', { style: toastStyle });
        break;
      case 'card_selected':
        toast.success('💳 Payment method selected!', { style: toastStyle });
        break;
      case 'place_order':
        toast.success('🎉 Order being processed!', { style: toastStyle });
        break;
      case 'browse_products':
        toast.success('👀 Showing products for you!', { style: toastStyle });
        break;
      case 'view_cart':
        toast.success('🛍️ Opening your cart!', { style: toastStyle });
        break;
      case 'goto_checkout':
        toast.success('💰 Taking you to checkout!', { style: toastStyle });
        break;
      case 'auth_required':
        toast.error('🔐 Please sign in first', { 
          style: { ...toastStyle, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
        });
        break;
      default:
        if (result.intent.includes('error')) {
          toast.error(`❌ ${result.response}`, { 
            style: { ...toastStyle, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
          });
        } else {
          toast.success('✨ Command processed!', { style: toastStyle });
        }
    }
  };

  const startListening = async () => {
    if (!isSupported) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) return;

    try {
      setIsListening(true);
      toast('🎤 Listening... Speak now', { 
        icon: '🎤',
        style: {
          background: 'linear-gradient(135deg, #FF0076 0%, #FF408A 100%)',
          color: 'white',
          fontWeight: '500'
        }
      });
      
      const command = await voiceService.startListening();
      setLastCommand(command);
      
      console.log('🎯 Voice command received:', command);
      
      // Add to history
      const historyEntry = {
        command,
        response: '',
        timestamp: new Date()
      };
      
      // Process the command
      const result = await voiceService.processVoiceCommand(command, userProfile?.id);
      
      console.log('🚀 Voice command result:', result);
      
      // Update history with response
      historyEntry.response = result.response;
      setCommandHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
      
      // Speak the response
      setIsSpeaking(true);
      await voiceService.speak(result.response);
      setIsSpeaking(false);
      
      // Notify parent component
      if (onVoiceCommand) {
        onVoiceCommand(command, result);
      }
      
      showContextualToast(result);
      
    } catch (error) {
      console.error('Voice recognition error:', error);
      toast.error('❌ Voice recognition failed. Please try again.');
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  // Handle scroll events to prevent bubbling to parent
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    // Only prevent default if we're at scroll boundaries to allow natural scrolling
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // If scrolling up and already at top, prevent default
    if (e.deltaY < 0 && scrollTop === 0) {
      e.preventDefault();
    }
    // If scrolling down and already at bottom, prevent default
    if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight) {
      e.preventDefault();
    }
  };

  // Handle mouse events to prevent bubbling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isSupported) {
    return null;
  }

  // Never hide completely - always show the voice interface
  if (isHidden) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsHidden(false)}
          className="w-12 h-12 bg-[#FF0076] text-white rounded-full shadow-lg hover:bg-[#FF0076]/90 transition-all duration-300 flex items-center justify-center"
          title="Show Voice Assistant"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Minimized State */}
      {!isExpanded && (
        <div className="relative">
          {/* Main voice button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`
              relative inline-flex items-center justify-center w-16 h-16 rounded-full
              transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-[#FF0076] to-[#FF408A] hover:from-[#FF0076]/90 hover:to-[#FF408A]/90'
              }
              ${isSpeaking ? 'opacity-75 cursor-not-allowed' : ''}
              text-white border-4 border-white/20
            `}
          >
            {isListening ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            )}
          </button>
          
          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Speaking/Status Indicator */}
          {(isSpeaking || isListening) && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap flex items-center backdrop-blur-sm">
              {isSpeaking ? (
                <>
                  <Volume2 className="w-3 h-3 mr-2 animate-pulse" />
                  Speaking...
                </>
              ) : isListening ? (
                <>
                  <Mic className="w-3 h-3 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 w-96 h-[32rem] flex flex-col"
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-full flex items-center justify-center mr-3">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 font-['Quicksand']">
                  Voice Assistant
                </h3>
                <p className="text-xs text-gray-500">
                  Click to speak
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => setIsHidden(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Hide"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Voice Controls */}
          <div className="flex justify-center items-center space-x-4 mb-6 flex-shrink-0">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`
                relative inline-flex items-center justify-center w-20 h-20 rounded-full
                transition-all duration-300 transform hover:scale-105
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-[#FF0076] to-[#FF408A] hover:from-[#FF0076]/90 hover:to-[#FF408A]/90'
                }
                ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}
                text-white shadow-xl border-4 border-white/20
              `}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
            </button>
            
            {isSpeaking && (
              <div className="flex items-center text-[#FF0076]">
                <Volume2 className="w-6 h-6 mr-2 animate-pulse" />
                <span className="text-sm font-medium">Speaking...</span>
              </div>
            )}
          </div>
          
          {/* Status */}
          <div className="text-center mb-4 flex-shrink-0">
            <p className="text-sm font-medium text-gray-900">
              {isListening ? '🎤 Listening... Speak now' : 
               isSpeaking ? '🔊 Speaking...' :
               '💬 Click the button to start voice commands'}
            </p>
            {!isListening && !isSpeaking && (
              <p className="text-xs text-gray-500 mt-1">
                Enhanced with ElevenLabs AI voice
              </p>
            )}
          </div>
          
          {/* Command History */}
          {commandHistory.length > 0 && (
            <div className="mb-4 flex-shrink-0">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Recent Commands</h4>
              <div className="space-y-3 max-h-24 overflow-y-auto" onWheel={handleWheel}>
                {commandHistory.map((entry, index) => (
                  <div key={index} className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-lg p-3 border border-[#FF0076]/10">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-gray-800">"{entry.command}"</p>
                      <span className="text-xs text-gray-400">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">{entry.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Natural Voice Commands */}
          <div className="flex-1 flex flex-col min-h-0">
            <h4 className="font-medium text-gray-700 mb-3 text-sm flex-shrink-0">Natural Voice Commands:</h4>
            <div 
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2" 
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              style={{ 
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2 text-sm">🛍️ Shopping:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• "Show me some sneakers"</p>
                    <p className="text-xs text-gray-600">• "Add the first product to my cart"</p>
                    <p className="text-xs text-gray-600">• "Add iPhone 15 Pro to cart"</p>
                    <p className="text-xs text-gray-600">• "Take me to my cart"</p>
                    <p className="text-xs text-gray-600">• "Browse electronics"</p>
                    <p className="text-xs text-gray-600">• "Show me Nike shoes"</p>
                    <p className="text-xs text-gray-600">• "Add the best rated item"</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2 text-sm">💰 Checkout:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• "Use my first address"</p>
                    <p className="text-xs text-gray-600">• "Pay with card one"</p>
                    <p className="text-xs text-gray-600">• "Place my order now"</p>
                    <p className="text-xs text-gray-600">• "Proceed to checkout"</p>
                    <p className="text-xs text-gray-600">• "Complete my purchase"</p>
                    <p className="text-xs text-gray-600">• "Use details 2"</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2 text-sm">🧭 Navigation:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• "Go home"</p>
                    <p className="text-xs text-gray-600">• "View my cart"</p>
                    <p className="text-xs text-gray-600">• "View my orders"</p>
                    <p className="text-xs text-gray-600">• "Show my profile"</p>
                    <p className="text-xs text-gray-600">• "Open settings"</p>
                    <p className="text-xs text-gray-600">• "What's new"</p>
                    <p className="text-xs text-gray-600">• "Show deals"</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2 text-sm">🔍 Search & Browse:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• "Show me products"</p>
                    <p className="text-xs text-gray-600">• "Browse clothing"</p>
                    <p className="text-xs text-gray-600">• "Find Apple products"</p>
                    <p className="text-xs text-gray-600">• "Show fitness gear"</p>
                    <p className="text-xs text-gray-600">• "What's available in shoes?"</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700 mb-2 text-sm">❓ Help & Info:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• "What can you do?"</p>
                    <p className="text-xs text-gray-600">• "Help me"</p>
                    <p className="text-xs text-gray-600">• "Show available commands"</p>
                    <p className="text-xs text-gray-600">• "How does this work?"</p>
                    <p className="text-xs text-gray-600">• "What's my order status?"</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-lg p-3 border border-[#FF0076]/20">
                  <p className="font-medium text-[#FF0076] mb-2 text-sm">💡 Pro Tips:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">• Speak naturally and clearly</p>
                    <p className="text-xs text-gray-600">• Use "the first", "the second" for positions</p>
                    <p className="text-xs text-gray-600">• Say brand names like "Nike" or "Apple"</p>
                    <p className="text-xs text-gray-600">• Try "Add the best rated product"</p>
                    <p className="text-xs text-gray-600">• Click the mic button to start</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}