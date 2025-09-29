import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#22d3ee',
        dark: '#0f172a',
      },
    },
  },
  plugins: [],
} satisfies Config;


