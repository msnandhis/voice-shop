import React, { useState } from 'react';
import { HelpCircle, Mic, ChevronDown, ChevronUp, Search, ShoppingCart, ShieldCheck, CreditCard, Truck, RotateCcw } from 'lucide-react';

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['general-1']));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    { id: 'general', name: 'General', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'voice', name: 'Voice Shopping', icon: <Mic className="w-5 h-5" /> },
    { id: 'orders', name: 'Orders & Shipping', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'returns', name: 'Returns & Refunds', icon: <RotateCcw className="w-5 h-5" /> },
    { id: 'account', name: 'Account & Privacy', icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  const faqItems = [
    // General FAQs
    {
      id: 'general-1',
      category: 'general',
      question: 'What is VoiceShop?',
      answer: 'VoiceShop is an innovative e-commerce platform that allows you to shop using voice commands. You can browse products, add items to your cart, and complete purchases entirely through natural voice interactions. We also offer traditional shopping methods for those who prefer them.'
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Account" button in the top right corner of the page, then select "Create Account." You\'ll need to provide your email address and create a password. You can also set up your account profile with shipping addresses and payment methods for faster checkout.'
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'Is VoiceShop available internationally?',
      answer: 'Currently, VoiceShop is available in the United States, Canada, and the United Kingdom. We\'re working on expanding to more countries soon. Voice features are currently only available in English, with additional languages planned for future releases.'
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Which devices are compatible with VoiceShop?',
      answer: 'VoiceShop works on most modern web browsers on desktop and mobile devices. For the best voice shopping experience, we recommend using Chrome, Safari, or Edge on devices with good microphone capabilities. The voice features require microphone permissions to be enabled in your browser.'
    },
    
    // Voice Shopping FAQs
    {
      id: 'voice-1',
      category: 'voice',
      question: 'How do I start using voice commands?',
      answer: 'To use voice commands, simply click on the microphone button located in the bottom right corner of any page. When the button turns red, it\'s listening for your command. Speak naturally and clearly, and the system will process your request. You can say things like "Show me running shoes" or "Add the first product to my cart."'
    },
    {
      id: 'voice-2',
      category: 'voice',
      question: 'What voice commands are available?',
      answer: 'You can use voice commands for almost every aspect of shopping, including: browsing products ("Show me electronics"), adding items to your cart ("Add the second product to my cart"), navigating the site ("Go to my cart"), checking out ("Proceed to checkout"), and selecting shipping and payment options during checkout ("Use my first address"). Click the voice assistant button to see more examples.'
    },
    {
      id: 'voice-3',
      category: 'voice',
      question: 'Why isn\'t the voice recognition working?',
      answer: 'If voice recognition isn\'t working, please check that: 1) Your browser has permission to access your microphone, 2) Your microphone is working properly, 3) You\'re in a relatively quiet environment, 4) You\'re using a supported browser (Chrome, Safari, or Edge). If problems persist, try refreshing the page or using a different device.'
    },
    {
      id: 'voice-4',
      category: 'voice',
      question: 'Is my voice data stored or shared?',
      answer: 'We process voice commands to understand your intent, but we don\'t permanently store raw voice recordings without explicit consent. Voice commands are processed securely, and we only save text representations of commands to improve our service. For full details, please see our Privacy Policy.'
    },
    
    // Orders & Shipping FAQs
    {
      id: 'orders-1',
      category: 'orders',
      question: 'How do I check my order status?',
      answer: 'You can check your order status by logging into your account and visiting the "Orders" section. There you\'ll find all your past orders and their current status. You can also track shipments, view order details, and initiate returns if needed. Try using the voice command "Show me my orders" for quick access.'
    },
    {
      id: 'orders-2',
      category: 'orders',
      question: 'How long will it take to receive my order?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Expedited shipping options are available at checkout for 1-2 day delivery. International shipping times vary by destination. The estimated delivery date is displayed at checkout and in your order confirmation email.'
    },
    {
      id: 'orders-3',
      category: 'orders',
      question: 'Can I change or cancel my order?',
      answer: 'You can modify or cancel an order within 1 hour of placing it, provided it hasn\'t entered the processing stage. To do so, go to your Orders page and select the order you wish to modify. If the cancel option isn\'t available, please contact customer service immediately for assistance.'
    },
    {
      id: 'orders-4',
      category: 'orders',
      question: 'Do you ship to PO boxes?',
      answer: 'Yes, we ship to PO boxes for standard shipping methods. However, expedited shipping and certain large items may require a street address for delivery. The available shipping methods will be displayed at checkout based on your selected items and address.'
    },
    
    // Payments FAQs
    {
      id: 'payments-1',
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. For certain regions, we also offer payment installment plans. All payment methods available to you will be displayed at checkout.'
    },
    {
      id: 'payments-2',
      category: 'payments',
      question: 'Is it safe to save my payment information?',
      answer: 'Yes, we take security seriously. When you save a payment method, we only store a secure token and the last four digits of your card for reference. All payment processing is handled by our secure payment partners, and we maintain strict PCI DSS compliance for any payment data we handle.'
    },
    {
      id: 'payments-3',
      category: 'payments',
      question: 'When will I be charged for my order?',
      answer: 'Your payment method will be authorized at the time you place your order, but you won\'t be charged until your order ships. For pre-order or backorder items, we\'ll notify you before charging and shipping. If you use voice commands to place an order, you\'ll have a chance to review and confirm before payment processing.'
    },
    {
      id: 'payments-4',
      category: 'payments',
      question: 'Are there any hidden fees?',
      answer: 'No, we don\'t charge any hidden fees. The price you see is the price you pay, plus any applicable taxes and shipping costs, which are clearly displayed at checkout. We don\'t charge additional fees for using voice shopping features or for using specific payment methods.'
    },
    
    // Returns & Refunds FAQs
    {
      id: 'returns-1',
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached and in original packaging. Some categories like personal care items or customized products may have different return eligibility. Please see our full Return Policy for detailed information.'
    },
    {
      id: 'returns-2',
      category: 'returns',
      question: 'How do I start a return?',
      answer: 'To initiate a return, go to your Orders page, select the order containing the item(s) you want to return, and click "Return Items." Follow the prompts to complete your return request. You can also use voice commands by saying "I need to return an item" and our voice assistant will guide you through the process.'
    },
    {
      id: 'returns-3',
      category: 'returns',
      question: 'How long does it take to process a refund?',
      answer: 'Once we receive your returned item(s), it typically takes 3-5 business days to inspect and process the return. After processing, refunds are issued to your original payment method. Depending on your payment provider, it may take an additional 5-10 business days for the refund to appear in your account.'
    },
    {
      id: 'returns-4',
      category: 'returns',
      question: 'Do I have to pay for return shipping?',
      answer: 'If you\'re returning an item due to our error (wrong item, defective product, etc.), we\'ll cover return shipping costs. For other returns, a shipping fee may be deducted from your refund unless you\'re a VoiceShop Premium member, which includes free return shipping on all orders.'
    },
    
    // Account & Privacy FAQs
    {
      id: 'account-1',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on "Account," select "Sign In," and then click on "Forgot Password." Enter your email address, and we\'ll send you a link to reset your password. For security reasons, password reset links expire after 24 hours.'
    },
    {
      id: 'account-2',
      category: 'account',
      question: 'How is my personal information protected?',
      answer: 'We use industry-standard encryption and security measures to protect your personal information. Your payment details are never stored on our servers in their complete form. We comply with all applicable data protection regulations and have strict internal policies on data access. For complete information, please review our Privacy Policy.'
    },
    {
      id: 'account-3',
      category: 'account',
      question: 'Can I use voice shopping without creating an account?',
      answer: 'You can browse products and use most voice search features without an account. However, to add items to cart and complete a purchase, you\'ll need to sign in or create an account. This is necessary to associate your orders with your profile and provide order tracking and support.'
    },
    {
      id: 'account-4',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Settings > Account Security > Delete Account. Please note that deleting your account will permanently remove your profile, saved addresses, payment methods, and order history. If you have any pending orders, please wait until they\'re completed before deleting your account.'
    }
  ];

  // Filter FAQ items based on active category and search query
  const filteredFaqItems = faqItems.filter(item => {
    // First filter by category
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    
    // Then filter by search if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 font-['Quicksand']">
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
            Find answers to common questions about VoiceShop, voice commands, orders, and more.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* FAQ Categories */}
        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`p-4 rounded-xl text-center transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#FF0076] text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <HelpCircle className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">All FAQs</span>
              </div>
            </button>
            
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#FF0076] text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  {category.icon}
                  <span className="text-sm font-medium mt-2">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqItems.length > 0 ? (
            filteredFaqItems.map(item => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg text-[#12131A]">{item.question}</span>
                  {openItems.has(item.id) 
                    ? <ChevronUp className="w-5 h-5 text-gray-500" /> 
                    : <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                
                {openItems.has(item.id) && (
                  <div className="p-6 pt-0 bg-white">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-600">
                We couldn't find answers matching your search. Please try different keywords or browse by category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}