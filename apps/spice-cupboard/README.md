# Spice Cupboard

Track the spices you have, then see which spice mixes you can make now or are one ingredient short of, with batch scaling.

**Live:** https://spice-cupboard.apps.rjmlaird.co.uk · **Part of** [rjmlaird.co.uk apps](https://apps.rjmlaird.co.uk)

## Views

My Cupboard (inventory) and Mixes (recipes and scaling).

## Data

Stored in the browser under `spice_cupboard_data`. No server, no account.

## Build

`pnpm build` first runs `build:assets`: Tailwind CLI (brand preset in `tailwind.config.cjs`) writes `public/tailwind.css`, and Font Awesome is copied from npm to `public/vendor/fontawesome`. Both are generated and gitignored.

## Commands

```sh
pnpm --filter spice-cupboard dev       # builds assets, then vite dev server
pnpm --filter spice-cupboard build     # production build into dist/
pnpm --filter spice-cupboard cf:dev    # wrangler dev against dist/ (build first)
pnpm --filter spice-cupboard deploy    # build + wrangler deploy
```

## Branding

Uses `/brand.css` (generated; run `pnpm brand:sync` from the repo root). See [docs/branding.md](../../docs/branding.md).
