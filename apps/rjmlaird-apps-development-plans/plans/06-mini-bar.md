# Plan 06 — Mini Bar (`apps/mini-bar`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | `in-progress` (updated 2026-10-11) |
| Route | `mini-bar.apps.rjmlaird.co.uk` |
| Dev ports | Vite default |
| Stack | Single 110 KB `index.html` (vanilla JS, Tailwind Play CDN, Font Awesome cdnjs, Google Fonts); `localStorage` |
| Priority | P1 |
| Total effort | ≈ 7–9 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
A home bar inventory and cocktail planner: record what you have, see which drinks you can make now, keep recipes and a shopping list.

## 2. Current state (evidence)
- Tabs: Planner, Inventory, Recipes, Shopping; modals for inventory items and recipes; "reset to defaults", `exportData`/`importData` (with `FileReader`), clear-ticked and copy-shopping-list actions.
- Storage keys: `minibar_inventory_v1`, `minibar_recipes_v1`, `minibar_shopping_v1` (versioned names; `try/catch` present).
- Same toolkit and structure as `spice-cupboard`: Tailwind Play CDN with the same colour config, Font Awesome 6.4.0, Google Fonts, inline handlers (34 `onclick`), 16 `innerHTML`, **0 ARIA/role**, 8 `alert`/`confirm` calls; no reduced-motion or colour-scheme support.
- `package.json` is named `spice-cupboard` (copy-paste); has `deploy` and `cf:dev`; no tests; unused React scaffold.
- Page title: "Mini-Bar Inventory & Cocktail Planner Pro".

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Runtime Tailwind CDN and render-blocking third-party scripts | High |
| No accessibility semantics; many `alert`/`confirm` | High |
| Import accepts arbitrary JSON; needs schema validation (bad data could break rendering or inject markup) | High |
| Matching logic (ingredients, substitutes, units) untested | Med |
| Duplicated code with `spice-cupboard` | Med |
| Alcohol-related content: age/legal wording and responsible-use notice not present in code reviewed | Low |

## 4. Scope
**In:** production CSS, accessibility, validated import/export, tested matching, shared core with plan 05.
**Out:** accounts, retailer integrations, nutritional/health advice.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Rename package to `@rjmlaird/mini-bar`; README with data model and keys
- [ ] (S) Add a prominent backup/export reminder and a size/health check for stored data

**M1 — Ship**
- [ ] (M) Replace Tailwind CDN with a built stylesheet; replace Font Awesome with inline SVG icons
- [ ] (M) Rebuild modals as `<dialog>`, tabs per ARIA pattern, real buttons; remove inline `onclick`
- [ ] (M) Schema-validate imported JSON (versioned shape, field types, size limits) with clear errors; escape all rendered text
- [ ] (S) Replace `alert`/`confirm` with accessible dialogs and an "undo" for deletes
- [ ] (S) Registry → `active` after M2 tests

**M2 — Harden**
- [ ] (M) Extract model/matching into a module with tests: can-make-now, missing-one, substitutes (if supported), unit handling (ml/oz/dash), case-insensitive matching, empty inventory
- [ ] (S) Shopping list rules tested (dedupe, tick/clear, copy output)
- [ ] (S) `prefers-color-scheme`, `prefers-reduced-motion`, contrast check in both themes
- [ ] (S) Page-weight check (110 KB source + CDN scripts)

**M3 — Extend**
- [ ] (M) Recipe import from a simple text/CSV format
- [ ] (M) Menu/print view for a party
- [ ] (S) Optional notice about responsible drinking and local legal drinking age, if the app is shared publicly

## 6. Technical approach
Use the shared inventory/recipe core (plan 07) with a thin domain layer for cocktails (ingredients with category, optional substitutes, serving size). Normalise ingredient names for matching (case, plural, aliases) in one function.

## 7. Quality gates
Definition of Done; test that corrupted/old-version storage does not break the page.

## 8. Dependencies
Plans 00 and 07; shared tokens.

## 9. Open decisions
- **D1.** Support ingredient substitutes ("any dry vermouth")? *Recommend yes, as an optional alias list.*
- **D2.** Keep the "Pro" wording in the title? *Recommend simplify to "Mini Bar".*

## 10. Success measures
No third-party runtime scripts; imports validated; matching tests green; full keyboard operation.
