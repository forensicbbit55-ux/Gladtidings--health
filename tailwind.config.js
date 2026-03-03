/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,mdx}',
    './src/components/**/*.{js,jsx,mdx}',
    './src/app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        primary: '#1B4332',
        secondary: '#2D6A4F',
        accent: '#D4A373',
        gold: '#FFD700',
        'gold-light': '#FFED4E',
        'gold-dark': '#CCAC00',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gold-gradient-light': 'linear-gradient(135deg, #FFED4E 0%, #FFD700 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(27, 67, 50, 0.9) 0%, rgba(45, 106, 79, 0.8) 50%, rgba(212, 163, 115, 0.7) 100%)',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'extrabold': 800,
        'black': 900,
      },
      lineHeight: {
        'relaxed': 1.75,
        'extra-relaxed': 2,
      },
    },
  },
  plugins: [],
}
