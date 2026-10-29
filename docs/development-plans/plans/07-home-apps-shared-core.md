# Plan 07 — Shared core for home inventory apps (`packages/inventory-core`, proposed)

| Field           | Value                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Plan status     | Draft                                                                      |
| Registry status | n/a (shared package serving `spice-cupboard` and `mini-bar`)               |
| Route           | n/a                                                                        |
| Dev ports       | n/a                                                                        |
| Stack           | TypeScript package + Vitest; consumed by static apps through a small build |
| Priority        | P1 (do alongside plans 05 and 06)                                          |
| Total effort    | ≈ 5–7 days                                                                 |
| Last reviewed   | 2026-10-21                                                                 |

## 1. Purpose and users

Remove duplicated logic and UI patterns between `spice-cupboard` and `mini-bar`: inventory items, recipes/mixes made of ingredients, "can I make this?" matching, scaling, shopping lists, storage and export/import. The "user" is the maintainer; the benefit is one tested implementation.

## 2. Current state (evidence)

- Both apps share the same visual config (identical Tailwind `brand`/`darkbg`/`darkcard` colours), the same tab/modal structure, `localStorage` JSON storage, reset-to-defaults actions, 11 and 16 `innerHTML` sites respectively, and inline `onclick` handlers.
- Different today: spice has one storage key and a scaling control; mini-bar has three versioned keys, a shopping list and import/export.
- No shared package exists; `packages/utils` and `packages/ui` hold only physics/units and a Hono layout (copied from the tools repo) and are unused by the apps.

## 3. Gaps and risks

| Gap/risk                                                                    | Rating |
| --------------------------------------------------------------------------- | ------ |
| Two diverging copies of storage/matching code; fixes must be made twice     | High   |
| Different storage formats complicate import/export and any future migration | Med    |
| Over-generalising too early could slow delivery                             | Med    |

## 4. Scope

**In:** a small TypeScript package with data types, normalisation, matching, scaling, storage (versioned), export/import validation, and accessible UI helpers (dialog, tabs, announcer).
**Out:** a general-purpose framework, backend sync.

## 5. Roadmap

**M0 — Unblock**

- [ ] (S) Write the shared data model on paper: `Item`, `Ingredient`, `Recipe`, `ShoppingEntry`, quantities and units
- [ ] (S) Map existing stored shapes in both apps to the model; list differences

**M1 — Ship**

- [ ] (M) Implement `normaliseName`, `matchRecipes(items, recipes)` returning `can-make`, `missing-one`, `missing-many`
- [ ] (M) Implement `scale(recipe, factor)` with unit-aware rounding
- [ ] (M) Implement `storage` (load/save with version, migration hooks, failure state) and `export/import` with schema validation
- [ ] (S) Vitest suites for all of the above

**M2 — Harden**

- [ ] (M) Accessible `Dialog`, `Tabs`, `LiveAnnouncer` helpers (framework-free) and tests with a DOM environment
- [ ] (M) Migrate `spice-cupboard` first, then `mini-bar`, keeping old storage keys readable (one-time migration)
- [ ] (S) Document the package in its README

**M3 — Extend**

- [ ] (M) Third app on the same core (e.g. pantry or tea cupboard) to validate the design
- [ ] (M) Optional sync adapter interface (no implementation until a privacy decision)

## 6. Technical approach

Pure functions + small DOM helpers; no framework dependency. Apps import the package via workspace dependency and build with Vite or the chosen static pipeline (plan 00 D2). Keep the on-disk format versioned (`schemaVersion`), with a migration from each legacy key.

## 7. Quality gates

Definition of Done for each consuming app; plus a migration test that loads sample legacy data from both apps.

## 8. Dependencies

Plan 00 (build template, CI); plans 05 and 06 (consumers).

## 9. Open decisions

- **D1.** Create the package before or during the first migration? _Recommend during the spice-cupboard migration; extract only what is needed by both._
- **D2.** Keep legacy storage keys or move to one shared key? _Recommend per-app keys with a shared `schemaVersion`._

## 10. Success measures

Both apps use the same tested matching/scaling/storage code; duplicate logic removed; legacy data migrates without loss.
