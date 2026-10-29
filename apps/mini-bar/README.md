# Mini Bar

Home bar inventory and cocktail planner for **mini-bar.apps.rjmlaird.co.uk**. Record what you have and see what you can make.

## Tabs

**Planner.** "What can I make?" Every recipe is matched against your stock. Filter by readiness (ready, missing 1, missing 2 or more), base spirit (gin, vodka, rum, whisky, tequila, brandy, liqueur / other) and strength (low, medium, strong, alcohol-free).

**Inventory.** Bottles, mixers, produce and garnishes, in these categories: base spirits, liqueurs and fortified wines, mixers, juices and fresh produce, syrups and sweeteners, bitters and seasonings, garnishes, other. Toggle stock, add, edit or delete items. Items can record a container size and amount remaining, and the **Low stock** filter shows in-stock items at or below 20% of their container.

**Recipes.** A starter set that you can extend. Add recipes with required and optional ingredients, favourite them, duplicate them, delete them, or restore the defaults. Open a recipe to scale it from 1 to 12 servings (quantities round to practical bar measures) and copy it as text.

**Shopping.** A list of auto-detected missing ingredients, plus your own items. Tick items off, clear completed ones and copy the list.

## How matching works

A recipe is ready when every **required** ingredient has an in-stock inventory item with the same name, ignoring case and surrounding spaces. Optional ingredients are listed as missing but do not block a recipe. Name your inventory items to match recipe ingredients exactly.

## Data and privacy

Everything is stored in `localStorage` on the device, under `minibar_inventory_v1`, `minibar_recipes_v1` and `minibar_shopping_v1`. **Export** downloads a JSON backup (`version`, `timestamp`, inventory, recipes, shopping). **Import** asks for confirmation and overwrites your current inventory and custom recipes.

## Stack

Single `index.html` of vanilla JavaScript. Tailwind Play CDN, Font Awesome and Google Fonts load at runtime. The React files in `src/` are an unused scaffold.

## Development

```sh
pnpm --filter ./apps/mini-bar dev
pnpm --filter ./apps/mini-bar build
pnpm --filter ./apps/mini-bar run cf:dev
pnpm --filter ./apps/mini-bar run deploy
```

## Known issues

- `package.json` is named `spice-cupboard`, which collides with `apps/spice-cupboard`. Rename it to `mini-bar`.
- A stray `package-lock.json` is ignored by pnpm. Delete it.
- Tailwind Play CDN is not intended for production. Replace it with locally built CSS.
