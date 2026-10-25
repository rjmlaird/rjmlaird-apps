# Plan 05 — Spice Cupboard & Mix Manager (`apps/spice-cupboard`)

| Field | Value |
|---|---|
| Plan status | Draft |
| Registry status | `active` (updated 2026-10-11) |
| Route | `spice-cupboard.apps.rjmlaird.co.uk` |
| Dev ports | Vite default |
| Stack | Single 73 KB `index.html` (vanilla JS, Tailwind Play CDN, Font Awesome from cdnjs, Google Fonts); `localStorage` |
| Priority | P1 (listed as active) |
| Total effort | ≈ 6–8 days |
| Last reviewed | 2026-10-21 |

## 1. Purpose and users
Track the spices you own and see which spice mixes you can make now or are one ingredient short of, with batch scaling. A personal household utility with data stored only in the browser.

## 2. Current state (evidence)
- Two tabs, Cupboard and Mixes; add/edit spice modal; reset to default spices; mix detail modal with scale buttons (1x…); data under one key, `spice_cupboard_data`.
- Styling by `cdn.tailwindcss.com` at runtime (with an inline `tailwind.config`), icons from `cdnjs.cloudflare.com` (Font Awesome 6.4.0), fonts from Google Fonts.
- 18 inline `onclick` handlers, 11 `innerHTML` assignments, an `esc`-type helper (1), and **0 ARIA/role attributes**; two `confirm`/`alert` calls; no `prefers-reduced-motion` or colour-scheme handling.
- `package.json` is named `spice-cupboard` with `deploy` and `cf:dev` scripts; unused React scaffold; no tests.

## 3. Gaps and risks
| Gap/risk | Rating |
|---|---|
| Tailwind Play CDN is not intended for production; adds ~hundreds of KB and a render-blocking third-party script | High |
| No accessibility semantics (tabs, modals, buttons via `onclick` on non-semantic elements) | High |
| Data only in `localStorage`: no backup/import (this app) → risk of silent loss | High |
| Mix-matching and scaling logic untested | Med |
| `alert`/`confirm` for destructive actions | Low |

## 4. Scope
**In:** production CSS, accessibility, data safety (export/import), tested matching/scaling, shared core with mini-bar (plan 07).
**Out:** accounts, cloud sync, barcode scanning.

## 5. Roadmap
**M0 — Unblock**
- [ ] (S) Fix package name conflicts (this app's name is also used by `mini-bar`)
- [ ] (S) README: data model, storage key, limitations ("data stays in your browser")
- [ ] (S) Add a visible "back up your data" export (JSON) button

**M1 — Ship**
- [ ] (M) Replace Tailwind CDN with a built, purged stylesheet (Tailwind CLI/Vite plugin) or hand-written CSS; self-host icons (inline SVG)
- [ ] (M) Convert modals to `<dialog>` (focus trap, Esc, return focus); tabs to ARIA tabs; buttons to real `<button>`s with labels; remove inline `onclick`
- [ ] (S) Import JSON with validation and a preview/undo
- [ ] (S) Replace `alert`/`confirm` with accessible confirmation

**M2 — Harden**
- [ ] (M) Extract data model and matching/scaling into a module; unit tests (exact match, one missing ingredient, unit scaling, rounding, empty cupboard)
- [ ] (S) Versioned storage (`spice_cupboard_data:v1`) with migration and storage-failure message
- [ ] (S) `prefers-color-scheme` and `prefers-reduced-motion`
- [ ] (S) Page-weight check; remove Google Fonts or self-host

**M3 — Extend**
- [ ] (M) Custom mix creation with quantities and units; shopping list from "one short"
- [ ] (M) Print layout for mix recipes
- [ ] (L) Optional cloud sync (only after a privacy decision)

## 6. Technical approach
Separate `model.ts` (spices, mixes, matching, scaling), `storage.ts` (versioned load/save/import/export) and `view` code. Keep all quantity arithmetic in integer-friendly units to avoid float display noise. Share these modules with `mini-bar` (plan 07).

## 7. Quality gates
Definition of Done; keyboard-only run-through of add spice → find mix → scale → export.

## 8. Dependencies
Plans 00 and 07; shared tokens (plan 00 M2).

## 9. Open decisions
- **D1.** Keep Tailwind (built) or move to plain CSS? *Recommend built Tailwind with purge if kept, else shared tokens + plain CSS.*
- **D2.** Cloud sync? *Recommend no; export/import only.*

## 10. Success measures
No third-party runtime scripts; tests cover matching/scaling; keyboard and screen-reader pass; user can restore data from an export.
