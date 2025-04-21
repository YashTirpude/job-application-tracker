module.exports = {
  plugins: {
    "postcss-calc": false, // Disable postcss-calc to isolate the issue
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
