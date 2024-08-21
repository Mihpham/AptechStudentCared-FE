/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
  "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
      }
    },
  },
  plugins: [],
}

