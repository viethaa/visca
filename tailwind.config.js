/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: '',
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    extend: {
      colors: {
        // Band-aware tokens: values switch inside .band-dark / .band-void
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        jade: 'rgb(var(--jade) / <alpha-value>)',
        // Fixed palette
        abyss: '#222f30',
        bone: '#f7f7f5',
        signal: '#cef79e',
      },
      maxWidth: {
        prose: '64ch',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        // Headline words slide up from behind a mask
        word: {
          from: { transform: 'translateY(105%)' },
          to: { transform: 'none' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        rise: 'rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        word: 'word 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
