# rjmlaird-apps

Small, bookmarkable apps for **[apps.rjmlaird.co.uk](https://apps.rjmlaird.co.uk)**. Each app is its own Cloudflare Worker serving static assets on `<app>.apps.rjmlaird.co.uk`; `apps/index` is the directory page. pnpm workspace, Node 22.

## Apps

| App | What it does | Stack | Status |
| --- | --- | --- | --- |
| [AstroDash](apps/astrodash/README.md) | Observing dashboard: sky, targets, planning, conditions, aurora, solar | HTML/JS, Vite | in progress |
| [Launches](apps/launches/README.md) | Next ten rocket launches with local-time countdowns | HTML/JS, Vite | in progress |
| [WeatherDash](apps/weatherdash/README.md) | Forecast, radar, air quality and pollen | HTML/JS, Vite | in progress |
| [Spice Cupboard](apps/spice-cupboard/README.md) | Spice inventory and mix manager with batch scaling | HTML/JS, Tailwind | active |
| [Mini Bar](apps/mini-bar/README.md) | Home bar inventory and cocktail matcher | HTML/JS, Tailwind | in progress |
| [Kinship Notes](apps/kinship-notes/README.md) | GEDCOM viewer with private research notes | React, Vite, TS | in progress |
| [First Aid Kit](apps/first-aid-kit/README.md) | Kit inventory with expiry and restock lists | HTML/JS, Vite | planned |
| [Apps index](apps/index) | Directory page at `apps.rjmlaird.co.uk` | Hono Worker | live |

The registry that drives the directory is `apps/index/src/apps.ts`.

## Getting started

```sh
corepack enable
pnpm install
pnpm --filter <app> dev      # e.g. pnpm --filter mini-bar dev
```

Run everything the way CI does:

```sh
pnpm verify    # brand:check, typecheck, test, build
```

| Command | Purpose |
| --- | --- |
| `pnpm dev` | all apps in parallel |
| `pnpm build` | production build of every app |
| `pnpm typecheck` / `pnpm test` | across the workspace |
| `pnpm brand:sync` | regenerate `brand.css` copies after editing brand tokens |
| `pnpm brand:check` | brand drift, legacy palette/font/CDN, metadata, favicon, contrast |

## Repository layout

```
apps/<app>/            one app per folder (index.html, public/, worker/, wrangler.jsonc)
apps/index/            Hono Worker for the directory page
packages/brand-tokens/ canonical tokens, base CSS, Tailwind preset
packages/ui/           branded Hono page shell
packages/utils/        shared helpers
packages/config/*      tsconfig, ESLint, Prettier
scripts/               brand.mjs (sync/check), copy-fontawesome.mjs
docs/                  guides and development plans
```

## Documentation

- [Architecture](docs/architecture.md): how apps are built, served and stored
- [Branding guide](docs/branding.md): tokens, type, colour roles, accessibility
- [Adding an app](docs/adding-an-app.md)
- [Deployment](docs/deployment.md)
- [Development plans](docs/development-plans)
