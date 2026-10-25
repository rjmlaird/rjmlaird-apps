# rjmlaird-apps

Small, single-purpose apps for **apps.rjmlaird.co.uk**. Each app is its own Cloudflare Worker serving a static front end on its own subdomain, `https://<app>.apps.rjmlaird.co.uk`. The index at `apps.rjmlaird.co.uk` lists them. Managed as a pnpm workspace.

## Apps

| App | Folder | What it is | Stack |
|---|---|---|---|
| Astro Mission Control | `apps/astrodash` | Observing dashboard: sky, weather, space weather, aurora | Vanilla JS, Leaflet, Open-Meteo, NOAA SWPC, NASA DONKI |
| Upcoming Rocket Launches | `apps/launches` | Schedule of the next launches | Vanilla JS, Launch Library 2 |
| Weather Dashboard | `apps/weatherdash` | Conditions and forecast for a location | Vanilla JS, Open-Meteo, RainViewer |
| Spice Cupboard & Mix Manager | `apps/spice-cupboard` | Spice inventory and mixes | Vanilla JS, Tailwind CDN, `localStorage` |
| Mini Bar | `apps/mini-bar` | Home bar inventory and cocktails | Vanilla JS, Tailwind CDN, `localStorage` |
| First Aid Kit Inventory | `apps/first-aid-kit` | Kit contents, expiry, inspections, restock list | Vanilla JS, `localStorage` |
| Kinship Notes | `apps/kinship-notes` | GEDCOM family-tree viewer with research notes | React 18, Vite, TypeScript, Vitest |
| Apps index | `apps/index` | The listing page, plus `/brand` reference | Hono, TypeScript |

Most apps are a single hand-written `index.html`. Where an app folder also contains `src/App.tsx` and `src/main.tsx` reading "exp-example", that is an unused scaffold and the page does not load it. Only Kinship Notes is a real React app.

The source of truth for this table is `apps/index/src/apps.ts`.

## Layout

```
apps/
  <app>/                 one Worker + static front end per app
  index/                 apps.rjmlaird.co.uk (Hono)
  rjmlaird-apps-development-plans/   roadmap and plans, not an app
packages/
  brand-tokens/          canonical design tokens and shared helpers
  ui/, utils/            small shared packages (Hono layout, unit helpers)
  config/                shared tsconfig, ESLint and Prettier config
```

A typical app folder:

```
index.html            the app (or Vite entry)
public/favicon.svg    product icon
worker/index.ts       serves ./dist and /api/health
wrangler.jsonc        name, assets, custom domain
vite.config.ts
package.json
```

## Commands

```sh
pnpm install
pnpm typecheck                      # every workspace package that defines it
pnpm lint
pnpm format
pnpm --filter ./apps/<app> dev      # Vite dev server for one app
pnpm --filter ./apps/<app> build
pnpm --filter ./apps/<app> run cf:dev
pnpm --filter ./apps/<app> run deploy
```

Select an app by path (`./apps/<app>`) rather than by package name, because some package names do not yet match their folders (see Known issues).

Use `run deploy`, not `deploy`. `pnpm deploy` is a built-in pnpm command and will not run the script.

Apps with tests (`apps/index`, `apps/kinship-notes`, `packages/brand-tokens`):

```sh
pnpm --filter ./apps/index test
```

## Routing and deployment

Each app is a separate Worker with a Custom Domain, set in its `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "<app>.apps.rjmlaird.co.uk", "custom_domain": true }]
```

`apps/index` owns `apps.rjmlaird.co.uk` only. Custom Domains match exact hostnames, so it never receives traffic for the app subdomains.

Deploy an app before listing it. The index links to `https://<id>.apps.rjmlaird.co.uk`, which will not resolve until that app's Worker is deployed.

## Add an app

1. Create `apps/<id>/`. Copy `apps/first-aid-kit` for a vanilla page, or `apps/kinship-notes` for React. The folder name is the id.
2. In `package.json` set `name` to the id. In `wrangler.jsonc` set `name` and the route to `<id>.apps.rjmlaird.co.uk`.
3. Add a glyph for the id in `packages/brand-tokens/src/icons.ts`, run `pnpm --filter @rjmlaird/brand-tokens generate`, and copy `packages/brand-tokens/icons/<id>.svg` to `apps/<id>/public/favicon.svg`.
4. Register it in `apps/index/src/apps.ts`. Set `path` and `source` only once it is deployed. Follow the conventions in the file: `path` is `https://<id>.apps.rjmlaird.co.uk`, `source` is `apps/<id>`, and `tech` lists what the shipped page really uses.
5. `pnpm install`, then run the index tests. They fail if an entry is missing, a convention is broken, or no icon exists.

## Brand and shared conventions

`packages/brand-tokens` is the single source for colours, fonts, spacing, focus style, favicons and page metadata. See its [README](packages/brand-tokens/README.md). In short:

- Tokens are defined once in `src/tokens.ts`. `css/brand.css` and `icons/*.svg` are generated and checked for drift (`pnpm --filter @rjmlaird/brand-tokens check`).
- Components should use semantic roles (`--color-primary`, `--color-danger`), not raw hex values.
- Page title is `<Product name> · apps.rjmlaird.co.uk`. Use `headTags()` where the app is rendered by a Worker.
- Never signal status by colour alone.
- The reference page is at `apps.rjmlaird.co.uk/brand`.

Only `apps/index` consumes the package so far. Migrating the other apps is tracked in the development plans.

## Local ports

`apps/index` runs on `8789` (inspector `9231`) under `wrangler dev`. Vite apps use Vite's default port and increment automatically when run together.

## Known issues

- `apps/weatherdash/package.json` is named `astrodash`, which collides with `apps/astrodash`. Rename it to `weatherdash`.
- `apps/index/package.json` is still named `@rjmlaird/tools-index`.
- `apps/mini-bar` and `apps/launches` contain a stray `package-lock.json`, which pnpm ignores. Delete them.
- Spice Cupboard and Mini Bar load Tailwind from the Play CDN and Font Awesome at runtime. They should use locally built CSS.
- `apps/launches/FIX-NOTES.md` documents a script error in the page. Confirm the fix is in `index.html` before deploying.
- `packages/ui` and `packages/utils` are not used by any app.
- The repository contains no CI workflow files. Typecheck, lint, tests and the token drift check run locally only.

## Plans

`apps/rjmlaird-apps-development-plans` holds the platform plan and one plan per app.
