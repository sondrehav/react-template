/** @type {import('tailwindcss').Config} */

const primaryHue = 220;
const secondaryHue = primaryHue + 180;
const lightness = {
  950: { l: 0.170088525235326,  s: 0.74314718055994  },
  900: { l: 0.278683758374059,  s: 0.691853886172395 },
  800: { l: 0.421407044320478,  s: 0.637786664902119 },
  700: { l: 0.578592955679522,  s: 0.580628251062171 },
  600: { l: 0.721316241625941,  s: 0.520003629245736 },
  500: { l: 0.829911474764674,  s: 0.455465108108164 },
  400: { l: 0.901942789249979,  s: 0.386472236621213 },
  300: { l: 0.94547354958496,   s: 0.312364264467491 },
  200: { l: 0.970315607946413,  s: 0.232321556793955 },
  100: { l: 0.984030873379901,  s: 0.145310179804325 },
  50:  {  l: 0.991464929839659, s: 0.05              },
};

const generateColors = ({ hue = 0, saturation = 1, defaults = [] }) => {
  const values = Object.entries(lightness).reduce((a, [key, value]) => ({...a, [key]: `hsl(${hue}, ${value.s * 100 * saturation}%, ${value.l * 100}%)`}), {});
  return {
    ...values,
    ...defaults.reduce((a, [key, value]) => ({...a, [key]: values[value] }), {})
  }
}

const primary = generateColors({ hue: primaryHue, saturation: 1.25, defaults: [ ["DEFAULT", 700], ["dark", 950 ], ["light", 200 ] ]});
const secondary = generateColors({ hue: secondaryHue, saturation: 1.5, defaults: [ ["DEFAULT", 500], ["light", 200] ]});
const gray = generateColors({ hue: primaryHue, saturation: 0.1 });

module.exports = {
  content: ['./app/**/*.{html,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        alert: {
          DEFAULT: "#DD2E21",
          light: "#F4B9B5"
        },
        success: {
          DEFAULT: "#50b793",
          light: "#c8e8dd",
        },
        warning: {
          DEFAULT: "#b79050",
          light: "#e0bb7e",
        },
        gray,
        primary,
        secondary,
      },
      height: {
        screen: "100dvh",
      },
      width: {
        screen: "100dvw",
      },
      minHeight: {
        screen: "100dvh",
      },
      minWidth: {
        screen: "100dvw",
      },
      fontFamily: {
        sans: ["Lexend"],
      },
      fontSize: {
        sm: '0.8rem',
        base: '0.875rem',
        lg: '1.0rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
        '5xl': '2.225rem',
      },
      screens: {
        '3xl': '1600px',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
};
