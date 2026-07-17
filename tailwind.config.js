/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFBF8',
        dawn: {
          50: '#FFF9F5',
          100: '#FFEFE3',
          200: '#FFDCC4',
        },
        coral: {
          100: '#FFEAE0',
          200: '#FFCCBC',
          500: '#E64A19',
          600: '#BF360C',
        },
        blush: {
          100: '#FCE4EC',
          200: '#F3C9DF',
        },
        rose: {
          200: '#F8BBD9',
          400: '#F48FB1',
          500: '#C2185B',
        },
        mauve: {
          200: '#E9A8CE',
          400: '#7B1F4A',
          600: '#880E4F',
        },
        ink: {
          900: '#1A0008',
          700: '#4A1030',
          400: '#9E7080',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Nunito Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['2.75rem', { lineHeight: '1', letterSpacing: '0.01em' }],
        'display-lg': [
          '1.5rem',
          { lineHeight: '1.2', letterSpacing: '0.01em' },
        ],
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
