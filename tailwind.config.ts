import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: "class",
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['var(--font-urbanist)', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* 100vh is a fallback for Opera, IE and etc. */
        '.h-full-screen': {
          height: ['100vh', '100dvh'],
        },
        '.min-h-full-screen': {
          minHeight: ['100vh', '100dvh'],
        },
      });
    }),
  ],
};

export default config;
