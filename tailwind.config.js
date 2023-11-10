/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
      "./node_modules/tw-elements-react/dist/js/**/*.js"
    ],
    theme: {
      extend: {
        fontFamily: {
            'mont': ['Montserrat', 'sans-serif'],
            'poppins': ['Poppins', 'sans-serif'],
          },
      },
      screens: {
        ts: "360px",
        xs: "375px",
        ss: "620px",
        sm: "770px",
        md: "900px",
        lg: "1200px",
        xl: "1700px",
      },
    },
    plugins: [require("tw-elements-react/dist/plugin.cjs")]
  }
  