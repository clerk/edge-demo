module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#ebeffe',
          500: '#476BF2',
          600: '#335bf1',
          700: '#2e52d9',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
