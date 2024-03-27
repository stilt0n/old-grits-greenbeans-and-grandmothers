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
    },
  },
  plugins: [],
} satisfies Config;
