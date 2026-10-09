# orbital-calc

Two-body orbit calculator: period, periapsis/apoapsis radius and speed (vis-viva). Defaults to Earth's μ.

## Run locally
```sh
pnpm dev            # from repo root, or: wrangler dev
# open http://localhost:8787/orbital-calc
```

## Deploy
```sh
wrangler deploy
```
Uncomment the `routes` line in `wrangler.toml` to serve at `tools.rjmlaird.co.uk/orbital-calc`.

## API
```sh
curl "http://localhost:8787/orbital-calc/calculate?a=6778&e=0.001"

curl -X POST http://localhost:8787/orbital-calc/calculate \
  -H "content-type: application/json" \
  -d '{"a": 42164, "e": 0}'
```
Inputs: `a` (km), `e` (0 ≤ e < 1), optional `mu` (km³/s²). Returns `periodSeconds`, `periapsisKm`, `apoapsisKm`, `periapsisVelocityKmS`, `apoapsisVelocityKmS`, `meanVelocityKmS`.
