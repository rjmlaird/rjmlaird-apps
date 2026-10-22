# Plan 03 — WeatherDash (`apps/weatherdash`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | `in-progress` (updated 2026-10-11) |
| Route | `weatherdash.apps.rjmlaird.co.uk` |
| Dev ports | Vite default |
| Stack | Single 38 KB `index.html` (vanilla JS/CSS), Google Fonts, Open-Meteo APIs, RainViewer, Carto basemap tiles; unused Vite/React scaffold |
| Priority | P1 |
| Total effort | ≈ 6–8 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
Show current conditions and forecasts for a chosen location, with air quality and a radar/regional map. Users are anyone wanting a quick, clean forecast with metric/imperial and light/dark options.

## 2. Current state (evidence)
- Features visible in the markup: place search (geocoding), Dark/Light toggle (`aria-pressed`), Metric/Imperial buttons, current conditions, "Next 24 hours", "Radar and regional map" with a Play control, retry/error panel.
- Data: Open-Meteo forecast, geocoding and air-quality endpoints; RainViewer radar; Carto basemap tiles; a CC licence reference in the page.
- Design notes in the CSS say the tokens "match AstroDash".
- Accessibility signals: 39 ARIA/role occurrences, reduced-motion and colour-scheme handling, `viewport-fit=cover`.
- 13 `innerHTML` assignments; `localStorage` used (2 references); one `fetch` helper with `AbortController`.
- Package config mismatches: `package.json` name `astrodash`, wrangler name `weather`; a `deploy` script exists; no tests.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Third-party terms: Open-Meteo free tier terms (including any non-commercial limits), RainViewer and Carto usage/attribution need confirming | High |
| No tests for unit conversion, weather-code mapping or API parsing | Med |
| Geocoding results and API strings rendered via `innerHTML` | Med |
| Google Fonts as a runtime third-party request | Low |
| Naming mismatches (package vs wrangler) | Low |

## 4. Scope
**In:** correctness, attribution, error handling, tests, accessibility polish, shared tokens/API client with AstroDash.
**Out:** severe-weather warning feeds, accounts, multi-location sync.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Fix package/wrangler names (`@rjmlaird/weatherdash`, Worker `weatherdash`)
- [ ] (S) Record each data source's terms and required attribution in the README; show attribution in the footer and on the map
- [ ] (S) Add README (features, units, storage keys)

**M1 — Ship**
- [ ] (M) Extract pure functions (unit conversion, weather-code → label/icon, wind direction, time formatting) into modules with unit tests
- [ ] (M) Escape all dynamic strings; fixture tests for odd place names
- [ ] (S) Standard error states: offline, API 4xx/5xx, no results; retry button wired
- [ ] (S) Registry → `active`

**M2 — Harden**
- [ ] (M) Accessibility audit: radar controls, chart text alternatives, live-region updates when location/units change
- [ ] (S) Self-host fonts or use system fonts; page-weight check
- [ ] (M) Optional Worker `/api/*` cache for forecast calls (short TTL) to reduce upstream traffic
- [ ] (S) Remember last location and units in `localStorage` with failure handling

**M3 — Extend**
- [ ] (M) Saved locations (up to N) with export/import
- [ ] (M) Optional geolocation button (user-initiated)
- [ ] (S) Shared `packages/open-meteo-client` with AstroDash

## 6. Technical approach
One small API client (typed responses, timeouts, abort on new search) used for forecast, air quality and geocoding; presentation reads from a normalised view-model. Keep unit toggling a pure transform of metric data.

## 7. Quality gates
Definition of Done; golden fixtures for one forecast response in both unit systems.

## 8. Dependencies
Plan 00 (template, naming), plan 02 (shared tokens/client).

## 9. Open decisions
- **D1.** Keep RainViewer radar and Carto tiles? *Recommend keep if terms/attribution are met; otherwise make the map optional.*
- **D2.** Proxy through a Worker or call Open-Meteo directly? *Recommend direct until traffic or terms require a proxy.*

## 10. Success measures
Attribution visible; unit/weather-code tests green; no unescaped dynamic strings; last location persists without breaking when storage is blocked.
