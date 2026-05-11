const config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0edff',
          100: '#e0d9ff',
          200: '#c4b4ff',
          300: '#a58cff',
          400: '#8a66ff',
          500: '#5D3FD3',
          600: '#4c31b8',
          700: '#3b259c',
          800: '#2a1880',
          900: '#1D1F33',
          950: '#13152a',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)',  'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)',  'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.25s ease both',
        'scale-in':   'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
        'skeleton':   'skeleton 1.6s ease-in-out infinite',
        'spin-slow':  'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity:'0', transform:'translateY(18px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:'0' }, to: { opacity:'1' } },
        scaleIn:  { from: { opacity:'0', transform:'scale(0.88)' }, to: { opacity:'1', transform:'scale(1)' } },
        skeleton: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config
