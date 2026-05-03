/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        hindi: ['Noto Sans Devanagari', 'Hind', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          900: '#701a75',
        },
        surface: {
          900: '#0f0a1e',
          800: '#1a1030',
          700: '#251740',
          600: '#312050',
        },
      },
    },
  },
  plugins: [],
}
