/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#111111',
          hover: '#1a1a1a',
        },
        border: {
          DEFAULT: '#222222',
          light: '#333333',
          lighter: '#444444',
        },
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
        },
        secondary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        success: '#10b981',
        error: '#ef4444',
        muted: '#999999',
      },
    },
  },
  plugins: [],
}