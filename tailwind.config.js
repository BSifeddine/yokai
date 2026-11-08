/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border-gray-300',
    'border-red-600',
    'border-green-600',
    'border-orange-400',
    'border-purple-500',
    'border-white',
    'border-amber-300',
    'border-cyan-400',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

