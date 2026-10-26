/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f5f1ee',
          100: '#efe5df',
          200: '#d8c6b9',
          300: '#bd9984',
          400: '#9d6f4f',
          500: '#7c4d2d',
          600: '#623d25',
          700: '#3b271c',
          800: '#2b1d18',
          900: '#1d120e'
        },
        ivory: '#f2efe9',
        stone: '#ddd6ce',
        sand: '#d5b898',
        charcoal: '#201b1a'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 30px rgba(29,18,14,0.12)',
        card: '0 8px 16px rgba(30,23,18,0.08)'
      }
    },
  },
  plugins: [],
}
