import type {Config} from 'tailwindcss';
import {fontFamily} from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1200px'
      }
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#82d4bb',
          light: '#a8e9d1',
          dark: '#419a84'
        },
        accent: {
          DEFAULT: '#fdca40',
          light: '#ffe28a'
        },
        charcoal: '#171717',
        blush: '#d5cac6'
      },
      fontFamily: {
        sans: ['"Cairo"', '"Inter"', ...fontFamily.sans]
      },
      boxShadow: {
        floating: '0 20px 45px -20px rgba(130, 212, 187, 0.35)'
      },
      keyframes: {
        'fade-in': {
          '0%': {opacity: '0', transform: 'translateY(8px)'},
          '100%': {opacity: '1', transform: 'translateY(0)'}
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease both'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
