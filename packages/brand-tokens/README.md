# @rjmlaird/brand-tokens

Canonical design tokens and shared helpers for every app on `apps.rjmlaird.co.uk`.
Dark theme only. A light theme needs its own contrast-tested values.

`src/tokens.ts` is the single source of truth. CSS, icons and the reference page are generated from it.

## Use it

Workers and other TypeScript apps:

```ts
import { headTags, productFavicon, tokensCss, fontImportCss } from "@rjmlaird/brand-tokens";
```

Static or Vite apps can link the generated stylesheet instead: `@rjmlaird/brand-tokens/brand.css`
(tokens plus `rj-` prefixed primitives, nothing that restyles bare elements).

| Export | Purpose |
|---|---|
| `palette`, `semantic`, `resolve(role)` | Colour values and semantic roles (`--color-primary`, `--color-danger`, ...) |
| `tokensCss()`, `fontImportCss`, `primitivesCss`, `brandCss()` | CSS strings for Workers |
| `headTags(meta)`, `pageTitle(name)`, `validateMeta(meta)` | Title, description, theme colour, favicon and Open Graph convention |
| `productFavicon(id)`, `hasProductIcon(id)` | Per-product icon on the shared tile convention |
| `contrastRatio(a, b)`, `AA` | WCAG contrast helpers |
| `referencePage()` | Self-contained reference page, served at `/brand` on the apps index |

## Commands

```sh
pnpm --filter @rjmlaird/brand-tokens generate   # write css/brand.css and icons/*.svg
pnpm --filter @rjmlaird/brand-tokens check      # fail if generated files are stale
pnpm --filter @rjmlaird/brand-tokens test
```

## Adding an app

Add a glyph for its folder name in `src/icons.ts`, run `generate`, and copy `icons/<id>.svg` to the app's `public/favicon.svg`.
The apps index test fails until the glyph exists.

## Proposed, not approved

`--color-border-strong` (control boundaries at 3:1), the spacing scale, the semantic role assignments and the `tealHover` value (carried over from the old index) are not in the supplied `global.css`.
