/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#0b1120',
        'panel-bg': '#141d2e',
        'panel-border': '#1e293b',
        'accent-blue': '#38bdf8',
        'accent-orange': '#f97316',
        'accent-green': '#22c55e',
        'accent-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
