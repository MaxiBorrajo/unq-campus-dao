/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unq: {
          bordo: '#7a1827',
          'bordo-dark': '#5e101c',
          'bordo-light': '#932233',
          gray: '#555555',
          'gray-light': '#f4f4f4',
          'gray-border': '#dedede',
          accent: '#b82036',
          gold: '#c29b38'
        }
      },
      fontFamily: {
        sans: ['"Raleway"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
