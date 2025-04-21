module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add this 👇
    'postcss-calc': {
      warnWhenCannotResolve: false,
      preserve: true, // Keeps unresolvable values like `infinity` untouched
    },
  },
};