# WeatherDash

Forecast, radar, air quality and pollen for **weatherdash.apps.rjmlaird.co.uk**. No account or API key.

## What it shows

Search for a town or city, then see:

- Current conditions
- The next 24 hours
- A radar and regional map with a play button and time slider
- A 7-day forecast table
- Air quality (5-day)
- Pollen for alder, birch, olive, grass, mugwort and ragweed

Settings: temperature (°C or °F), wind (km/h or mph), precipitation (cm or inches) and distance (km or miles), with Metric and Imperial presets. The theme toggle defaults to your operating-system preference.

## Data

| Source                 | Used for                              |
| ---------------------- | ------------------------------------- |
| Open-Meteo geocoding   | Place search                          |
| Open-Meteo forecast    | Conditions, hourly and daily forecast |
| Open-Meteo air quality | Air quality and pollen (CAMS model)   |
| RainViewer             | Radar frames                          |
| CARTO / OpenStreetMap  | Base map tiles                        |

Pollen covers Europe in season. Air quality and pollen are modelled forecasts, and the pollen level bands (moderate, high, very high) are indicative thresholds in the code, not an official index.

## Data and privacy

`localStorage` holds three keys: `wd-place` (last place), `wd-units` and `wd-theme`. The page loads your saved place on return. Searches go directly from your browser to Open-Meteo.

## Development

Single `index.html`. The React files in `src/` are an unused scaffold.

```sh
pnpm --filter ./apps/weatherdash dev
pnpm --filter ./apps/weatherdash build
pnpm --filter ./apps/weatherdash run cf:dev
pnpm --filter ./apps/weatherdash run deploy
```

## Known issues

- `package.json` is named `astrodash`, which collides with `apps/astrodash`. Rename it to `weatherdash`, and use the `./apps/weatherdash` path filter until then.
- Open-Meteo and RainViewer free tiers are for non-commercial use. Check their terms if the site is monetised.
