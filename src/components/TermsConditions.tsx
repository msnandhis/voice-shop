import React from 'react';
import { FileText, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export function TermsConditions() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 font-['Quicksand']">
            Terms & Conditions
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Please read these terms carefully before using our voice shopping platform.
          </p>
          <div className="mt-6 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            <p className="font-medium">Last Updated: June 25, 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Introduction
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            These Terms and Conditions ("Terms") govern your access to and use of the VoiceShop website, mobile application, and voice shopping services (collectively, the "Service").
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex">
              <AlertCircle className="text-amber-500 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700">
                <strong>Important:</strong> Our service includes voice technology that processes speech commands. By using these features, you consent to our collection and processing of your voice data as described in our Privacy Policy.
              </p>
            </div>
          </div>
        </section>
        
        {/* Account Terms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Account Terms
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">1. Account Registration</h3>
              <p className="text-gray-700 leading-relaxed">
                To use certain features of the Service, you must register for an account. You must provide accurate, complete, and updated information. You are responsible for safeguarding your account credentials and for all activity under your account.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">2. Account Eligibility</h3>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create an account and use the Service. By creating an account, you represent that you meet these requirements.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">3. Account Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account and access to the Service, without prior notice or liability, for any reason, including breach of these Terms.
              </p>
            </div>
          </div>
        </section>
        
        {/* Ordering and Payments */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Ordering and Payments
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">1. Product Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We make every effort to display products accurately, but we cannot guarantee that all details and colors are accurate or complete. All products are subject to availability, and we reserve the right to discontinue any product at any time.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">2. Pricing and Payment</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                All prices are shown in US dollars and are subject to change. We reserve the right to correct pricing errors. Payment must be made at the time of order through our secure payment methods.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By providing payment information, you represent that you are authorized to use the payment method, and you authorize us to charge your payment method for all orders placed.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-2 font-['Quicksand']">3. Voice Orders</h3>
              <p className="text-gray-700 leading-relaxed">
                When placing orders through voice commands, you acknowledge that our system will process your spoken instructions to the best of its ability. You are responsible for reviewing your order before confirming purchase. We strongly recommend verifying all voice-initiated orders in your cart before completing checkout.
              </p>
            </div>
          </div>
        </section>
        
        {/* Voice Technology */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Voice Technology Terms
          </h2>
          
          <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-xl p-6 border border-[#FF0076]/20 mb-6">
            <p className="text-gray-700 leading-relaxed">
              Our voice shopping technology is designed to understand and process natural language commands. By using these features, you acknowledge and agree to the following:
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">Voice Data Processing</h3>
              <p className="text-gray-700">We process voice commands to understand your shopping intent. This may include temporary storage and analysis of voice patterns to improve service accuracy.</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">Voice Command Limitations</h3>
              <p className="text-gray-700">While we strive for accuracy, our voice recognition technology may not always perfectly interpret commands, particularly in noisy environments or with certain accents or speech patterns.</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">Voice Feature Availability</h3>
              <p className="text-gray-700">Voice features require compatible devices and may not be available in all languages or regions. Functionality may vary by device and browser.</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">Third-Party Voice Services</h3>
              <p className="text-gray-700">Some voice processing may utilize third-party services. By using these features, you also agree to the relevant third-party terms and privacy policies.</p>
            </div>
          </div>
        </section>
        
        {/* Intellectual Property */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Intellectual Property
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Service and its original content, features, and functionality are owned by VoiceShop and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">Restrictions</h3>
            <p className="text-gray-700 mb-4">You may not:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Modify, reproduce, or create derivative works based on the Service or its content</li>
              <li>Use any automated system to access the Service in a manner that sends more requests than a human can reasonably produce</li>
              <li>Use the Service for commercial purposes without our express written consent</li>
              <li>Attempt to reverse engineer any portion of the Service</li>
              <li>Remove any copyright or other proprietary notices from the Service</li>
            </ul>
          </div>
        </section>
        
        {/* Limitation of Liability */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Limitation of Liability
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
            <div className="flex items-start">
              <AlertCircle className="text-[#FF0076] w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW</strong>, VoiceShop and its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, resulting from your access to or use of the Service.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain types of damages. Accordingly, some of the above limitations may not apply to you.
          </p>
        </section>
        
        {/* Changes to Terms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Changes to Terms
          </h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last Updated" date at the top of these Terms and/or by sending you an email notification.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, please stop using the Service.
          </p>
        </section>
        
        {/* Contact Us */}
        <section>
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Contact Us
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you have any questions about these Terms, please contact us at:
          </p>
          
          <div className="bg-[#FF0076]/10 p-6 rounded-xl">
            <p className="text-gray-800 font-medium mb-1">VoiceShop Legal Department</p>
            <p className="text-gray-700">Email: legal@voiceshop.app</p>
            <p className="text-gray-700">Address: 123 Innovation Drive, San Francisco, CA 94105</p>
            <p className="text-gray-700">Phone: (555) 123-4567</p>
          </div>
          
          <div className="mt-8 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#FF0076] mr-2" />
            <span className="text-gray-600">
              Thank you for reading our Terms and Conditions
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}