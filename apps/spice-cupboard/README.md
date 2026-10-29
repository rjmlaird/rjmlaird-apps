# Spice Cupboard & Mix Manager

Track which spices you have and see which spice mixes you can make, for **spice-cupboard.apps.rjmlaird.co.uk**.

## Using it

**Cupboard tab.** A list of spices, each marked in stock or out of stock. Filter by category (ground spice, dried herb, chilli / heat, whole / seed, blend) and by stock status. Add, edit or delete spices, and toggle stock with one tap. It starts with 30 default spices; **Reset** restores them.

**Mixes tab.** 24 built-in mixes, from Peri-Peri and Cajun to Rogan Josh, Jamaican jerk, za'atar-style and dry chimichurri. Filter by readiness (can make now, missing 1, missing 2 or more), heat (mild, medium, hot) and cuisine. Open a mix to see its ingredients scaled to **1, 2, 3, 4, 6 or 8** batches, with quantities shown as culinary fractions, and copy the recipe to the clipboard.

## How matching works

A mix ingredient counts as available only if a spice marked in stock has exactly the same name, ignoring case and surrounding spaces. If you add "hot paprika" and a mix needs "paprika", the mix will show it as missing. Name custom spices to match the mix ingredients.

Mixes are built into the page. You can edit spices, but not add or edit mixes.

## Data and privacy

Your spices are stored in `localStorage` under `spice_cupboard_data` and never leave the device. There is no backup or import. Clearing site data, or using another browser or device, starts from the defaults.

## Stack

Single `index.html` of vanilla JavaScript. Styling uses the Tailwind Play CDN, icons use Font Awesome, and fonts come from Google Fonts, so the page needs a network connection to look right. The React files in `src/` are an unused scaffold.

## Development

```sh
pnpm --filter ./apps/spice-cupboard dev
pnpm --filter ./apps/spice-cupboard build
pnpm --filter ./apps/spice-cupboard run cf:dev
pnpm --filter ./apps/spice-cupboard run deploy
```

## Known issues

- Tailwind Play CDN is not intended for production. Replace it with locally built CSS, and do the same for `apps/mini-bar`, which shares this pattern.
- No data export, so a cleared browser loses your cupboard.
