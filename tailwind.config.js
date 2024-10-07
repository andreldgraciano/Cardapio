/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "./assets/**/*.js",
  ],
  theme: {
    fontFamily:{
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('./assets/images/bg.jpg')",
      },
    },
  },
  plugins: [],
}