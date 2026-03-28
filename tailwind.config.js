/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eeebff',
          100: '#e0daff',
          200: '#c5baff',
          300: '#a392ff',
          400: '#866aff',
          500: '#7b68ee', // Primary ClickUp-style purple
          600: '#6a51e6',
          700: '#583fd1',
          800: '#4934af',
          900: '#3d2c8f',
          950: '#241a56',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        surface: {
          50: '#f9f9fb',
          100: '#f2f3f5',
          200: '#e9ebf0',
          300: '#dcdfe4',
          800: '#2a2e34',
          900: '#1e2124',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sidebar': '4px 0 24px rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
}