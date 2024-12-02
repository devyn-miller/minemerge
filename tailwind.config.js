/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'sans': ['Roboto Mono', 'monospace'],
      'alt-sans': ['Space Mono', 'monospace'],
      'pixel': ['Press Start 2P', 'cursive'],
      'heading': ['Press Start 2P', 'cursive'],
    },
    extend: {},
  },
  plugins: [],
};
