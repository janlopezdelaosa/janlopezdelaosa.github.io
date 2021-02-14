module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        13: "3.25rem",
      },
      borderWidth: {
        3: "3px",
      },
      gridTemplateRows: {
        12: "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ["hover"],
    },
  },
  plugins: [],
};
