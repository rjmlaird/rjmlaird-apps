/** Tailwind is built locally (pnpm build:css). Colours, fonts and radii come from the shared brand preset. */
module.exports = {
  presets: [require('@rjmlaird/brand-tokens/tailwind-preset')],
  content: ['./index.html'],
};
