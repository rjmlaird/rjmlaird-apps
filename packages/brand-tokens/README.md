# @rjmlaird/brand-tokens

Canonical brand layer for every app.

- `src/tokens.css` core palette, type roles, layout (names match the site's `global.css`) and the semantic `--rj-*` roles.
- `src/theme-light.css` light overrides of the semantic roles only. Apply with `<html data-theme="light">`, or `<html data-theme-auto>` to follow the OS.
- `src/base.css` focus ring, skip link, reduced motion, `.rj-*` components. No page layout.
- `tailwind-preset.cjs` maps Tailwind's palette onto the brand for utility-class apps.
- `brand.css` generated bundle. `pnpm brand:sync` copies it to each app's `public/brand.css` and `apps/index/src/brand-css.ts`.

## Colour roles

| Role | Token | Use |
| --- | --- | --- |
| Teal | `--rj-primary` | primary actions, active navigation |
| Amber | `--rj-secondary` | highlights, warnings |
| Sky | `--rj-info` | information, data series |
| Green | `--rj-success` | success, complete |
| Coral | `--rj-danger` | errors, destructive |
| Violet | `--rj-category` | secondary categories |

Never rely on colour alone: pair status colours with text or shape. Chart series and domain colours may differ from these roles, but must be documented in the app.

## Rules

- Headings `--font-display` (Space Grotesk), UI text `--font-body` (Inter), values and ids `--font-mono` (JetBrains Mono).
- Standard radius `--radius` (6px). Focus ring `--rj-focus`; do not remove outlines.
- Product icons are per app (`public/favicon.svg`); the parent brand appears in each footer.
- Deliberate exceptions (e.g. AstroDash night-vision red, sky-chart backdrop) stay local and are commented in that app.
- `pnpm brand:check` tests 82 token contrast pairs (4.5:1 text, 3:1 focus). Passing it does not prove WCAG compliance of whole pages.
