/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Audio node type colors
        oscillator: '#ff1744',
        gain: '#00e5ff',
        filter: '#2979f0',
        envelope: '#ffea00',
        delay: '#ab47bc',
        noise: '#4caf50',
        lfo: '#ff9800',
        mix: '#9c27b0',
        output: '#f50057',
        // UI colors
        dark: '#1a1a2e',
        darker: '#16213e',
      },
      spacing: {
        'nodePadding': '12px',
      },
    },
  },
  plugins: [],
}
