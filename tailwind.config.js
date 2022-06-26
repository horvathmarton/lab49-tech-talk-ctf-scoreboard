/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug", "app.js"],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["forest"],
  },
};
