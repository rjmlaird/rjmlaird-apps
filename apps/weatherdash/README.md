# WeatherDash

Forecast, radar, air quality and pollen for any place you search for, with metric or imperial units and a dark or light theme.

**Live:** https://weatherdash.apps.rjmlaird.co.uk · **Part of** [rjmlaird.co.uk apps](https://apps.rjmlaird.co.uk)

## Data

- Services: Open-Meteo (forecast, air quality; CC BY 4.0), RainViewer radar, CARTO / OpenStreetMap base map.
- Stored in the browser: theme (`wd-theme`) and unit choices.
- Pollen covers Europe in season; air quality and pollen are modelled forecasts, not medical advice.

## Deployment note

The Worker is named `weather` in `wrangler.jsonc`. Changing it creates a new Worker.

## Commands

```sh
pnpm --filter weatherdash dev       # vite dev server
pnpm --filter weatherdash build     # production build into dist/
pnpm --filter weatherdash cf:dev    # wrangler dev against dist/ (build first)
pnpm --filter weatherdash deploy    # build + wrangler deploy
```

## Branding

Uses `/brand.css` (generated; run `pnpm brand:sync` from the repo root). See [docs/branding.md](../../docs/branding.md).
