# AstroDash

An observing dashboard for a chosen location (default: Leicester). Works in dark, light (follows the OS) and a red night-vision mode.

**Live:** https://astrodash.apps.rjmlaird.co.uk · **Part of** [rjmlaird.co.uk apps](https://apps.rjmlaird.co.uk)

## Views

Tonight, Sky view, Targets, Planner, Astrophotography, Sun/Moon/planets, Planets, Meteors, Conditions, Aurora, Solar, Scope & field of view, Dark sky, Weather and Kit. A session report can be generated from the header.

## Data

- Settings and saved choices: `localStorage` keys starting `astrodash.`.
- Services: Open-Meteo, NOAA SWPC, NASA (SDO, SOHO, GIBS), AuroraWatch UK, Leaflet (unpkg). Embedded catalogue data lives in `index.html`.

## Notes

- Single 490 KB HTML file; edit CSS near the top and script near the bottom.
- Chart colours (`--c1`–`--c8`, `--t-*`) are deliberate data palettes, not brand roles. Night vision overrides every colour on purpose.

## Commands

```sh
pnpm --filter astrodash dev       # vite dev server
pnpm --filter astrodash build     # production build into dist/
pnpm --filter astrodash cf:dev    # wrangler dev against dist/ (build first)
pnpm --filter astrodash deploy    # build + wrangler deploy
```

## Branding

Uses `/brand.css` (generated; run `pnpm brand:sync` from the repo root). See [docs/branding.md](../../docs/branding.md).
