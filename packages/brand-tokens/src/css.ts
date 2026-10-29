import { border, fontImportUrl, fonts, layout, palette, semantic, space } from "./tokens";

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Must be the first rule in a stylesheet. */
export const fontImportCss = `@import url("${fontImportUrl}");`;

/** Core and semantic tokens as CSS custom properties on :root. */
export function tokensCss(): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(palette))
    lines.push(`--palette-${kebab(key)}: ${value};`);
  lines.push(`--color-border: ${border};`);
  for (const [role, key] of Object.entries(semantic))
    lines.push(`--${role}: var(--palette-${kebab(key)});`);
  lines.push(`--font-display: ${fonts.display};`);
  lines.push(`--font-body: ${fonts.body};`);
  lines.push(`--font-mono: ${fonts.mono};`);
  lines.push(`--content-max: ${layout.contentMax};`);
  lines.push(`--page-gutter: ${layout.gutter};`);
  lines.push(`--radius: ${layout.radius};`);
  lines.push(`--radius-pill: ${layout.radiusPill};`);
  for (const [step, value] of Object.entries(space))
    lines.push(`--space-${step}: ${value};`);
  return [
    `:root {`,
    ...lines.map((l) => `  ${l}`),
    `  color-scheme: dark;`,
    `}`,
    `@media (max-width: ${layout.narrowBreakpoint}) {`,
    `  :root {`,
    `    --page-gutter: ${layout.gutterNarrow};`,
    `  }`,
    `}`,
  ].join("\n");
}

/**
 * Neutral, class-based primitives. Everything is prefixed `rj-` or scoped under
 * `.rj-app`, so including this in an application cannot restyle bare elements.
 * `.is-hover` and `.is-focus` exist so the reference page can show those states.
 */
export const primitivesCss = `
.rj-app { background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); line-height: 1.6; }
.rj-app *, .rj-app *::before, .rj-app *::after { box-sizing: border-box; }
.rj-app :focus-visible, .rj-app .is-focus { outline: 3px solid var(--color-focus); outline-offset: 3px; }

.rj-wrap { width: min(100% - (var(--page-gutter) * 2), var(--content-max)); margin-inline: auto; }
.rj-heading { margin: 0; font-family: var(--font-display); letter-spacing: -0.01em; line-height: 1.2; }
.rj-mono { font-family: var(--font-mono); }
.rj-muted { color: var(--color-text-muted); }
.rj-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

.rj-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; min-height: 44px; min-width: 44px; padding: 0.5rem 1rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius); background: var(--color-surface-raised); color: var(--color-text); font: 600 0.92rem/1.2 var(--font-body); text-decoration: none; cursor: pointer; transition: background-color 0.15s, border-color 0.15s; }
.rj-btn:hover, .rj-btn.is-hover { border-color: var(--color-primary); }
.rj-btn--primary { border-color: var(--color-primary); background: var(--color-primary); color: var(--color-on-primary); }
.rj-btn--primary:hover, .rj-btn--primary.is-hover { border-color: var(--color-primary-hover); background: var(--color-primary-hover); }
.rj-btn--danger { border-color: var(--color-danger); color: var(--color-danger); }
.rj-btn--danger:hover, .rj-btn--danger.is-hover { background: var(--color-danger); color: var(--color-on-primary); }
.rj-btn:disabled, .rj-btn[aria-disabled="true"] { border-style: dashed; background: transparent; color: var(--color-text-muted); cursor: not-allowed; }

.rj-card { padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); }
.rj-card--raised { background: var(--color-surface-raised); }

.rj-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.15rem 0.6rem; border: 1px solid currentColor; border-radius: var(--radius-pill); color: var(--color-text-muted); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
.rj-badge--success { color: var(--color-success); }
.rj-badge--info { color: var(--color-info); }
.rj-badge--warning { color: var(--color-highlight); }
.rj-badge--danger { color: var(--color-danger); }
.rj-badge--success::before { content: "\\2713"; content: "\\2713" / ""; }
.rj-badge--info::before { content: "\\25CF"; content: "\\25CF" / ""; }
.rj-badge--warning::before { content: "\\25B2"; content: "\\25B2" / ""; }
.rj-badge--danger::before { content: "\\2715"; content: "\\2715" / ""; }

.rj-field { display: grid; gap: 0.4rem; }
.rj-label { color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500; }
.rj-input { width: 100%; min-height: 44px; padding: 0.55rem 0.75rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius); background: var(--color-bg); color: var(--color-text); font: inherit; }
.rj-input::placeholder { color: var(--color-text-muted); }
.rj-input:hover, .rj-input.is-hover { border-color: var(--color-primary); }
.rj-input[aria-invalid="true"] { border-color: var(--color-danger); }
.rj-input:disabled { border-style: dashed; color: var(--color-text-muted); cursor: not-allowed; }
.rj-help { margin: 0; color: var(--color-text-muted); font-size: 0.82rem; }
.rj-error { margin: 0; color: var(--color-danger); font-size: 0.82rem; font-weight: 600; }
.rj-error::before { content: "Error: "; }

@media (prefers-reduced-motion: reduce) {
  .rj-app *, .rj-app *::before, .rj-app *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
`.trim();

/** The complete static stylesheet written to css/brand.css. */
export function brandCss(): string {
  return `${fontImportCss}\n\n${tokensCss()}\n\n${primitivesCss}\n`;
}
