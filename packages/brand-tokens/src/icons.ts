import { palette } from "./tokens";

/**
 * Product icon convention: the parent-brand tile (dark rounded square), a
 * single teal line-art glyph, and at most one amber accent. Same stroke weight
 * and 32x32 grid for every product so the family reads as one, while each
 * glyph stays recognisable in a browser tab.
 */
interface Glyph {
  /** Teal stroked line art, drawn inside a group with the shared stroke style. */
  line: string;
  /** One amber accent element with its own fill or stroke. */
  accent: string;
}

const amberFill = `fill="${palette.amber}" stroke="none"`;
const amberStroke = `fill="none" stroke="${palette.amber}" stroke-width="2.4" stroke-linecap="round"`;

const GLYPHS = {
  /** The apps index itself: a grid of tools. */
  index: {
    line: `<rect x="7" y="7" width="7" height="7" rx="1.5"/><rect x="18" y="7" width="7" height="7" rx="1.5"/><rect x="7" y="18" width="7" height="7" rx="1.5"/>`,
    accent: `<circle cx="21.5" cy="21.5" r="3.6" ${amberFill}/>`,
  },
  /** The original orbit motif, kept for AstroDash. Also the fallback. */
  astrodash: {
    line: `<ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(-25 16 16)"/>`,
    accent: `<circle cx="16" cy="16" r="3.4" ${amberFill}/>`,
  },
  weatherdash: {
    line: `<path d="M9 24a4 4 0 0 1 .4-7.98A6 6 0 0 1 21 14.8 4.6 4.6 0 0 1 21 24z"/>`,
    accent: `<circle cx="24" cy="8.5" r="3" ${amberFill}/>`,
  },
  launches: {
    line: `<path d="M16 5c3.8 3 5 8 4 14h-8c-1-6 .2-11 4-14z"/><path d="M12 19l-3 4 3.2-1M20 19l3 4-3.2-1"/><circle cx="16" cy="12" r="1.6"/>`,
    accent: `<path d="M14.4 22.5h3.2L16 27.5z" ${amberFill}/>`,
  },
  "mini-bar": {
    line: `<path d="M7 8h18l-9 10z"/><path d="M16 18v7M11 25h10"/>`,
    accent: `<circle cx="22.5" cy="6.5" r="2.4" ${amberFill}/>`,
  },
  "spice-cupboard": {
    line: `<path d="M11 5.5h10v3.5H11z"/><path d="M10 9h12v16a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"/>`,
    accent: `<rect x="12.5" y="14" width="7" height="6" rx="1.2" ${amberFill}/>`,
  },
  "kinship-notes": {
    line: `<circle cx="9" cy="23" r="3"/><circle cx="23" cy="23" r="3"/><path d="M16 11.5v4M16 15.5H9.5V20M16 15.5h6.5V20"/>`,
    accent: `<circle cx="16" cy="8.5" r="3.4" ${amberFill}/>`,
  },
  "first-aid-kit": {
    line: `<rect x="5.5" y="10" width="21" height="16" rx="2.5"/><path d="M12 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
    accent: `<path d="M16 14v8M12 18h8" ${amberStroke}/>`,
  },
} as const satisfies Record<string, Glyph>;

export type ProductIconId = keyof typeof GLYPHS;

export const productIconIds = Object.keys(GLYPHS) as ProductIconId[];

export function hasProductIcon(id: string): id is ProductIconId {
  return Object.hasOwn(GLYPHS, id);
}

/** Standalone SVG favicon for a product. Unknown ids get the generic orbit motif. */
export function productFavicon(id: string): string {
  const glyph: Glyph = hasProductIcon(id) ? GLYPHS[id] : GLYPHS.astrodash;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="7" fill="${palette.bg}"/>` +
    `<g fill="none" stroke="${palette.teal}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph.line}</g>` +
    glyph.accent +
    `</svg>`
  );
}
