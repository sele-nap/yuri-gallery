/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FDF0F5',
          secondary: '#F9E4EF',
          card: '#FFFFFF',
        },
        sakura: {
          dark: '#1A0008',
          overlay: '#130810',
          soft: '#4A1030',
          muted: '#9E7080',
          blush: '#F3C9DF',
          pale: '#FCE4EC',
          rose: '#F8BBD9',
          glow: '#F48FB1',
          mid: '#C2185B',
          bright: '#E64A19',
        },
        peach: {
          pale: '#FBE9E7',
          light: '#FFCCBC',
        },
        plum: {
          soft: '#7B1F4A',
          mid: '#880E4F',
          bright: '#BF360C',
        },
        flag: {
          red: '#D52D00',
          salmon: '#FF9A56',
          white: '#FFF0E8',
          purple: '#A50062',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
