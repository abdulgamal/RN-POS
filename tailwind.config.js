/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4D81F1', //"#FE9C42"
        secondary: '#F2F4F7', //"#F8F8F8"
        tertiary: '#1E1E1E', //"#363636"
      },
    },
  },
  plugins: [],
};
