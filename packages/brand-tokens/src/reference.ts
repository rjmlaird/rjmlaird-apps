import { brandCss } from "./css";
import { AA, contrastRatio } from "./contrast";
import { hasProductIcon, productFavicon, productIconIds } from "./icons";
import { headTags } from "./meta";
import { fonts, layout, palette, resolve, roleJobs, semantic, space, surfaces, type PaletteKey, type SemanticRole } from "./tokens";

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const referenceCss = `
.ref-section { margin-block: var(--space-7); }
.ref-section > h2 { margin-bottom: var(--space-2); font-size: 1.5rem; }
.ref-section > p { max-width: 70ch; }
.ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4); }
.ref-swatch { height: 56px; border: 1px solid var(--color-border); border-radius: var(--radius); }
.ref-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.ref-table th, .ref-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: left; vertical-align: top; }
.ref-table th { color: var(--color-text-muted); font-weight: 600; }
.ref-scroll { overflow-x: auto; }
.ref-row { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
.ref-icon { width: 64px; height: 64px; }
.ref-icon svg { width: 100%; height: 100%; display: block; }
.ref-pre { overflow-x: auto; padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg-alt); font: 0.82rem/1.5 var(--font-mono); }
.ref-pass { color: var(--color-success); font-weight: 600; }
.ref-fail { color: var(--color-danger); font-weight: 600; }
`.trim();

function ratioCell(fg: string, bg: string, threshold: number): string {
  const r = contrastRatio(fg, bg);
  const ok = r >= threshold;
  return `<td><span class="${ok ? "ref-pass" : "ref-fail"}">${r.toFixed(2)}:1 ${ok ? "pass" : "FAIL"}</span></td>`;
}

function paletteSection(): string {
  const surfaceKeys = new Set<string>(surfaces);
  const rows = (Object.keys(palette) as PaletteKey[])
    .map((key) => {
      const hex = palette[key];
      const threshold = key === "borderStrong" ? AA.nonText : AA.text;
      const cells = surfaceKeys.has(key)
        ? surfaces.map(() => `<td class="rj-muted">surface</td>`).join("")
        : surfaces.map((s) => ratioCell(hex, palette[s], threshold)).join("");
      return `<tr><td><div class="ref-swatch" style="background:${hex}" role="img" aria-label="${esc(key)} swatch"></div></td><td><code class="rj-mono">--palette-${kebab(key)}</code></td><td><code class="rj-mono">${hex}</code></td>${cells}</tr>`;
    })
    .join("");
  const heads = surfaces.map((s) => `<th scope="col">On ${esc(s)}</th>`).join("");
  return `<section class="ref-section" aria-labelledby="palette"><h2 class="rj-heading" id="palette">Core palette</h2>
<p class="rj-muted">Contrast is each colour against each surface, tested against WCAG 2.2 AA: ${AA.text}:1 for text, ${AA.nonText}:1 for the non-text border colour. Surfaces are backgrounds, not foregrounds, so they are not tested against each other.</p>
<div class="ref-scroll"><table class="ref-table"><thead><tr><th scope="col">Swatch</th><th scope="col">Token</th><th scope="col">Value</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function semanticSection(): string {
  const rows = (Object.keys(semantic) as SemanticRole[])
    .map(
      (role) =>
        `<tr><td><code class="rj-mono">--${role}</code></td><td><code class="rj-mono">${resolve(role)}</code></td><td>${esc(roleJobs[role])}</td></tr>`,
    )
    .join("");
  return `<section class="ref-section" aria-labelledby="semantic"><h2 class="rj-heading" id="semantic">Semantic roles</h2>
<p class="rj-muted">Components consume these, not the palette. The role assignments are proposed. Never use colour alone to carry meaning: every status below also has a text label and a distinct shape.</p>
<div class="ref-scroll"><table class="ref-table"><thead><tr><th scope="col">Role</th><th scope="col">Resolves to</th><th scope="col">Job</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function typeSection(): string {
  return `<section class="ref-section" aria-labelledby="type"><h2 class="rj-heading" id="type">Font roles</h2>
<div class="ref-grid">
<div class="rj-card"><p class="rj-muted">Display · <code class="rj-mono">--font-display</code></p><p class="rj-heading" style="font-size:2rem">Space Grotesk</p><p class="rj-muted">${esc(fonts.display)}</p></div>
<div class="rj-card"><p class="rj-muted">Body · <code class="rj-mono">--font-body</code></p><p style="font-size:1.25rem;margin:0">Inter for interface text</p><p class="rj-muted">${esc(fonts.body)}</p></div>
<div class="rj-card"><p class="rj-muted">Mono · <code class="rj-mono">--font-mono</code></p><p class="rj-mono" style="font-size:1.1rem;margin:0">0.00123 km/s · id-4821</p><p class="rj-muted">${esc(fonts.mono)}</p></div>
</div></section>`;
}

function layoutSection(): string {
  const spaces = Object.entries(space)
    .map(([k, v]) => `<tr><td><code class="rj-mono">--space-${k}</code></td><td>${v}</td><td><div style="height:12px;width:${v};background:var(--color-primary);border-radius:2px"></div></td></tr>`)
    .join("");
  return `<section class="ref-section" aria-labelledby="layout"><h2 class="rj-heading" id="layout">Layout, radius and spacing</h2>
<p class="rj-muted">Content maximum <code class="rj-mono">${layout.contentMax}</code>, gutter <code class="rj-mono">${layout.gutter}</code> (<code class="rj-mono">${layout.gutterNarrow}</code> at ${layout.narrowBreakpoint} and below), radius <code class="rj-mono">${layout.radius}</code>. The spacing scale is proposed.</p>
<div class="ref-scroll"><table class="ref-table"><thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Sample</th></tr></thead><tbody>${spaces}</tbody></table></div></section>`;
}

function componentSection(): string {
  return `<section class="ref-section" aria-labelledby="components"><h2 class="rj-heading" id="components">Components and states</h2>
<p class="rj-muted">Hover and focus are forced with <code class="rj-mono">.is-hover</code> and <code class="rj-mono">.is-focus</code> for display. Real controls respond to the pointer and keyboard as normal.</p>
<h3 class="rj-heading" style="margin-top:var(--space-5)">Buttons</h3>
<div class="ref-row">
<button class="rj-btn rj-btn--primary" type="button">Primary</button>
<button class="rj-btn rj-btn--primary is-hover" type="button">Primary hover</button>
<button class="rj-btn rj-btn--primary is-focus" type="button">Primary focus</button>
<button class="rj-btn" type="button">Secondary</button>
<button class="rj-btn is-hover" type="button">Secondary hover</button>
<button class="rj-btn rj-btn--danger" type="button">Delete</button>
<button class="rj-btn" type="button" disabled>Disabled</button>
</div>
<h3 class="rj-heading" style="margin-top:var(--space-5)">Status badges</h3>
<div class="ref-row">
<span class="rj-badge">Planned</span>
<span class="rj-badge rj-badge--info">Info</span>
<span class="rj-badge rj-badge--success">Active</span>
<span class="rj-badge rj-badge--warning">In progress</span>
<span class="rj-badge rj-badge--danger">Expired</span>
</div>
<h3 class="rj-heading" style="margin-top:var(--space-5)">Form fields</h3>
<div class="ref-grid">
<div class="rj-field"><label class="rj-label" for="f1">Default</label><input class="rj-input" id="f1" placeholder="Placeholder" /><p class="rj-help">Help text sits here.</p></div>
<div class="rj-field"><label class="rj-label" for="f2">Hover</label><input class="rj-input is-hover" id="f2" value="Value" /></div>
<div class="rj-field"><label class="rj-label" for="f3">Focus</label><input class="rj-input is-focus" id="f3" value="Value" /></div>
<div class="rj-field"><label class="rj-label" for="f4">Invalid</label><input class="rj-input" id="f4" value="12/13/2026" aria-invalid="true" aria-describedby="f4e" /><p class="rj-error" id="f4e">Enter a valid date.</p></div>
<div class="rj-field"><label class="rj-label" for="f5">Disabled</label><input class="rj-input" id="f5" value="Unavailable" disabled /></div>
</div>
<h3 class="rj-heading" style="margin-top:var(--space-5)">Cards</h3>
<div class="ref-grid">
<div class="rj-card"><h4 class="rj-heading">Surface card</h4><p class="rj-muted" style="margin-bottom:0">Default card on the page background.</p></div>
<div class="rj-card rj-card--raised"><h4 class="rj-heading">Raised card</h4><p class="rj-muted" style="margin-bottom:0">For menus and panels sitting on a card.</p></div>
</div></section>`;
}

function iconSection(): string {
  const items = productIconIds
    .map((id) => `<figure style="margin:0;text-align:center"><div class="ref-icon" role="img" aria-label="${esc(id)} icon">${productFavicon(id)}</div><figcaption class="rj-muted" style="font-size:0.8rem">${esc(id)}</figcaption></figure>`)
    .join("");
  return `<section class="ref-section" aria-labelledby="icons"><h2 class="rj-heading" id="icons">Product icons</h2>
<p class="rj-muted">Convention: parent-brand dark tile, one teal line-art glyph on a 32px grid at 2px stroke, and at most one amber accent. Generated by <code class="rj-mono">productFavicon(id)</code>; unknown ids fall back to the orbit motif.</p>
<div class="ref-row" style="gap:var(--space-6)">${items}</div></section>`;
}

function metaSection(): string {
  const sample = headTags({ name: "Example App", description: "A one or two sentence description in plain English." });
  return `<section class="ref-section" aria-labelledby="meta"><h2 class="rj-heading" id="meta">Metadata convention</h2>
<p class="rj-muted">Title is <code class="rj-mono">&lt;Product name&gt; · apps.rjmlaird.co.uk</code>. Every app should emit this block via <code class="rj-mono">headTags()</code>; <code class="rj-mono">validateMeta()</code> checks name and description.</p>
<pre class="ref-pre"><code>${esc(sample)}</code></pre></section>`;
}

/** Self-contained reference page for the tokens, roles, components and icons. */
export function referencePage(): string {
  const meta = headTags({
    name: "Brand reference",
    description: "Design tokens, semantic roles, components and product icons shared by the apps on apps.rjmlaird.co.uk.",
    robots: "noindex",
  });
  const iconCount = productIconIds.filter(hasProductIcon).length;
  return `<!doctype html>
<html lang="en-GB">
<head>
${meta}
<style>
${brandCss()}
${referenceCss}
body { margin: 0; }
</style>
</head>
<body class="rj-app">
<header class="rj-wrap" style="padding-block:var(--space-7) var(--space-4)">
<p class="rj-muted rj-mono" style="margin:0">apps.rjmlaird.co.uk / brand</p>
<h1 class="rj-heading" style="font-size:clamp(2rem,5vw,3rem)">Brand reference</h1>
<p class="rj-muted" style="max-width:62ch">Generated from <code class="rj-mono">@rjmlaird/brand-tokens</code>. ${iconCount} product icons. Dark theme only; a light theme needs its own contrast-tested values.</p>
</header>
<main class="rj-wrap">
${paletteSection()}
${semanticSection()}
${typeSection()}
${layoutSection()}
${componentSection()}
${iconSection()}
${metaSection()}
</main>
<footer class="rj-wrap rj-muted" style="padding-block:var(--space-6)"><p>Proposed values are labelled in the source and need review before they are treated as approved.</p></footer>
</body>
</html>
`;
}
