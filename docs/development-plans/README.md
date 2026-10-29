# rjmlaird-apps — Draft development plans

Prepared 2026-10-21 from `rjmlaird-apps-main.zip` (110 files). **Status: draft for review.** "Current state" sections come from reading the archive; priorities, effort sizes and "recommend" defaults are proposals. I could not run or deploy the code, so items marked "likely" should be confirmed.

## Same framework as the tools plans

Each plan has ten sections (see `framework/PLAN-TEMPLATE.md`): purpose, current state, gaps and risks, scope, roadmap, technical approach, quality gates, dependencies, open decisions, success measures. Roadmaps use **M0 Unblock → M1 Ship → M2 Harden → M3 Extend**; tasks are sized **S** (≤½ day), **M** (1–2 days), **L** (3–5 days). `framework/DEFINITION-OF-DONE.md` is adapted for single-page apps on custom domains (no runtime CDN build tools, accessible dialogs/tabs, data-source terms, storage safety, escaping).

## Portfolio at a glance

| #   | Plan                                                       | Registry status | Priority | Effort  | Headline                                                                    |
| --- | ---------------------------------------------------------- | --------------- | -------- | ------- | --------------------------------------------------------------------------- |
| 00  | [Platform / monorepo](plans/00-platform-monorepo.md)       | —               | P0       | 6–8 d   | Registry won't compile/test; copy-paste names; unused React scaffold; no CI |
| 01  | [Apps index](plans/01-apps-index.md)                       | —               | P0       | 3 d     | `path?: url` type error; wrong `tech`; `launches` missing                   |
| 02  | [AstroDash](plans/02-astrodash.md)                         | in-progress     | P1       | 12–16 d | 495 KB single file; untested astronomy maths; 97 `innerHTML`                |
| 03  | [WeatherDash](plans/03-weatherdash.md)                     | in-progress     | P1       | 6–8 d   | Third-party terms/attribution; no tests                                     |
| 04  | [Launches](plans/04-launches.md)                           | not listed      | P0       | 3–4 d   | Duplicate `const dateFmt` stops the page script; API called from browser    |
| 05  | [Spice Cupboard](plans/05-spice-cupboard.md)               | active          | P1       | 6–8 d   | Tailwind Play CDN; no ARIA; no backup                                       |
| 06  | [Mini Bar](plans/06-mini-bar.md)                           | in-progress     | P1       | 7–9 d   | Same issues; unvalidated import                                             |
| 07  | [Home apps shared core](plans/07-home-apps-shared-core.md) | —               | P1       | 5–7 d   | Two near-duplicate apps                                                     |

## Suggested order

1. **Stabilise:** plan 00 M0, plan 01 M0, plan 04 M0 (missing Worker file), then CI.
2. **Safety and quality for the live app:** plan 05 (it is marked `active`) with plan 07's core.
3. **Finish in-progress apps:** 06, 03, then 02 (largest).
4. **Polish:** shared tokens and the smoke test.

## Cross-cutting findings (verified in the archive)

- Each app is one standalone HTML page; the Vite/React template in every folder is unused (`src/App.tsx` is a placeholder).
- Package names are copy-pasted: `launches`→`climate`, `weatherdash`→`astrodash`, `mini-bar`→`spice-cupboard`; root and index still say `rjmlaird-tools` / `@rjmlaird/tools-index`.
- `launches/wrangler.jsonc` named `worker/index.ts`, absent in the first archive (present in a later upload); `launches/index.html` has a duplicate `const dateFmt` that breaks the whole script.
- `apps.ts` has `path?: url` (invalid TypeScript) and full-URL paths that the test (`/${id}`) rejects; `launches` is unregistered; `astrodash` is labelled Python/Streamlit.
- Two apps load the Tailwind Play CDN at runtime; two use Google Fonts; astrodash loads Leaflet from unpkg.
- Accessibility varies: astrodash 97 and weatherdash 39 ARIA/role occurrences; spice-cupboard and mini-bar have none and use inline `onclick`.

## Assumptions and things to verify

- Confirm terms, rate limits and attribution for Open-Meteo, RainViewer, Carto tiles, NOAA SWPC, NASA DONKI (key handling) and Launch Library 2 before promoting the apps.
- The page-weight budget (≤ 250 KB compressed) is a draft default.
- Effort numbers are rough and assume one maintainer.

## Layout

```
framework/   PLAN-TEMPLATE.md, DEFINITION-OF-DONE.md
plans/       00 … 07
```
