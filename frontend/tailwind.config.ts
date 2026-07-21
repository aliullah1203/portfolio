import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f4ff',
          100: '#f0e7ff',
          200: '#dcc2ff',
          300: '#b991ff',
          400: '#8f51ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#37175f',
        },
      },
      boxShadow: {
        glow: '0 25px 100px rgba(139,92,246,0.25)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 15% 20%, rgba(167,139,250,0.15), transparent 18%), radial-gradient(circle at 85% 30%, rgba(59,130,246,0.18), transparent 16%), radial-gradient(circle at 50% 90%, rgba(168,85,247,0.1), transparent 20%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
