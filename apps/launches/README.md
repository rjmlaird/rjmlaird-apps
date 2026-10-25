# Launches

The next ten scheduled rocket launches worldwide, with a countdown to the next one in your local time zone.

**Live:** https://launches.apps.rjmlaird.co.uk · **Part of** [rjmlaird.co.uk apps](https://apps.rjmlaird.co.uk)

## Data

- Source: [The Space Devs Launch Library 2](https://thespacedevs.com/llapi), anonymous access, rate limited, so the page refreshes sparingly and only on demand.
- Nothing is stored.

## Notes

- Status chips pair colour with a border style and a text label.
- `FIX-NOTES.md` records an earlier duplicate-declaration fix.

## Commands

```sh
pnpm --filter launches dev       # vite dev server
pnpm --filter launches build     # production build into dist/
pnpm --filter launches cf:dev    # wrangler dev against dist/ (build first)
pnpm --filter launches deploy    # build + wrangler deploy
```

## Branding

Uses `/brand.css` (generated; run `pnpm brand:sync` from the repo root). See [docs/branding.md](../../docs/branding.md).
