# Deployment

Prerequisites: a Cloudflare account with `rjmlaird.co.uk` and `wrangler login`.

```sh
pnpm install
pnpm verify
pnpm --filter <app> deploy     # builds, then wrangler deploy
```

- Each app deploys independently; the Custom Domain in its `wrangler.jsonc` is created on first deploy.
- `apps/index` deploys with `pnpm --filter @rjmlaird/tools-index deploy`; its `build` is a dry run.
- Deploy `apps/index` after changing `apps.ts`.
- Local Worker preview: `pnpm --filter <app> cf:dev` (after a build).
- Health check: `GET /api/health` returns `{"ok":true}`.
- CI (`.github/workflows/ci.yml`) runs install, brand check, typecheck, tests and build. It does not deploy.
- First Aid Kit has no Worker yet; copy `worker/` and `wrangler.jsonc` from Mini Bar to publish it.
- Worker names: WeatherDash is deployed as `weather`, not `weatherdash`. Keep it unless you intend to create a new Worker.
