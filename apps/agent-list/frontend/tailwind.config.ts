import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1c1917',
        surface: '#292524',
        border: '#44403c',
        muted: '#a8a29e',
        text: '#fafaf9',
        accent: '#f3d84a',
        'accent-hover': '#d4aa18',
      },
    },
  },
  plugins: [],
}
export default config
