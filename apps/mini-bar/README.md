# Mini Bar

A home bar inventory and cocktail manager: record what you have and see which drinks you can make now, with batch scaling and a shopping list.

**Live:** https://mini-bar.apps.rjmlaird.co.uk · **Part of** [rjmlaird.co.uk apps](https://apps.rjmlaird.co.uk)

## Views

Can Make (planner), Bar Stock (inventory), Cocktails (recipes) and Shopping.

## Data

Stored in the browser: `minibar_inventory_v1`, `minibar_recipes_v1`, `minibar_shopping_v1`. No server, no account.

## Build

Same as Spice Cupboard: `pnpm build` builds local Tailwind and Font Awesome first (`build:assets`).

## Commands

```sh
pnpm --filter mini-bar dev       # builds assets, then vite dev server
pnpm --filter mini-bar build     # production build into dist/
pnpm --filter mini-bar cf:dev    # wrangler dev against dist/ (build first)
pnpm --filter mini-bar deploy    # build + wrangler deploy
```

## Branding

Uses `/brand.css` (generated; run `pnpm brand:sync` from the repo root). See [docs/branding.md](../../docs/branding.md).
