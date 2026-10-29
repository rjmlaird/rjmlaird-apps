# First Aid Kit Inventory

Track the contents of your first aid kits for **first-aid-kit.apps.rjmlaird.co.uk**: what is in each kit, when it expires, and what needs replacing.

This is an inventory tool, not medical guidance. Expiry dates and quantities are whatever you enter.

## Views

**Kits dashboard.** One card per kit with name, location and last-checked date. Create, rename or delete kits, open one to manage it, or start an inspection.

**Kit detail.** The kit's items, sortable (including by expiry date).

**All items.** Every item across all kits, with the same sorting.

**Restock list.** Everything that is expired, due to expire within 90 days, below its minimum quantity, or at zero. Grouped by kit, with **Copy as plain text** for a shopping list.

**Inspection.** A checklist for one kit. For each item: **Restock to Min**, **Qty -1** or **Mark Missing (Qty 0)**. **Finish & Save Inspection Date** sets the kit's last-checked date.

## Item fields

Name, category (wound care, bandages and tapes, antiseptics and cleansing, instruments and tools, medicines and relief, other), quantity, minimum quantity, optional expiry date, optional notes or batch information.

## Status rules

| Status   | Condition                     |
| -------- | ----------------------------- |
| Expired  | Expiry date is before today   |
| Expiring | Expiry is within 90 days      |
| Low      | Quantity is below the minimum |
| OK       | None of the above             |

Expiry takes priority over low stock when an item is both. Each status is shown with a text badge, not colour alone.

## Data and privacy

Everything is kept in `localStorage` under `first_aid_kits_data_v1` and stays on your device. **Backup / Restore** downloads `first_aid_kits_backup_YYYY-MM-DD.json` and can restore one, after a confirmation that overwrites the current kits.

On first load the app is seeded with three sample kits (home, car, hiking) so you can see how it works. They include items that show as expired and low. **Delete or edit them before relying on the app.**

## Development

Single `index.html` of vanilla JavaScript with inline CSS and no external requests.

```sh
pnpm --filter ./apps/first-aid-kit dev
pnpm --filter ./apps/first-aid-kit build
pnpm --filter ./apps/first-aid-kit run cf:dev
pnpm --filter ./apps/first-aid-kit run deploy
```

## Known issues

- No reminders or notifications. The app only shows status when you open it.
- No sync between devices. Use the JSON backup to move data.
- The sample kits use fixed dates, so some will show as expired from the start.
