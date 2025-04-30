import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      }, 
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ultramarine: {
          50: '#f0f3ff',
          100: '#e4e8ff',
          200: '#ccd4ff',
          300: '#a4b0ff',
          400: '#707bff',
          500: '#373bff',
          600: '#180fff',
          700: '#0500ff',
          800: '#0200da',
          900: '#030099',
          950: '#00057a',
        },
        'black-rock': {
          50: '#e4eeff',
          100: '#cfdfff',
          200: '#a8c3ff',
          300: '#749aff',
          400: '#3e5dff',
          500: '#1323ff',
          600: '#000aff',
          700: '#000aff',
          800: '#0009e4',
          900: '#0001b0',
          950: '#01002e',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
