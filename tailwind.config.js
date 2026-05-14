/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FDF0F5', // warm pastel rose background
          secondary: '#F9E4EF', // slightly deeper for secondary surfaces
          card: '#FFFFFF', // pure white for image cards
        },
        // pink.soft = main text — deep wine, high contrast on rose bg
        pink: {
          soft: '#4A1030',
          mid: '#C2185B', // lesbian flag rose
          bright: '#E64A19', // lesbian flag orange-red
        },
        // purple = secondary accents — raspberry/magenta (flag)
        purple: {
          soft: '#7B1F4A',
          mid: '#880E4F',
          bright: '#BF360C',
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
