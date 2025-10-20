/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        base: '1.125rem', // 18px instead of 16px
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      spacing: {
        // Optional: slightly larger spacing scale
        4: '1.25rem',
        6: '1.75rem',
        8: '2.5rem',
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
