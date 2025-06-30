/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-magenta': '#FF0076',
        'brand-black': '#12131A',
        'brand-light': '#f0faff',
      },
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
};