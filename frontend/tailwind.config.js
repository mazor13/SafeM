/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'matrix-blue': '#0E1A35',
        'electric-cyan': '#00D8FF',
        'accent-orange': '#FF8A00',
        'graphite-gray': '#1C2435',
        'light-gray': '#A9B3C1',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
