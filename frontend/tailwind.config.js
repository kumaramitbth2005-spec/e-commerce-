/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: 'rgb(var(--color-bg-900-rgb) / <alpha-value>)',
          800: 'rgb(var(--color-bg-800-rgb) / <alpha-value>)',
          700: 'rgb(var(--color-bg-700-rgb) / <alpha-value>)',
        },
        primary: {
          DEFAULT: '#ff007a', // Pink
          light: '#ff4da6',
        },
        secondary: {
          DEFAULT: '#00f2ff', // Cyan
          light: '#4dffff',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
