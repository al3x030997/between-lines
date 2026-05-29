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
        accent: '#d6336c',
        'accent-hover': '#b91d5c',
      },
    },
  },
  plugins: [],
}
export default config
