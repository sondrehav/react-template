/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,tsx,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C404B",
          light: "#F3F3F5"
        },
        secondary: {
          DEFAULT: '#007C89',
          light: "#00BFD4"
        },
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
        gray: {
          50:"#f7f7fa",
          100:"#F3F3F5",
          200:"#E7E7EA",
          300:"#D0CED6",
          400:"#adabb3",
          500:"#8E8C89",
          600:"#676563",
          700:"#535250",
          800:"#3b3a38",
          900:"#2D2C2B",
          950:"#121211",
        }
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
        '3xl': '1.75rem',
        '4xl': '2.225rem',
        '5xl': '2.5rem',
      },
      screens: {
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
};
