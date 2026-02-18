/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette CMR Sports Hub
        dark:    '#0a100d',
        deep:    '#0e1a12',
        card:    '#162218',
        border:  '#1e3224',
        hover:   '#1e3228',
        green: {
          mid:  '#1a4a2e',
          muted:'#7a9c80',
          dim:  '#4a6e52',
        },
        cmr: {
          yellow: '#f5c518',
          yellow2:'#e6b800',
          red:    '#c0392b',
          live:   '#e74c3c',
          green:  '#009a44',
          flag_r: '#ce1126',
          flag_y: '#fcd116',
        },
      },
      fontFamily: {
        bebas:  ['var(--font-bebas)', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
      },
      animation: {
        'pulse-live': 'pulse-live 2s infinite',
        'blink':      'blink 1s infinite',
        'fade-up':    'fade-up 0.6s ease both',
        'slide-in':   'slide-in 0.4s ease both',
      },
      keyframes: {
        'pulse-live': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(192,57,43,.5)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(192,57,43,0)' },
        },
        'blink':    { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        'fade-up':  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'slide-in': { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
