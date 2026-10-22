# Plan 02 — AstroDash / Astro Mission Control (`apps/astrodash`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | `in-progress` (updated 2026-10-11) |
| Route | `astrodash.apps.rjmlaird.co.uk` |
| Dev ports | Vite default |
| Stack | Single 495 KB `index.html` (vanilla JS/CSS, Leaflet from unpkg, Google Fonts); unused Vite/React scaffold |
| Priority | P1 |
| Total effort | ≈ 12–16 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
An observing dashboard for amateur astronomers and astrophotographers: what to observe tonight, sky view, planning, conditions, aurora and solar activity, and kit/field-of-view tools.

## 2. Current state (evidence)
- Page title "AstroDash" with an app bar (Location, Theme auto/light/dark, Night vision, Session report) and an ARIA tabs bar of 15 views: Tonight, Sky view, Targets, Planner, Astrophotography, Sun/Moon & planets, Planets, Meteors, Conditions, Aurora, Solar, Scope & field of view, Dark sky, Weather, Kit.
- Data in the page: constants such as `MINOR`, `SITES`, `BORTLE`, `SHOWERS`, `DEFAULT_EQUIP`, `STARV`; one line is ~144 KB (apparently embedded data).
- Live data via `fetch` from NOAA SWPC, NASA DONKI (`api.nasa.gov/DONKI/`), Open-Meteo forecast and air-quality; links to SDO, SOHO, AuroraWatch UK, Clear Outside, Met Office, GFZ Potsdam, RainViewer.
- It tries `fetch('data/minor.json')` to get a fresher minor-planet snapshot, but `apps/astrodash/public/` contains only `favicon.svg` and `icons.svg`, so the file is absent and the baked-in snapshot is used.
- Accessibility signals: 97 ARIA/role occurrences, `prefers-reduced-motion`, `prefers-color-scheme`, a red night-vision mode.
- 97 `innerHTML` assignments; `localStorage` used (3 references); Leaflet loaded from `unpkg.com` (pinned 1.9.4).
- Registry describes it as Python/Streamlit/Skyfield; the folder does not contain that stack. Package has no tests, no deploy script, a stray `src/index.ts`, and the unused template.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| 495 KB single file, 3,000+ lines in one HTML file — hard to test or change safely | High |
| Astronomical calculations (rise/set, planet positions, visibility) have no tests | High |
| 97 `innerHTML` sites need an escaping audit (data comes from third-party APIs) | High |
| Several third-party APIs with different terms, rate limits and failure modes; DONKI key handling unclear | Med |
| `data/minor.json` refresh path does not exist | Med |
| Google Fonts and unpkg Leaflet are third-party runtime requests | Med |
| Two tabs overlap in purpose ("Sun, Moon & planets" vs "Planets") | Low |
| Registry says Python/Streamlit | Med |

## 4. Scope
**In:** make the dashboard maintainable and trustworthy: split into modules, test the astronomy maths, secure rendering, define data refresh and caching, tidy the tabs.
**Out:** native mobile apps, accounts, a full planetarium engine.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Correct registry tech; add README (views, data sources, storage keys)
- [ ] (S) Delete stray `src/index.ts` and unused React deps (or adopt Vite properly — plan 00 D2)
- [ ] (S) Inventory every external call: URL, purpose, terms/rate limit, failure behaviour, key required (esp. DONKI)

**M1 — Ship**
- [ ] (L) Introduce a Vite build with ES modules: move embedded data to `src/data/*.json`, split code into `astro/` (time, sidereal, sun/moon, planets, visibility), `api/` (fetchers), `ui/` (views)
- [ ] (M) Cached `/api/*` proxy in the Worker for SWPC/DONKI/Open-Meteo requests with short TTLs and a keyed secret for DONKI; client falls back gracefully
- [ ] (M) Real `data/minor.json` pipeline: scheduled refresh (Cron Trigger → R2/KV) or build-time script, with snapshot date shown in the UI
- [ ] (S) Registry → `active` once M2's tests pass

**M2 — Harden**
- [ ] (L) Unit tests for time/sidereal, Sun/Moon rise-set, twilight, planet altitude and visibility against reference values (e.g. published almanac examples); share the library with the tools repo's Julian-date work if possible
- [ ] (M) Replace risky `innerHTML` with an escaping template helper or DOM APIs; add tests for hostile strings
- [ ] (M) Self-host fonts and Leaflet (or document exception) and meet the page-weight budget with lazy-loaded views
- [ ] (M) Accessibility audit of tabs, charts (text alternatives), modals and night-vision contrast
- [ ] (S) Loading, empty and error states for each data card with "last updated" times

**M3 — Extend**
- [ ] (M) Offline support via a service worker for the baked-in data
- [ ] (M) Export session report as print-optimised HTML/PDF
- [ ] (M) Equipment profiles import/export
- [ ] (S) Merge or clearly separate the two planets views

## 6. Technical approach
Pure computation modules take `{ time, latitude, longitude }` and return data structures; views only render. All network access goes through one `api` layer with timeouts, caching and typed parsers. Keep user settings (location, equipment, theme) in `localStorage` under a versioned key with try/catch and an export/import option.

## 7. Quality gates
Definition of Done; plus: golden tests for a fixed date/location (e.g. sunrise/sunset, twilight) and snapshot of one API fixture per source.

## 8. Dependencies
Plan 00 (template, CI); plan 03 (shared tokens, Open-Meteo client); optional shared astro package with the tools repo.

## 9. Open decisions
- **D1.** Move to TypeScript + Vite modules now? *Recommend yes; it is the prerequisite for tests.*
- **D2.** Proxy third-party APIs through the Worker? *Recommend yes for DONKI (key) and rate-limited sources; direct for CORS-friendly ones.*
- **D3.** Keep 15 tabs? *Recommend group into 5–6 sections to reduce navigation load.*

## 10. Success measures
Astronomy functions covered by reference-value tests; zero unescaped third-party strings in tests; first-load size within budget; documented data sources with last-updated timestamps.
