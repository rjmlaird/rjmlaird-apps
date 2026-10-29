# Architecture

## Hosting

Every app is a separate Worker with a Custom Domain `<id>.apps.rjmlaird.co.uk`. The Worker (`worker/index.ts`) serves the Vite build in `dist/` through the `ASSETS` binding, with single-page-app fallback. It handles only `/api/*` (currently `/api/health`). `apps/index` serves `apps.rjmlaird.co.uk` and lists the apps; it never sees app traffic.

## Two app shapes

| Shape             | Apps                                            | How it works                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static HTML app   | AstroDash, Launches, WeatherDash, First Aid Kit | `index.html` contains the markup, CSS and script. Vite copies it to `dist/`. No framework, no `src/`.                                                                                           |
| Tailwind HTML app | Spice Cupboard, Mini Bar                        | Same, plus `pnpm build:assets`: Tailwind CLI builds `public/tailwind.css` (brand preset) and Font Awesome is copied from npm to `public/vendor/fontawesome`. Both are generated and gitignored. |
| React app         | Kinship Notes                                   | Vite + React + TypeScript, Vitest tests.                                                                                                                                                        |

Do not force one shape on all apps; share conventions (brand, metadata, footer), not frameworks.

## Data and privacy

No app has a backend database. User data lives in the browser's `localStorage`:

| App            | Keys                                                                |
| -------------- | ------------------------------------------------------------------- |
| AstroDash      | `astrodash.*`                                                       |
| Mini Bar       | `minibar_inventory_v1`, `minibar_recipes_v1`, `minibar_shopping_v1` |
| Spice Cupboard | `spice_cupboard_data`                                               |
| First Aid Kit  | `first_aid_kits_data_v1`                                            |
| WeatherDash    | `wd-theme` and unit choices                                         |
| Kinship Notes  | notes per source filename; GEDCOM files are never uploaded          |

Changing a storage key or shape loses users' data: version the key and migrate.

## External services (called from the browser)

| App         | Services                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| AstroDash   | Open-Meteo (forecast, air quality), NOAA SWPC, NASA (SDO, SOHO, GIBS), AuroraWatch UK, Leaflet from unpkg |
| WeatherDash | Open-Meteo, RainViewer, CARTO base map                                                                    |
| Launches    | The Space Devs Launch Library 2 (free tier, rate limited)                                                 |
| All         | Google Fonts                                                                                              |

AstroDash still loads Leaflet from unpkg at runtime. Self-hosting it is an open improvement.

## Registry

`apps/index/src/apps.ts` must contain exactly one entry per folder in `apps/`, with `path` only for live apps. `apps.test.ts` enforces this.
