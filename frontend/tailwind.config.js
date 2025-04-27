/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          card: "#1a1b1e",
          hover: "#2c2d31",
          border: "#2e2f34",
        },
        base: {
          100: "#1a1b1e",
          200: "#2c2d31",
          300: "#3e4044",
          content: "#e2e3e7",
        },
        primary: {
          DEFAULT: "#6366f1",
          content: "#ffffff",
        },
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(99, 102, 241, 0.3)",
        "glow-sm": "0 0 10px -3px rgba(99, 102, 241, 0.2)",
      },
    },
  },
  plugins: [require("daisyui")],
};
