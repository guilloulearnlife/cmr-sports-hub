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
        // Backgrounds
        'bg-primary': '#050a07',
        'bg-elevated': '#0a1410',
        'bg-card': '#0f1c14',
        'bg-card-hover': '#152419',
        'bg-surface': '#1a2e20',
        
        // Legacy support
        dark: '#050a07',
        deep: '#0a1410',
        card: '#0f1c14',
        hover: '#152419',
        
        // Borders
        'border-subtle': 'rgba(245, 197, 24, 0.08)',
        'border-default': 'rgba(245, 197, 24, 0.15)',
        'border-strong': 'rgba(245, 197, 24, 0.3)',
        border: 'rgba(245, 197, 24, 0.1)',
        
        // Glass
        'glass-bg': 'rgba(15, 28, 20, 0.8)',
        'glass-border': 'rgba(245, 197, 24, 0.1)',
        
        // Text
        'text-primary': '#f0f9f4',
        'text-secondary': '#9cb8a4',
        'text-muted': '#5a7a62',
        
        // Green variants
        green: {
          mid: '#1a4a2e',
          muted: '#9cb8a4',
          dim: '#5a7a62',
        },
        
        // CMR Brand
        cmr: {
          gold: '#f5c518',
          'gold-bright': '#ffd700',
          'gold-dim': '#c9a000',
          green: '#009a44',
          red: '#ce1126',
          live: '#e74c3c',
          flag_r: '#ce1126',
          flag_y: '#fcd116',
        },
        'cmr-yellow': '#f5c518',
        'cmr-yellow2': '#c9a000',
        'cmr-red': '#ce1126',
        'cmr-live': '#e74c3c',
        'cmr-green': '#009a44',
        
        // Accents
        'accent-live': '#e74c3c',
        'accent-cyan': '#00d4aa',
        'accent-orange': '#ff6b35',
        'accent-purple': '#7c3aed',
      },
      
      fontFamily: {
        oswald: ['var(--font-oswald)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
        'barlow-condensed': ['var(--font-barlow-condensed)', 'sans-serif'],
      },
      
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slide-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'blink': 'blink 1s ease-in-out infinite',
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'score-pulse': 'score-pulse 2s ease-in-out infinite',
        'glow': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-60px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(60px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'pulse-live': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.6)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 0 12px rgba(231, 76, 60, 0)', transform: 'scale(1.02)' },
        },
        'score-pulse': {
          '0%, 100%': { transform: 'scale(1)', textShadow: '0 0 0 transparent' },
          '50%': { transform: 'scale(1.08)', textShadow: '0 0 40px rgba(231, 76, 60, 0.8)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 197, 24, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 197, 24, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(245, 197, 24, 0.3)',
        'glow-lg': '0 0 40px rgba(245, 197, 24, 0.4)',
        'live': '0 0 30px rgba(231, 76, 60, 0.4)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 197, 24, 0.15) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
