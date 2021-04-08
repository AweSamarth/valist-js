const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    mode: 'layers',
    content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  },

  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        teal: colors.teal,
        violet: colors.violet,
        rose: colors.rose,
        blueGray: colors.blueGray,
      }
    }
  },
  variants: {
    display: ['responsive', 'group-hover', 'group-focus'],
  },

  plugins: [
    require('@tailwindcss/ui'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
