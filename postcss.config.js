// Tailwind v4 is handled by @tailwindcss/vite plugin in vite.config.ts.
// Only autoprefixer is needed here as a standalone PostCSS step.
export default {
  plugins: {
    autoprefixer: {},
  },
};
