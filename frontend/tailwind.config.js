/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          light: '#25253d',
        },
        accent: {
          DEFAULT: '#e8b86d',
          hover: '#f0c97a',
        },
        axis: {
          DEFAULT: '#3d3d5c',
          highlight: '#5d5d8c',
        },
        bg: {
          deep: '#0f0f1a',
          main: '#16162a',
          card: '#1e1e35',
          elevated: '#2a2a45',
        },
        person: {
          1: '#e8b86d',
          2: '#7eb8da',
          3: '#c490bc',
          4: '#8fd9a8',
          5: '#f0a8a8',
        },
        text: {
          primary: '#f5f5f7',
          secondary: '#a0a0b8',
          muted: '#6d6d85',
        },
        success: '#6dd9a8',
        warning: '#e8b86d',
        error: '#e87d7d',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
