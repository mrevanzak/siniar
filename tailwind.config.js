const colors = require('./src/components/ui/colors');
const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        manrope: platformSelect({
          ios: 'Manrope',
          android: 'Manrope_400Regular',
        }),
      },
      colors,
    },
  },
  plugins: [],
};
