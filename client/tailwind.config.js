/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      card: 'var(--card)',
      button: 'var(--button)',
      input: 'var(--input)',
    },
  },
  plugins: [],
};
