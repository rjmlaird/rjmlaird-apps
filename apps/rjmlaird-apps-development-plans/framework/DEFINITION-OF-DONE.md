# Definition of Done (common to every app)

An app can move to `status: "active"` in `apps/index/src/apps.ts` only when every box below is ticked, or has a written exception in its plan. (Adapted from the tools repo's version for single-page apps on `<id>.apps.rjmlaird.co.uk`.)

## Build and deploy
- [ ] `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint` and `pnpm test` pass from the repo root
- [ ] `pnpm build` produces `dist/` and `wrangler deploy --dry-run` succeeds
- [ ] `wrangler` config has a unique `name`, `main` pointing at a file that exists, a correct `assets` binding and a custom-domain route
- [ ] `package.json` `name` matches the folder (`@rjmlaird/<id>`) and has `dev`, `build`, `deploy`, `typecheck`, `test` scripts
- [ ] `/api/health` returns `{ "ok": true }`
- [ ] No unused template files or dependencies

## Correctness and data
- [ ] Core logic is separated from the DOM and unit-tested (matching, scaling, unit conversion, date maths, API parsing)
- [ ] Every external API call has a timeout, a visible error state, a retry action and an offline message
- [ ] Every external data source is listed in the README with licence/attribution and rate limits, and the UI shows attribution where required
- [ ] Stored data is versioned (`key:v1`), migrates safely, and the app still works when storage is unavailable
- [ ] User-entered text and API text are escaped before being inserted into the page

## Usability and accessibility
- [ ] Meets WCAG 2.2 AA: keyboard-operable, visible focus, labelled controls, 4.5:1 text contrast, modals trap and restore focus, no inline `onclick`-only controls
- [ ] Respects `prefers-color-scheme` and `prefers-reduced-motion`
- [ ] Uses real buttons/links, headings and landmarks; tabs follow the ARIA tabs pattern; updates announced with `aria-live` where useful
- [ ] `lang="en-GB"`; UK spelling; metric units by default with an imperial toggle where relevant
- [ ] Destructive actions use an accessible confirmation (not `alert`/`confirm`) and can be undone or exported first

## Performance, privacy and sustainability
- [ ] Page-weight budget met (draft default: ≤ 250 KB compressed first load, excluding map tiles/images the user requests)
- [ ] No runtime build tools in production (e.g. Tailwind Play CDN); third-party scripts/fonts are self-hosted or recorded as an accepted exception, version-pinned
- [ ] Location is requested only on user action; coordinates stay in the browser unless the plan says otherwise; no analytics without a written decision

## Documentation and registry
- [ ] App `README.md`: purpose, run/deploy commands, data sources, storage keys, limitations
- [ ] Registry entry is accurate (`tech` matches the real stack; `path`, `source`, `updated`)
- [ ] `apps.test.ts` and typecheck pass
- [ ] Plan file updated: status, "Last reviewed" date and ticked tasks
