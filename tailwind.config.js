/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          elevated2: 'var(--bg-elevated-2)',
          hover: 'var(--bg-hover)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        tx: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          quaternary: 'var(--text-quaternary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          text: 'var(--accent-text)',
          signature: 'var(--accent-signature)',
        },
        severity: {
          critical: 'var(--severity-critical)',
          'critical-bg': 'var(--severity-critical-bg)',
          'critical-border': 'var(--severity-critical-border)',
          high: 'var(--severity-high)',
          'high-bg': 'var(--severity-high-bg)',
          'high-border': 'var(--severity-high-border)',
          medium: 'var(--severity-medium)',
          'medium-bg': 'var(--severity-medium-bg)',
          'medium-border': 'var(--severity-medium-border)',
          low: 'var(--severity-low)',
          'low-bg': 'var(--severity-low-bg)',
          'low-border': 'var(--severity-low-border)',
          success: 'var(--severity-success)',
          'success-bg': 'var(--severity-success-bg)',
        }
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'draw-line': 'draw 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        draw: { '0%': { strokeDashoffset: '100' }, '100%': { strokeDashoffset: '0' } }
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
