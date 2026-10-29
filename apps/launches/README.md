# Upcoming Rocket Launches

Schedule of upcoming launches for **launches.apps.rjmlaird.co.uk**. A countdown shows the next launch, and a list below shows the following ones.

## What it shows

- A live countdown to the next launch (`d h m s`).
- A list of the next **10** launches, with status. Status is shown by text and a distinct icon and border style, not colour alone.
- A time-zone note, and a "last updated" time.
- Clear messages when the launch time is not yet announced or has already passed.

## Data

Launch Library 2 (`ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20`). The page fetches 20 so finished launches can be dropped and 10 shown. No API key is used.

Anonymous access is rate limited, so the page is deliberately sparing:

| Setting                             | Value            |
| ----------------------------------- | ---------------- |
| Automatic refresh                   | every 20 minutes |
| Minimum gap between any two fetches | 5 minutes        |
| Request timeout                     | 15 seconds       |

If you press **Refresh launches** too soon, the page tells you how long to wait. A 429 response is reported as rate limiting.

Launch schedules change often. Always check the launch provider for the latest.

## Development

Single `index.html` with an inline script. No storage is used.

```sh
pnpm --filter ./apps/launches dev
pnpm --filter ./apps/launches build
pnpm --filter ./apps/launches run cf:dev
pnpm --filter ./apps/launches run deploy
```

## Known issues

- `FIX-NOTES.md` describes a duplicate `const dateFmt` that stopped the whole script running. Confirm the fix (`dayFmt`) is in `index.html` before deploying.
- `package-lock.json` is stray and ignored by pnpm. Delete it.
- The `src/` React files are an unused scaffold.
