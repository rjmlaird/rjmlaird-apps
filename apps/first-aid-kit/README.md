# First Aid Kit

Keep track of what is in each first aid kit (home, car, hiking) and when items expire or run low.

**Status:** planned. Not deployed and has no Worker yet. See [docs/deployment.md](../../docs/deployment.md).

## Features

Kits dashboard, all-items search and sort, restock list (expired, expiring within 90 days, below minimum, missing) with copy-as-text, an inspection checklist that records the last-checked date, and JSON backup and restore.

## Data

Browser `localStorage` key `first_aid_kits_data_v1`; starter kits are created on first load. Backups are JSON downloads.

## Commands

```sh
pnpm --filter first-aid-kit dev
pnpm --filter first-aid-kit build
```

Not medical advice: check real expiry dates on the packaging.
