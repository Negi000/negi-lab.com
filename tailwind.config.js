/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js",
    "./tools/**/*.html"
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
