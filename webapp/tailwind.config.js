/** @type {import('tailwindcss').Config} */

const primaryHue = 220;
const secondaryHue = primaryHue + 180;
const lightness = {
  950: { l: 0.170, s: 0.999 },
  900: { l: 0.278, s: 0.997 },
  800: { l: 0.421, s: 0.993 },
  700: { l: 0.578, s: 0.982 },
  600: { l: 0.721, s: 0.952 },
  500: { l: 0.829, s: 0.880 },
  400: { l: 0.901, s: 0.731 },
  300: { l: 0.945, s: 0.500 },
  200: { l: 0.970, s: 0.268 },
  100: { l: 0.984, s: 0.119 },
  50:  { l: 0.991, s: 0.047 },
};

const generateColors = ({ hue = 0, saturation = 1, defaults = [] }) => {
  const values = Object.entries(lightness).reduce((a, [key, value]) => ({...a, [key]: `hsl(${hue}, ${value.s * 100 * saturation}%, ${value.l * 100}%)`}), {});
  return {
    ...values,
    ...defaults.reduce((a, [key, value]) => ({...a, [key]: values[value] }), {})
  }
}

const primary = generateColors({ hue: primaryHue, saturation: 0.8, defaults: [ ["DEFAULT", 700], ["dark", 900 ], ["light", 100 ] ]});
const secondary = generateColors({ hue: secondaryHue, saturation: 1.5, defaults: [ ["DEFAULT", 700], ["light", 800] ]});
const gray = generateColors({ hue: primaryHue, saturation: 0.2 });

module.exports = {
    darkMode: ['class'],
    content: ['./app/**/*.{html,tsx,ts}'],
  theme: {
  	extend: {
  		colors: {
  			alert: {
  				DEFAULT: '#DD2E21',
  				light: '#F4B9B5'
  			},
  			success: {
  				DEFAULT: '#50b793',
  				light: '#c8e8dd'
  			},
  			warning: {
  				DEFAULT: '#b79050',
  				light: '#e0bb7e'
  			},
			gray,
			primary,
			secondary,
  		},
  		height: {
  			screen: '100dvh'
  		},
  		width: {
  			screen: '100dvw'
  		},
  		minHeight: {
  			screen: '100dvh'
  		},
  		minWidth: {
  			screen: '100dvw'
  		},
  		fontFamily: {
  			sans: ["Lexend"]
  		},
  		fontSize: {
  			sm: '0.8rem',
  			base: '0.875rem',
  			lg: '1.0rem',
  			xl: '1.125rem',
  			'2xl': '1.25rem',
  			'3xl': '1.5rem',
  			'4xl': '1.75rem',
  			'5xl': '2.225rem'
  		},
  		screens: {
  			'3xl': '1600px'
  		},
  		borderRadius: {
  			none: '0',
  			sm: 'calc(var(--radius) - 4px)',
  			DEFAULT: '0.5rem',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			full: '9999px'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
