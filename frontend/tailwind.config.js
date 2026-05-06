/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: '#22c55e',
        brandDark: '#0f172a',
      }
    },
  },
  plugins: [],
}