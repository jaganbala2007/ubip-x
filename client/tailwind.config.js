/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#111827',
          950: '#070b14',
        },
        ubip: {
          950: 'rgb(var(--ubip-950) / <alpha-value>)',
          900: 'rgb(var(--ubip-900) / <alpha-value>)',
          850: 'rgb(var(--ubip-850) / <alpha-value>)',
          800: 'rgb(var(--ubip-800) / <alpha-value>)',
          700: 'rgb(var(--ubip-700) / <alpha-value>)',
          600: 'rgb(var(--ubip-600) / <alpha-value>)',
          accent: '#3b82f6',
          neon: '#60a5fa',
          cyan: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          purple: '#8b5cf6',
          saffron: '#f97316'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
