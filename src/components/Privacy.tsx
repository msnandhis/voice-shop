import React from 'react';
import { Shield, Eye, Lock, Info, AlertCircle, Check } from 'lucide-react';

export function Privacy() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 font-['Quicksand']">
            Privacy Policy
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            At VoiceShop, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
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
            VoiceShop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our voice-powered shopping application, or make purchases through our platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy. If you do not agree with our policies and practices, please do not use our service.
          </p>
        </section>
        
        {/* Information We Collect */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Eye className="text-[#FF0076] w-7 h-7 mr-3" />
            <h2 className="text-3xl font-bold text-[#12131A] font-['Quicksand']">
              Information We Collect
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Personal Information
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                We may collect personally identifiable information, such as:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Name and contact information (email address, phone number, shipping address)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Billing information and payment details (we store only partial payment information)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Account login credentials</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Purchase history and order information</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Voice Data
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                When you use our voice shopping features, we collect:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Voice commands and queries</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Intent and context information from voice interactions</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Frequency and timing of voice feature usage</span>
                </li>
              </ul>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg text-blue-700 flex items-start">
                <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Important:</strong> We process voice data primarily on your device when possible. Voice commands are sent to our servers only for processing complex requests. We do not permanently store raw voice recordings without explicit consent.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Automatically Collected Information
              </h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                When you access our service, we automatically collect:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Device information (browser type, operating system, device type)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">IP address and location information</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Browsing patterns and interaction with our website</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Referring websites, search terms, and navigation paths</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* How We Use Your Information */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Info className="text-[#FF0076] w-7 h-7 mr-3" />
            <h2 className="text-3xl font-bold text-[#12131A] font-['Quicksand']">
              How We Use Your Information
            </h2>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            We may use the information we collect for various purposes, including:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">To Provide Our Service</h3>
              <p className="text-gray-700">Process transactions, deliver products, send order confirmations, and provide customer support</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">To Personalize Your Experience</h3>
              <p className="text-gray-700">Customize product recommendations, remember your preferences, and provide tailored content</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">To Improve Our Service</h3>
              <p className="text-gray-700">Analyze usage patterns, troubleshoot issues, and enhance voice recognition accuracy</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">To Communicate With You</h3>
              <p className="text-gray-700">Send administrative emails, order updates, marketing communications (with consent), and respond to inquiries</p>
            </div>
            
            <div className="p-4 border-l-4 border-[#FF0076]">
              <h3 className="font-semibold text-[#12131A] mb-1">To Ensure Security</h3>
              <p className="text-gray-700">Protect against fraud, unauthorized transactions, and other potential liabilities</p>
            </div>
          </div>
        </section>
        
        {/* How We Protect Your Information */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Lock className="text-[#FF0076] w-7 h-7 mr-3" />
            <h2 className="text-3xl font-bold text-[#12131A] font-['Quicksand']">
              How We Protect Your Information
            </h2>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            We implement appropriate security measures to protect the security of your personal information including:
          </p>
          
          <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-xl p-8 border border-[#FF0076]/20">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Shield className="text-[#FF0076] w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#12131A] mb-1">Encryption</h3>
                  <p className="text-gray-700">All sensitive data, including payment information and voice commands, is encrypted using industry-standard protocols.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Shield className="text-[#FF0076] w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#12131A] mb-1">Secure Authentication</h3>
                  <p className="text-gray-700">We employ robust authentication mechanisms to verify user identity and protect accounts.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Shield className="text-[#FF0076] w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#12131A] mb-1">Regular Security Audits</h3>
                  <p className="text-gray-700">We conduct regular security assessments and penetration testing to identify and address potential vulnerabilities.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Shield className="text-[#FF0076] w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#12131A] mb-1">Access Controls</h3>
                  <p className="text-gray-700">We limit access to personal information to authorized employees who require it to perform their job functions.</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 flex items-start">
              <AlertCircle className="text-amber-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                While we implement safeguards designed to protect your information, no security system is impenetrable. We cannot guarantee the security of your personal information transmitted to our site.
              </p>
            </div>
          </div>
        </section>
        
        {/* Your Privacy Rights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Your Privacy Rights
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Access and Portability</h3>
              <p className="text-gray-700">You can request a copy of the personal information we hold about you and ask for it to be provided in a structured, commonly used format.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Correction</h3>
              <p className="text-gray-700">You can request that we correct inaccurate or incomplete information about you.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Deletion</h3>
              <p className="text-gray-700">You can ask us to delete your personal information in certain circumstances, subject to legal exceptions.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Objection and Restriction</h3>
              <p className="text-gray-700">You can object to our processing of your information or ask us to restrict processing in certain circumstances.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Consent Withdrawal</h3>
              <p className="text-gray-700">Where we rely on consent as the legal basis for processing, you can withdraw consent at any time.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-[#12131A] mb-3">Complaint</h3>
              <p className="text-gray-700">You have the right to lodge a complaint with a supervisory authority if you believe we have violated your privacy rights.</p>
            </div>
          </div>
        </section>
        
        {/* Contact Us */}
        <section>
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Contact Us About Privacy
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          
          <div className="bg-[#FF0076]/10 p-6 rounded-xl">
            <p className="text-gray-800 font-medium mb-1">VoiceShop Privacy Team</p>
            <p className="text-gray-700">Email: privacy@voiceshop.app</p>
            <p className="text-gray-700">Address: 123 Innovation Drive, San Francisco, CA 94105</p>
            <p className="text-gray-700">Phone: (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
}