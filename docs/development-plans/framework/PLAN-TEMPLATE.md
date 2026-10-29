# Plan NN — <App name>

> Copy this file to `plans/NN-<app-id>.md`. Keep `<app-id>` identical to the `apps/` folder name and the `id` in `apps/index/src/apps.ts`.

| Field           | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Plan status     | Draft / Agreed / In delivery / Done                                |
| Registry status | `planned` / `in-progress` / `active` / `archived` (from `apps.ts`) |
| Route           | `<id>.apps.rjmlaird.co.uk` (custom domain)                         |
| Dev ports       | `<port>` / `<inspector port>`                                      |
| Stack           | e.g. TypeScript, Hono, Cloudflare Workers                          |
| Priority        | P0 (blocking) · P1 (next) · P2 (later)                             |
| Total effort    | Sum of milestone sizes (S ≈ ≤½ day, M ≈ 1–2 days, L ≈ 3–5 days)    |
| Last reviewed   | YYYY-MM-DD                                                         |

## 1. Purpose and users

One short paragraph: what problem the tool solves, who uses it, and what "good" looks like for them.

## 2. Current state (evidence)

Facts observed in the repo or in production. No opinions here — cite files.

## 3. Gaps and risks

What is missing, inconsistent or likely to break. Rate each **High / Med / Low**.

## 4. Scope

**In scope** — what this plan will deliver.
**Out of scope** — what it deliberately will not (stops scope creep).

## 5. Roadmap

Four fixed milestones, so every plan reads the same way:

- **M0 — Unblock**: fix anything that stops the tool building, deploying or being found.
- **M1 — Ship**: the smallest version that meets the purpose and can be flipped to `active`.
- **M2 — Harden**: tests, validation, accessibility, performance, docs.
- **M3 — Extend**: optional improvements, only after M2.

Each task: `- [ ] (S|M|L) Task description`.

## 6. Technical approach

Architecture, data sources, formulas/models, API shape, key libraries, and why.

## 7. Quality gates

Link to `framework/DEFINITION-OF-DONE.md`, then list anything specific to this tool.

## 8. Dependencies

Other plans, shared packages, external services, licences, data.

## 9. Open decisions

Numbered questions with a recommended default, so a decision can be a one-word answer.

## 10. Success measures

How you will know it worked (a few measurable, low-effort signals).
