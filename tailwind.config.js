/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./tools/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        negi: "#65c155",
        accent: "#4ADE80"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
}
