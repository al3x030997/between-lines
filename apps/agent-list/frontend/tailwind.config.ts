import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#18181b',
        surface: '#27272a',
        border: '#3f3f46',
        muted: '#a1a1aa',
        text: '#fafafa',
        accent: '#f3d84a',
        'accent-hover': '#d4aa18',
      },
    },
  },
  plugins: [],
}
export default config
