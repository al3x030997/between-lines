import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#18181b',        // zinc-900
        surface: '#27272a',   // zinc-800
        border: '#3f3f46',    // zinc-700
        muted: '#a1a1aa',     // zinc-400
        text: '#fafafa',      // zinc-50
        accent: '#f3d84a',    // brand yellow
        'accent-hover': '#d4aa18', // yellow hover (deeper)
      },
    },
  },
  plugins: [],
}
export default config
