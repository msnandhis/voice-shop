import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@voiceshop.app',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: '24/7 voice support available'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: '123 Innovation Drive, San Francisco, CA 94105',
      description: 'Visit our headquarters'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: '24/7 Support',
      description: 'We\'re always here to help'
    }
  ];

  const faqs = [
    {
      question: 'How does voice shopping work?',
      answer: 'Simply click the voice button and speak naturally. Say things like "Show me sneakers" or "Add the first product to my cart" and our AI will understand and execute your commands.'
    },
    {
      question: 'Is voice shopping secure?',
      answer: 'Absolutely! All voice commands are processed securely, and we never store your voice data. Your payment information is encrypted and protected.'
    },
    {
      question: 'What browsers support voice features?',
      answer: 'Voice shopping works on all modern browsers including Chrome, Safari, Firefox, and Edge. Make sure to allow microphone permissions when prompted.'
    },
    {
      question: 'Can I use voice commands on mobile?',
      answer: 'Yes! Voice shopping works perfectly on mobile devices. Just tap the voice button and start speaking.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-['Quicksand']">
            Get in Touch
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Have questions about voice shopping? Need help with your order? We're here to help you 24/7.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Try saying: "I need help with my order"</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF0076] to-[#FF408A] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
                    {info.title}
                  </h3>
                  <p className="text-[#FF0076] font-medium mb-2">{info.details}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-4xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
                Send us a Message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0076] focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#FF0076] text-white font-bold rounded-lg hover:bg-[#FF0076]/90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-4xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Quick answers to common questions about VoiceShop.
              </p>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-[#12131A] mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-[#FF0076]/10 to-blue-50 rounded-2xl border border-[#FF0076]/20">
                <h3 className="text-lg font-semibold text-[#FF0076] mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-700 mb-4">
                  Try using our voice assistant! Just click the voice button and ask your question naturally.
                </p>
                <div className="text-sm text-gray-600">
                  <p>Example: "How do I track my order?" or "What's your return policy?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600">
              Come and see the future of voice commerce in action
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-r from-[#FF0076]/20 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#FF0076] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#12131A] mb-2">VoiceShop Headquarters</h3>
                <p className="text-gray-600">123 Innovation Drive, San Francisco, CA 94105</p>
                <button className="mt-4 px-6 py-3 bg-[#FF0076] text-white rounded-full font-medium hover:bg-[#FF0076]/90 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}