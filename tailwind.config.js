/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'filled': '#ffffff',
        'unfilled-bg': 'transparent',
        'unfilled-text': '#ffffff',
        'unfilled-border': '#000000',
      },
      backgroundImage: theme => ({
        'background': "url('/images/background.png')",
      })
    }
  },
  variants: {
    scrollbar: ['rounded']
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("@tailwindcss/forms")({
      strategy: 'class'
    })
  ],
}
