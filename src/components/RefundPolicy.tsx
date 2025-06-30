import React from 'react';
import { RotateCcw, PackageCheck, Clock, CreditCard, Truck, AlertTriangle, ThumbsUp, Mic } from 'lucide-react';

export function RefundPolicy() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 font-['Quicksand']">
            Refund Policy
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            We want you to be completely satisfied with your purchase. Here's everything you need to know about returns and refunds.
          </p>
          <div className="mt-6 flex items-center">
            <RotateCcw className="w-6 h-6 mr-2" />
            <p className="font-medium">Last Updated: June 25, 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Return Policy Summary */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Return Policy Summary
          </h2>
          
          <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-xl p-6 border border-[#FF0076]/20 mb-6">
            <div className="flex">
              <ThumbsUp className="text-[#FF0076] w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed">
                VoiceShop offers a <span className="font-semibold">30-day money-back guarantee</span> on most products. If you're not satisfied with your purchase for any reason, you can return it within 30 days of delivery for a full refund of the purchase price.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
              <div className="bg-[#FF0076]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-[#FF0076] w-7 h-7" />
              </div>
              <h3 className="font-semibold text-[#12131A] mb-2">30-Day Returns</h3>
              <p className="text-gray-600 text-sm">Return any item within 30 days of receiving your order</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
              <div className="bg-[#FF0076]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-[#FF0076] w-7 h-7" />
              </div>
              <h3 className="font-semibold text-[#12131A] mb-2">Full Refunds</h3>
              <p className="text-gray-600 text-sm">Get 100% of your money back for eligible returns</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
              <div className="bg-[#FF0076]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-[#FF0076] w-7 h-7" />
              </div>
              <h3 className="font-semibold text-[#12131A] mb-2">Free Return Shipping</h3>
              <p className="text-gray-600 text-sm">We cover return shipping costs for defective items</p>
            </div>
          </div>
        </section>
        
        {/* Return Eligibility */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Return Eligibility
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Eligible Items
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To be eligible for a return, your item must be:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">In the same condition that you received it</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Unused and unworn (except to try on clothing or footwear)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">In its original packaging with all tags attached</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Accompanied by the original receipt or proof of purchase</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Non-Returnable Items
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The following items cannot be returned:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700">Gift cards and digital downloads</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700">Personal care items (for health and hygiene reasons)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700">Items that have been customized or personalized for you</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700">Sale items marked as "Final Sale" or "Non-Returnable"</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Return Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Return Process
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            To initiate a return and request a refund, please follow these steps:
          </p>
          
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF0076] rounded-full text-white flex items-center justify-center mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#12131A] mb-2">Contact Customer Service</h3>
                <p className="text-gray-700 leading-relaxed">
                  Reach out to our customer service team through your account page, by email at returns@voiceshop.app, or by voice command ("I need to return an item"). You'll need your order number and the items you wish to return.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF0076] rounded-full text-white flex items-center justify-center mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#12131A] mb-2">Receive Return Authorization</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team will review your request and send you a Return Authorization (RA) number along with return shipping instructions. Some returns may be eligible for voice-initiated processing.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF0076] rounded-full text-white flex items-center justify-center mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[#12131A] mb-2">Package Your Return</h3>
                <p className="text-gray-700 leading-relaxed">
                  Pack the item(s) securely in their original packaging, if possible. Include all parts, accessories, and documentation that came with the product. Attach the return shipping label provided.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF0076] rounded-full text-white flex items-center justify-center mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold text-[#12131A] mb-2">Ship the Return</h3>
                <p className="text-gray-700 leading-relaxed">
                  Drop off your package at the designated shipping carrier. Keep your tracking number for reference. For eligible returns, we offer free return shipping.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FF0076] rounded-full text-white flex items-center justify-center mr-4">
                5
              </div>
              <div>
                <h3 className="font-semibold text-[#12131A] mb-2">Receive Your Refund</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once we receive and inspect the return, we'll process your refund. The funds will be credited back to your original payment method within 5-10 business days, depending on your payment provider.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Refund Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Refund Information
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Refund Timing
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Once we receive your return, we'll inspect it and notify you of the status of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Late or Missing Refunds
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If you haven't received a refund within 10 business days, first check your bank account again. Then contact your credit card company, as it may take some time before your refund is officially posted. Next, contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund, please contact our customer support team.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Damaged or Defective Items
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If you receive a damaged or defective item, please contact us immediately. We'll work with you to provide a replacement or refund. For damaged items, please save all packaging materials and damaged items for inspection by the carrier.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#12131A] mb-3 font-['Quicksand']">
                Exchanges
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We do not currently offer direct exchanges. If you need a different size, color, or product, please return your original purchase for a refund and place a new order for the desired item.
              </p>
            </div>
          </div>
        </section>
        
        {/* Voice-Assisted Returns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Voice-Assisted Returns
          </h2>
          
          <div className="bg-gradient-to-r from-[#FF0076]/5 to-blue-50 rounded-xl p-6 border border-[#FF0076]/20 mb-6">
            <p className="text-gray-700 mb-4 leading-relaxed">
              As part of our innovative voice shopping experience, VoiceShop offers voice-assisted return processing. You can initiate returns by using simple voice commands.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-[#12131A] mb-4 font-['Quicksand']">
              How to Use Voice-Assisted Returns
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF0076]/10 rounded-full flex items-center justify-center mr-3">
                  <Mic className="w-4 h-4 text-[#FF0076]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Say "I need to return an item"</p>
                  <p className="text-gray-600 text-sm">Our voice assistant will guide you through identifying your order and the items you want to return.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF0076]/10 rounded-full flex items-center justify-center mr-3">
                  <Mic className="w-4 h-4 text-[#FF0076]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Explain your return reason</p>
                  <p className="text-gray-600 text-sm">You can say things like "It doesn't fit" or "The item is damaged" to provide return reasons.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF0076]/10 rounded-full flex items-center justify-center mr-3">
                  <PackageCheck className="w-4 h-4 text-[#FF0076]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Confirm and receive instructions</p>
                  <p className="text-gray-600 text-sm">The voice assistant will confirm your return details and email you shipping instructions and a return label.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 p-4 rounded-lg">
              <div className="flex">
                <AlertTriangle className="text-amber-500 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-sm">
                  <strong>Note:</strong> Voice-assisted returns are currently in beta and may not be available for all orders or in all regions. Standard return methods are always available.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
            Contact Us About Returns
          </h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you have any questions about our return policy, please contact us:
          </p>
          
          <div className="bg-[#FF0076]/10 p-6 rounded-xl">
            <p className="text-gray-800 font-medium mb-1">VoiceShop Customer Service</p>
            <p className="text-gray-700">Email: returns@voiceshop.app</p>
            <p className="text-gray-700">Phone: (555) 123-4567</p>
            <p className="text-gray-700 mt-2">Hours of operation: 9 AM - 6 PM EST, Monday through Friday</p>
            <p className="text-gray-700 mt-4 text-sm">Voice command: "I need help with a return" or "Contact customer support"</p>
          </div>
        </section>
      </div>
    </div>
  );
}