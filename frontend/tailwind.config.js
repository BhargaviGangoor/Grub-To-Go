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
        brand: {
          DEFAULT: "#1d3a2b", // Forest Green primary
          light: "#2a543e",
          orange: "#e59b27",  // Accent yellow/orange
          orangelight: "#f5a623",
          cream: "#f4f1ea",   // Base background cream
          creamdarks: "#e9e5da",
          dark: "#14281e",
        },
        cyber: {
          darkbg: "#1c140f",
          card: "#faf8f0",
          border: "rgba(184, 144, 94, 0.4)",
          accent: "#2d5c38",
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      }
    },
  },
  plugins: [],
}
