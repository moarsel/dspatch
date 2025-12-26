/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dieter Rams-inspired palette
        // TODO a lot of this is not being picked up or used properly
        surface: {
          DEFAULT: '#1c1c1e',      // Main background
          raised: '#2c2c2e',       // Cards, elevated surfaces
          overlay: '#3a3a3c',      // Hover states, borders
          subtle: '#f200deff',       // Subtle borders
        },
        text: {
          primary: '#f5f5f7',      // Main text
          secondary: '#cdcdd1ff',    // Labels, hints
          muted: '#a6a6ceff',        // Disabled, very subtle
        },
        accent: {
          DEFAULT: '#ff6b35',      // Warm orange - primary accent (Braun-inspired)
          muted: '#cc5429',        // Darker accent
          subtle: 'rgba(255, 107, 53, 0.15)', // Background tint
        },
        // Functional node colors - desaturated, professional
        node: {
          source: '#525252',       // Oscillator, Noise - sources
          process: '#404040',      // Gain, Filter, Mix - processors
          modulation: '#4a4a4a',   // LFO, Envelope - modulators
          utility: '#3d3d3d',      // Math, Compare - utilities
          io: '#333333',           // Output, Meter - I/O
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xxs': '0.625rem',        // 10px - for tiny labels
      },
      spacing: {
        'nodePadding': '8px',
      },
      boxShadow: {
        'node': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'node-selected': '0 0 0 2px rgba(255, 107, 53, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'node': '6px',
      },
    },
  },
  plugins: [],
}
