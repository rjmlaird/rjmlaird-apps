# Plan 00 — Platform and monorepo foundations (`rjmlaird-apps`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | n/a (repo-wide) |
| Route | `apps.rjmlaird.co.uk` (index) and `<id>.apps.rjmlaird.co.uk` (each app, custom domain) |
| Dev ports | Vite default for apps; `8789`/`9231` for the index |
| Stack | pnpm 9.15 workspaces, TypeScript 5.6, Vite 5, React 18 (unused scaffold), Wrangler 4, Cloudflare Workers + static assets |
| Priority | **P0** — all app plans depend on it |
| Total effort | ≈ 6–8 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
Give the apps repo a consistent, buildable and testable base. The user is the maintainer: adding or fixing an app should be predictable, and CI should catch broken deploys before they reach a custom domain.

## 2. Current state (evidence)
- Five apps (`astrodash`, `launches`, `mini-bar`, `spice-cupboard`, `weatherdash`) plus `apps/index`; shared `packages/{ui,utils,config/*}` copied from the tools repo.
- **Each app is really one standalone `index.html`** (astrodash 495 KB, mini-bar 110 KB, spice-cupboard 73 KB, weatherdash 38 KB, launches 15 KB). Each folder also contains an unused Vite + React 18 template (`src/App.tsx` says "exp-example", `vite.config.ts` says "exp-example.labs.rjmlaird.co.uk"). `packages/ui` and `packages/utils` are not used by any app.
- Config copy-paste errors: `launches/package.json` is named `climate`; `weatherdash/package.json` is named `astrodash` (its wrangler name is `weather`); `mini-bar/package.json` is named `spice-cupboard`.
- `launches/wrangler.jsonc` sets `main: "worker/index.ts"` but **there is no `launches/worker/` folder**, and `launches` has no `deploy` script (neither does `astrodash`). `astrodash` also has a stray `src/index.ts` duplicating `worker/index.ts`.
- Root `README.md` is the **tools** repo README (mentions `tools.rjmlaird.co.uk`, `orbital-calc`, `tools.ts`) with a stray "# rjmlaird-apps" heading appended; root `package.json` name is `rjmlaird-tools`; `apps/index/package.json` is `@rjmlaird/tools-index`.
- Root scripts: `dev`, `build`, `typecheck`, `lint`, `format` only — **no `test`**, and no CI folder in the archive. Only `apps/index` has a `typecheck` script and tests; no app has a `tsconfig.json`.
- Registry test and types: `apps.ts` declares `path?: url;` (an undefined type) and stores full URLs, while `apps.test.ts` requires `path === "/" + id`; `launches` has no registry entry. Typecheck and the registry tests should both fail today.
- Mixed dependency baselines: apps use React 18/Vite 5; the tools repo uses React 19/Vite 8.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Registry typecheck/test failures and a missing `worker/` for `launches` block clean CI and deploy | High |
| Unused React/Vite scaffold and copy-pasted names cause confusion and wasted installs | High |
| No CI, no `test` script, no app type-checking | High |
| README and package names describe a different repo | Med |
| Runtime CDNs and Google Fonts across apps (see plans 05–06) | Med |
| No shared design tokens although apps copy each other's (e.g. weatherdash notes "tokens match AstroDash") | Low |

## 4. Scope
**In:** repo hygiene, CI, naming, one app template that matches reality, shared tokens/helpers, registry correctness.
**Out:** rewriting app features (see plans 02–07), changing hosting provider.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Fix `apps.ts`: change `path?: url` to `string`, decide `path` = full URL vs `/${id}` and align `apps.test.ts` (decision D1)
- [ ] (S) Add a `launches` registry entry; correct `astrodash.tech` (code is client-side HTML, not Python/Streamlit/Skyfield) and the shared `WEB` stack constant (see plan 01)
- [ ] (S) Create `launches/worker/index.ts` (copy the 225-byte stub) or switch wrangler to assets-only; delete `astrodash/src/index.ts`
- [ ] (S) Correct package names to `@rjmlaird/<id>`; replace root README and root/index package names

**M1 — Ship**
- [ ] (M) Decide the app template (D2): *static* (`index.html` + `public/` + assets-only Worker) vs *Vite* (real entry). Remove the unused React scaffold and dependencies from static apps
- [ ] (M) CI workflow: install → typecheck → lint → test → build on PRs and `main`
- [ ] (S) Root `test` script; per-app `tsconfig.json` extending `@rjmlaird/tsconfig` where there is TypeScript
- [ ] (S) Add `deploy` and `typecheck` scripts to every app

**M2 — Harden**
- [ ] (M) Single Vitest setup; extract pure logic from the HTML files into modules so it can be tested
- [ ] (M) Shared `packages/tokens` (CSS variables for dark/light, focus, spacing) used by astrodash, weatherdash, launches
- [ ] (S) Shared accessible helpers (modal/focus trap, tabs, `aria-live` announcer) if the apps are moved to modules
- [ ] (S) Dependency grouping/updates (Renovate or Dependabot)

**M3 — Extend**
- [ ] (M) Post-deploy smoke test hitting every app's `/api/health` and `/`
- [ ] (M) `pnpm new:app <id>` scaffold generating folder, wrangler config, registry entry and plan file
- [ ] (S) Write `CONTRIBUTING.md` with the hosting convention (index + custom domains)

## 6. Technical approach
Hosting convention (already used in the code): index Worker on `apps.rjmlaird.co.uk`; each app a separate Worker on `<id>.apps.rjmlaird.co.uk` using Workers static assets with `run_worker_first: ["/api/*"]`. Keep it; document it. For static apps, build output should be `dist/` produced by a minimal Vite config (or a copy step) so `wrangler deploy` always has something to serve.

## 7. Quality gates
`framework/DEFINITION-OF-DONE.md`; CI green on `main`.

## 8. Dependencies
Blocks plans 01–07. Cloudflare API token as a repo secret if deploys are automated.

## 9. Open decisions
- **D1.** Registry `path`: full URL (matches current data) or `/${id}` (matches the test and comment)? *Recommend full URL, because apps live on separate hostnames; update the test and comment.*
- **D2.** Template: static or Vite? *Recommend static for the three single-file apps; Vite only if an app is being split into modules/TypeScript (plans 02, 03).*
- **D3.** Keep `packages/ui`/`utils` in this repo? *Recommend remove until an app uses them.*

## 10. Success measures
CI green; every `package.json` name matches its folder; every wrangler `main` exists; registry typechecks and tests pass; no unused scaffold files.
