# VoiceShop - The Future of Voice Commerce

[![Netlify Status](https://api.netlify.com/api/v1/badges/b0e06502-05e3-4f25-b6b7-a5d1a0f25493/deploy-status)](https://voiceshop.netlify.app)

## 🎙️ Live Demo

Try the application here: [https://voiceshop.netlify.app](https://voiceshop.netlify.app)

## 📋 Overview

VoiceShop is a revolutionary e-commerce platform that allows users to browse products, add items to cart, and complete purchases entirely through voice commands. This hands-free shopping experience makes online shopping more accessible, convenient, and efficient.

## ✨ Key Features

- **Voice-Powered Shopping**: Complete your entire shopping journey using just your voice
- **Natural Language Understanding**: Speak naturally and the app understands your intent
- **Voice Command Navigation**: Move between sections and pages with simple voice instructions
- **Smart Product Search**: Find products by name, category, rating, or features
- **Position-Based Selection**: Add products to cart by position ("add the first item")
- **Voice-Guided Checkout**: Select shipping addresses and payment methods through voice
- **Responsive Design**: Works beautifully on all devices from desktop to mobile
- **User Account Management**: Save addresses, payment methods, and order history
- **Advanced Product Catalog**: Detailed product information with variants and attributes

## 🗣️ Example Voice Commands

- "Show me running shoes"
- "Add the first product to my cart"
- "Browse electronics"
- "Add iPhone 15 Pro to cart"
- "Go to checkout"
- "Use address 1"
- "Use card 2"
- "Place my order"

## 🛠️ Technologies Used

- **Frontend Framework**: React.js with TypeScript
- **State Management**: React Context API and Custom Hooks
- **Styling**: Tailwind CSS for responsive design
- **Voice Recognition**: Web Speech API with advanced NLP
- **Backend**: Supabase for authentication, database, and edge functions
- **Payments**: Stripe integration for secure checkout
- **Deployment**: Netlify

## 🔧 Project Setup

### Prerequisites

- Node.js (v16 or later)
- Supabase account
- Stripe account (for payments)
- ElevenLabs API key (optional, for enhanced voice)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/voice-shop.git
   cd voice-shop
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## 📱 Usage

1. Click the microphone button in the bottom right corner
2. Speak your command clearly
3. The app will process your command and execute the appropriate action
4. For checkout, use test card number 4242 4242 4242 4242 with any future date and CVC

## 🌟 Future Enhancements

- Multi-language support for voice commands
- Voice biometrics for user authentication
- AR/VR integration for immersive shopping experiences
- Offline voice processing capabilities
- Enhanced voice customization options

## 📖 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

Built with ❤️ for the Bolt.new Hackathon 2025.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the powerful backend platform
- [ElevenLabs](https://elevenlabs.io/) for advanced voice synthesis
- [Pexels](https://www.pexels.com/) for beautiful product images
- [Tailwind CSS](https://tailwindcss.com/) for the responsive design framework
- [Netlify](https://www.netlify.com/) for hosting and deployment
- [Bolt.new](https://bolt.new/) for the incredible development platform