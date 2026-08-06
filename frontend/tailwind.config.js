/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFDFB',
        text: '#312921',
        accent: '#FF5C00',
        'accent-dark': '#D44D00',
        secondary: '#FFF1E8',
        border: '#EAEAEA',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'serif'],
      }
    },
  },
  plugins: [],
}
