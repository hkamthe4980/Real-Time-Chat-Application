const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
