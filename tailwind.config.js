/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				bg: {
					primary: '#0d0d14',
					secondary: '#12121e',
					card: '#1a1a2e'
				},
				pink: {
					soft: '#f5d0e0',
					mid: '#e879a0',
					bright: '#ff5fa0'
				},
				purple: {
					soft: '#d4b8f0',
					mid: '#9b5de5',
					bright: '#7c3aed'
				}
			},
			fontFamily: {
				display: ['"Playfair Display"', 'serif'],
				body: ['"Inter"', 'sans-serif']
			},
			animation: {
				'fade-in': 'fadeIn 0.4s ease forwards',
				'slide-up': 'slideUp 0.3s ease forwards',
				shimmer: 'shimmer 1.5s infinite'
			},
			keyframes: {
				fadeIn: {
					from: { opacity: '0', transform: 'scale(0.97)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				slideUp: {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			}
		}
	},
	plugins: []
};
