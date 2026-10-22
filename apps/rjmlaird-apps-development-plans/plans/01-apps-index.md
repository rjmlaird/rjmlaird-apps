# Plan 01 — Apps index (`apps/index`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | n/a (it *is* the registry) |
| Route | `apps.rjmlaird.co.uk` (custom domain) |
| Dev ports | `8789` / `9231` |
| Stack | TypeScript, Hono JSX, Cloudflare Workers, Vitest |
| Priority | **P0** |
| Total effort | ≈ 3 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
Front door listing every app with accurate status, stack and links. Visitors should reach any app in one click and see honestly whether it is finished.

## 2. Current state (evidence)
- `apps.ts`: types, three groups (`space`, `places`, `home`), `APPS` array of four apps (1 `active`: spice-cupboard; 3 `in-progress`: astrodash, weatherdash, mini-bar), repo URL `…/rjmlaird-apps`.
- `apps.test.ts`: unique ids; ids ↔ `apps/` folders; known groups/statuses; `source`/`path` conventions; `path` only for live statuses; ISO dates.
- **`path?: url;` does not compile**; stored paths are full `https://<id>.apps.rjmlaird.co.uk` URLs whereas the test expects `/${id}`.
- `astrodash` entry says Python/Streamlit/Skyfield but the folder holds a client-side HTML dashboard; `WEB = ["React","Vite","TypeScript"]` is a placeholder (the code comment says the stack is unconfirmed) while the apps are vanilla JS, with Tailwind CDN in two.
- `launches` exists as a folder but not in `APPS`.
- Page code (`page.tsx`, `script.ts`, `Callout.tsx`) and wrangler (custom domain, observability on) mirror the tools index.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Typecheck error and failing tests block CI | High |
| Wrong `tech` data misleads visitors | Med |
| `launches` invisible | Med |
| Filters/links not audited for accessibility | Med |
| Package name `@rjmlaird/tools-index` and tools-specific strings in README/page | Low |

## 4. Scope
**In:** accurate data, passing tests, accessible listing, `apps.json`.
**Out:** analytics, search, user accounts.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Fix the `path` type and test (plan 00 D1); get `pnpm typecheck` and tests green
- [ ] (S) Add `launches` (`space`, `in-progress`); correct `astrodash` tech to the real stack; replace the `WEB` constant with per-app accurate arrays
- [ ] (S) Rename package to `@rjmlaird/apps-index`

**M1 — Ship**
- [ ] (M) Extra tests: `tech` non-empty, no placeholder strings, live apps respond (optional smoke test), descriptions ≤ N characters
- [ ] (S) `/apps.json` and `/api/health`
- [ ] (S) Update page copy and README (tools → apps)

**M2 — Harden**
- [ ] (M) Accessibility audit of filters and cards
- [ ] (S) Page-weight check; cache headers
- [ ] (S) Custom 404 pointing to the index

**M3 — Extend**
- [ ] (M) Derive `updated` from git history
- [ ] (S) Group blurbs and icons from the shared tokens package
- [ ] (M) Link each entry to its plan/roadmap page

## 6. Technical approach
Single source of truth in `apps.ts`; a pure `validateRegistry()` shared by tests and (optionally) the build. Treat `path` as the app's public URL; derive `source` from `id`.

## 7. Quality gates
Definition of Done plus: every listed link returns 200 in the smoke test.

## 8. Dependencies
Plan 00; each app plan flips its own status.

## 9. Open decisions
- **D1.** Show `in-progress` apps as live links? *Recommend yes, labelled "In progress".*
- **D2.** New group for `launches`? *Recommend keep in `space`.*

## 10. Success measures
Typecheck/tests green; registry matches the five folders; tech labels verified against code.
