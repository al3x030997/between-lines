import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1c1917',        // stone-900
        surface: '#292524',   // stone-800
        border: '#44403c',    // stone-700
        muted: '#a8a29e',     // stone-400
        text: '#fafaf9',      // stone-50
        accent: '#f3d84a',    // brand yellow
        'accent-hover': '#d4aa18', // yellow hover (deeper)
      },
    },
  },
  plugins: [],
}
export default config
