import React from 'react';
import { Mic, Users, Award, Globe, Heart, Zap } from 'lucide-react';

export function About() {
  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Voice Support' },
    { number: '500+', label: 'Products' }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      description: 'Visionary leader with 15+ years in e-commerce and AI technology.'
    },
    {
      name: 'David Rodriguez',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Tech expert specializing in voice recognition and machine learning.'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      description: 'UX designer focused on creating accessible and intuitive experiences.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Accessibility First',
      description: 'We believe shopping should be accessible to everyone, regardless of physical abilities or technical skills.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We\'re constantly pushing the boundaries of what\'s possible with voice technology and e-commerce.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our mission is to transform how people shop worldwide, making it more natural and intuitive.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF0076] to-[#FF408A] text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-['Quicksand']">
                About VoiceShop
              </h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
                We're revolutionizing e-commerce by making shopping as natural as having a conversation. 
                Our voice-powered platform breaks down barriers and creates an inclusive shopping experience for everyone.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">Voice-Powered Innovation</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#FF0076] mb-2 font-['Quicksand']">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At VoiceShop, we believe that technology should adapt to humans, not the other way around. 
                Our mission is to create the most natural and accessible shopping experience possible.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're breaking down barriers for people with disabilities, busy parents, multitaskers, 
                and anyone who wants a more intuitive way to shop online. Voice technology isn't just 
                the future—it's the present, and we're leading the way.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-[#FF0076] rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-[#12131A] mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
                alt="Innovation"
                className="rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-[#FF0076]" />
                  <div>
                    <div className="font-bold text-[#12131A]">Best Innovation</div>
                    <div className="text-sm text-gray-600">E-commerce Awards 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#12131A] mb-4 font-['Quicksand']">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse group of innovators, designers, and engineers passionate about 
              creating the future of commerce.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-bold text-[#12131A] mb-2 font-['Quicksand']">
                    {member.name}
                  </h3>
                  <p className="text-[#FF0076] font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="Technology"
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#12131A] mb-6 font-['Quicksand']">
                Cutting-Edge Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform is powered by advanced AI and machine learning algorithms that understand 
                natural language and context. We use state-of-the-art speech recognition technology 
                to ensure accurate voice commands every time.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#FF0076] rounded-full"></div>
                  <span className="text-gray-700">Advanced Natural Language Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#FF0076] rounded-full"></div>
                  <span className="text-gray-700">Real-time Voice Recognition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#FF0076] rounded-full"></div>
                  <span className="text-gray-700">Contextual Understanding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#FF0076] rounded-full"></div>
                  <span className="text-gray-700">Multi-language Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF0076] to-[#FF408A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Quicksand']">
            Join the Voice Revolution
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the future of e-commerce. Experience shopping like never before with VoiceShop.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-[#FF0076] rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <Users className="w-6 h-6 mr-3" />
            Join Our Community
          </button>
        </div>
      </section>
    </div>
  );
}