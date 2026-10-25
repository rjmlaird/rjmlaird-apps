# Branding guide

Source of truth: `packages/brand-tokens/src`, with values taken from the site's `global.css`. Read the package README for the token tables.

## How apps consume it

1. `pnpm brand:sync` writes `brand.css` to every app's `public/` (and `apps/index/src/brand-css.ts`).
2. Each app `<head>` links Google Fonts (Space Grotesk, Inter, JetBrains Mono) and `/brand.css`.
3. App CSS uses `--rj-*` semantic tokens. Local aliases (`--bg`, `--panel`) are fine if they point at `--rj-*`.
4. Tailwind apps use the preset in `packages/brand-tokens/tailwind-preset.cjs`.

Do not copy the site's `global.css` into an app; it contains page-layout rules.

## Required conventions

- **Title** `<Product> · apps.rjmlaird.co.uk`; `lang="en-GB"`; description; `theme-color` `#0B0F1A` (dark) or `#F3F5F8` (light).
- **Icon** its own `public/favicon.svg`: dark rounded square, teal main shape, amber accent.
- **Footer** "Part of rjmlaird.co.uk apps" with links (`.rj-parent`).
- **Type** headings Space Grotesk, text Inter, numbers/ids JetBrains Mono. Body text at least 12px.
- **Radius** `--radius` (6px). **Focus** `--rj-focus`, 3px outline; never remove it.
- **Colour roles** teal primary, amber secondary/warning, sky info, green success, coral danger, violet category. Pair colour with text or shape.
- **Motion** brand.css handles `prefers-reduced-motion`; do not override it.

## Themes

Dark is the default. Light: `<html data-theme="light">`, or `<html data-theme-auto>` to follow the OS (AstroDash). Kinship Notes is light only. AstroDash night-vision (red) and its sky-chart backdrop are documented local exceptions.

## Changing the brand

Edit `packages/brand-tokens/src/*.css` (and the preset), run `pnpm brand:sync`, then `pnpm verify`. The check fails on drift, on legacy colours/fonts/CDNs, and when any token pair drops below 4.5:1 text or 3:1 focus contrast.

## Accessibility status

Token contrast is tested automatically. Page-level checks (keyboard, zoom/reflow, screen reader labels, touch targets) are manual and not yet recorded as passing.
