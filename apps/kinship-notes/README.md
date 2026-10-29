# Kinship Notes

A local-first genealogy research workspace for **kinship-notes.apps.rjmlaird.co.uk**. Import a GEDCOM, explore the family as a tree, and attach private research notes, questions, tasks and hypotheses to each person. The GEDCOM is never rewritten or uploaded: everything stays in the browser's `localStorage`, and the Worker only serves static assets.

## Views

- **Record & notes**: person details, immediate relatives, and per-person annotations.
- **Family tree**: whole tree (every person, one row per generation), hourglass, pedigree, descendants, and a radial fan chart. Pan/zoom, generation limits, jump-to-person.

## Commands

```sh
pnpm --filter ./apps/kinship-notes dev        # Vite dev server
pnpm --filter ./apps/kinship-notes test       # parser and layout tests (vitest)
pnpm --filter ./apps/kinship-notes typecheck  # app + worker
pnpm --filter ./apps/kinship-notes build      # tsc + vite build into dist/
pnpm --filter ./apps/kinship-notes run cf:dev     # wrangler dev against dist/
pnpm --filter ./apps/kinship-notes run deploy  # build + wrangler deploy
```

`samples/sample-77-people.ged` is a synthetic tree for trying every view.

## How it works

- `src/gedcom.ts`: level-aware GEDCOM reader. Reconciles one-sided FAMC/FAMS/CHIL links and drops dangling references.
- `src/tree.ts`: pure layout engine (no DOM), covered by `tree.test.ts`.
- `src/TreeView.tsx`: SVG rendering with pan/zoom.
- `src/App.tsx`: import, search, notes. Notes are stored per source filename with a content fingerprint, so a changed file triggers a warning rather than silently re-attaching notes.

## Data and privacy

Notes and the imported GEDCOM live in `localStorage` on the device. Nothing is uploaded and the original file is never modified. Clearing site data removes them, so export notes before doing that.

## Known limits

- UTF-8 GEDCOM only (ANSEL and UTF-16 files will show garbled names).
- A few thousand people are fine; tens of thousands need viewport culling.
- `localStorage` is about 5 MB per origin; very large files cannot be persisted (the app warns and offers a notes export).
- Notes are device-local. There is no sync.
