/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinemaBlack: '#0A0A0A',      // Midnight Black
        glassCard: 'rgba(26, 26, 26, 0.6)',  // Deep Charcoal Translucent
        goldAccent: '#FBBF24',      // Cinematic Gold
        azureAccent: '#38BDF8',     // Soft Azure
        textMain: '#FFFFFF',        // Pure White
        textSub: '#A3A3A3',         // Ash Gray
      },
      boxShadow: {
        'cinema': '0 10px 30px rgba(0, 0, 0, 0.8)',
        'gold-glow': '0 4px 20px rgba(251, 191, 36, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
