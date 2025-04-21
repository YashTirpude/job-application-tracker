/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },

  plugins: [require("daisyui")],
  daisyui: {
    themes: true,
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",
    darkTheme: "dark",

    themesConfig: {
      excludeComponents: ["radialProgress"],
    },
  },
};
