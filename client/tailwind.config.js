/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#101113', // Primary background
          900: '#1B1D20', // Secondary background
          800: '#222326', // Card surface
          700: '#292A2D', // Elevated surface
          600: '#343438', // Border
          500: '#45454B',
        },
        gold: {
          DEFAULT: '#C69B52', // Primary accent
          hover: '#D5AD6C',   // Accent hover
          light: '#E6C687',
          dark: '#936E2B',
        },
        cream: '#E8E2D5',     // Primary text
        parchment: '#A29D94', // Secondary text
        vintage: {
          muted: '#77736C',   // Muted text
          danger: '#8F3939',  // Danger crimson
          success: '#687D60', // Success olive
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'noir': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'noir-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.85)',
        'gold-glow': '0 0 15px rgba(198, 155, 82, 0.25)',
        'cork-pin': '0 3px 6px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
