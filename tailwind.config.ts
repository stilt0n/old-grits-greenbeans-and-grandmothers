import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        allison: ['Allison', 'cursive'],
        'site-logo': ['Fredericka the Great', 'system-ui', 'cursive'],
        'site-text': ['Lato', 'sans-serif'],
        'site-heading': ['Playfair Display Variable', 'sans-serif'],
      },
      colors: {
        'site-blue-lightest': '#8CB6D0',
        'site-blue-light': '#6FB4DF',
        'site-blue-basic': '#3C84B1',
        'site-blue-bold': '#446D86',
        'site-blue-dark': '#292F33',
        'site-blue-darkest': '#21282E',
      },
    },
  },
  plugins: [],
} satisfies Config;
