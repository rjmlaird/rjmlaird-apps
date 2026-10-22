# Plan 04 — Upcoming Rocket Launches (`apps/launches`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | **not listed** (folder exists) |
| Route | `launches.apps.rjmlaird.co.uk` (wrangler) |
| Dev ports | Vite default |
| Stack | Single 15 KB `index.html` (vanilla JS/CSS); Launch Library 2 API; unused Vite/React scaffold |
| Priority | **P0** (page script fails to parse) then P2 |
| Total effort | ≈ 3–4 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
A simple page listing upcoming launches (next 20) with times, vehicles and status, for space enthusiasts who want a quick, readable schedule.

## 2. Current state (evidence)
- `index.html` has a `CONFIG` with `API_URL: "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20"`, a fetch with `AbortController`, and comments saying the API is rate limited (about 15 requests/hour) so the page "refreshes sparingly". 7 ARIA/role occurrences; no `innerHTML`; reduced-motion handled; dark colour scheme only (`color-scheme: dark`, no `prefers-color-scheme`).
- Earlier archive: `wrangler.jsonc` pointed `main` at a `worker/index.ts` that did not exist. The later `launches.zip` includes it (a 225-byte stub with an `ASSETS` binding, which runs correctly locally). `package.json` has no `deploy` script (it was named `climate` in the earlier archive).
- **`index.html` declares `const dateFmt` twice (and uses an undefined `dayFmt`), a SyntaxError that stops the whole script: the page stays on "Loading…" and never calls the API.** Verified by parsing the inline script and running it in jsdom with mocked API data (0 cards before the fix, 3 after).
- Not in `apps.ts`; therefore the registry test fails (folder without entry).
- No tests, no README, no caching layer; the browser calls the third-party API directly.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Script syntax error (duplicate `dateFmt`) → page never loads data | **High** |
| Direct browser calls to the third-party API: limits apply per visitor IP, and the page has no shared cache or fallback if the service is down or changes | Med |
| Not registered or documented | Med |
| Dark-only theme; local-time/time-zone handling untested | Med |
| API version in the URL may change or retire | Low |

## 4. Scope
**In:** make it deployable, add a caching proxy, handle limits and errors, time-zone-correct display, accessibility polish.
**Out:** notifications, accounts, historical archive.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Fix the duplicate `dateFmt`/`dayFmt` declaration (done in `launches-fixed.zip`); add a CI check that parses inline scripts or a jsdom smoke test
- [ ] (S) Add a `deploy` script and correct the package name
- [ ] (S) Add registry entry and README (data source, terms, rate limit)

**M1 — Ship**
- [ ] (M) Worker `/api/launches` that fetches the upstream once and caches (Cache API/KV, TTL ≈ 10–15 min) with `stale-while-revalidate`; page calls the Worker, not the third party
- [ ] (S) Display "last updated" and a clear message when serving stale data
- [ ] (S) Registry → `in-progress` then `active`

**M2 — Harden**
- [ ] (M) Tests: parsing and display formatting (time zones, TBD/NET dates, missing fields) with fixtures
- [ ] (S) Add `prefers-color-scheme` support and ensure contrast in both themes
- [ ] (S) Accessibility pass: list semantics, `<time datetime>`, status badges not colour-only, live region for refresh
- [ ] (S) Attribution wording as required by the provider

**M3 — Extend**
- [ ] (M) Filters (provider, location, status) and a countdown for the next launch
- [ ] (M) iCal feed or "add to calendar" per launch
- [ ] (S) Link out to AstroDash for sky conditions at the launch site, where relevant

## 6. Technical approach
Worker acts as the single upstream caller; the client is static. Store a versioned, minimal JSON shape (id, name, net, window, status, provider, pad, links) so the UI is decoupled from the upstream schema.

## 7. Quality gates
Definition of Done; test that the page still renders from a cached payload when the upstream is down.

## 8. Dependencies
Plan 00 (template, naming), plan 01 (registry), plan 02 (shared tokens).

## 9. Open decisions
- **D1.** Cache in KV (shared) or the Cache API (per colo)? *Recommend KV for a single global snapshot.*
- **D2.** Keep dark-only? *Recommend add a light theme via shared tokens.*

## 10. Success measures
Deploys cleanly; upstream calls ≈ a few per hour in total, not per visitor; page shows data freshness; tests for date/time formatting pass.
