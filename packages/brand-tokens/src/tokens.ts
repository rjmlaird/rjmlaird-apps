/**
 * Canonical brand tokens: the single source of truth.
 *
 * Everything else (CSS custom properties, the static css/brand.css, the favicon
 * set and the reference page) is generated from the values in this file.
 * Change a value here, run `pnpm --filter @rjmlaird/brand-tokens generate`,
 * and `pnpm --filter @rjmlaird/brand-tokens check` fails if the committed
 * output is stale.
 *
 * Values marked "proposed" are not part of the supplied global.css. They were
 * added so the semantic layer is complete and should be reviewed.
 */

/** Core palette. Names are descriptive, not semantic. */
export const palette = {
  bg: "#0B0F1A",
  bgAlt: "#0F1520",
  surface: "#141B29",
  surfaceRaised: "#1A2236",
  text: "#EDEAE3",
  textMuted: "#9AA4B8",
  teal: "#00C2A8",
  /** Carried over from the existing apps index; not in global.css. */
  tealHover: "#30D6BF",
  amber: "#F5A623",
  violet: "#A78BFA",
  coral: "#FF8080",
  green: "#4ADE80",
  sky: "#38BDF8",
  focus: "#7FE6D4",
  /**
   * Proposed. Boundary colour for form controls. The decorative border below is
   * deliberately faint and does not reach the 3:1 non-text contrast needed to
   * identify an input, so controls use this instead.
   */
  borderStrong: "#6B7894",
} as const;

export type PaletteKey = keyof typeof palette;

/** Decorative hairline (cards, dividers). Not for identifying controls. */
export const border = "rgba(237, 234, 227, 0.08)";

export const fonts = {
  display: `"Space Grotesk", system-ui, sans-serif`,
  body: `"Inter", system-ui, sans-serif`,
  mono: `"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace`,
} as const;

/** Google Fonts stylesheet covering every font role. */
export const fontImportUrl =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

export const layout = {
  contentMax: "1320px",
  gutter: "1.5rem",
  /** Gutter at or below the narrow breakpoint. */
  gutterNarrow: "1rem",
  narrowBreakpoint: "560px",
  radius: "6px",
  radiusPill: "999px",
} as const;

/** Proposed 4px-based spacing scale. */
export const space = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.5rem",
  6: "2rem",
  7: "3rem",
  8: "4rem",
} as const;

/**
 * Semantic roles for the dark theme. Components must consume these, never the
 * palette directly. The role assignments are proposed, not an approved spec.
 *
 * A light theme is intentionally absent: its values must be chosen and
 * contrast-tested, not derived by inverting this palette.
 */
export const semantic = {
  "color-bg": "bg",
  "color-bg-alt": "bgAlt",
  "color-surface": "surface",
  "color-surface-raised": "surfaceRaised",
  "color-text": "text",
  "color-text-muted": "textMuted",
  /** Primary actions, active navigation, brand emphasis. */
  "color-primary": "teal",
  "color-primary-hover": "tealHover",
  /** Text on a primary-coloured surface. */
  "color-on-primary": "bg",
  /** Secondary emphasis, highlights, in-progress or selected states. */
  "color-highlight": "amber",
  /** Informational status and data visualisation. */
  "color-info": "sky",
  /** Success and completed states. */
  "color-success": "green",
  /** Errors and destructive actions. */
  "color-danger": "coral",
  /** Secondary categories and specialised content. */
  "color-category": "violet",
  "color-focus": "focus",
  "color-border-strong": "borderStrong",
} as const satisfies Record<string, PaletteKey>;

export type SemanticRole = keyof typeof semantic;

/** Resolve a semantic role to its hex value. */
export function resolve(role: SemanticRole): string {
  return palette[semantic[role]];
}

/** Surfaces that text is expected to sit on. Used by the contrast checks. */
export const surfaces = [
  "bg",
  "bgAlt",
  "surface",
  "surfaceRaised",
] as const satisfies readonly PaletteKey[];

/** Foreground roles that appear as text on the surfaces above. */
export const textRoles = [
  "color-text",
  "color-text-muted",
  "color-primary",
  "color-primary-hover",
  "color-highlight",
  "color-info",
  "color-success",
  "color-danger",
  "color-category",
] as const satisfies readonly SemanticRole[];

/** One-line job for each semantic role. Shown on the reference page. */
export const roleJobs: Record<SemanticRole, string> = {
  "color-bg": "Page background",
  "color-bg-alt": "Alternate page band or inset area",
  "color-surface": "Cards and panels",
  "color-surface-raised": "Raised panels, menus, buttons at rest",
  "color-text": "Primary text",
  "color-text-muted": "Secondary text, captions, help text",
  "color-primary": "Primary actions, active navigation, brand emphasis",
  "color-primary-hover": "Hover state of primary actions",
  "color-on-primary": "Text and icons on a primary-coloured surface",
  "color-highlight": "Secondary emphasis, in-progress and selected states",
  "color-info": "Informational status, data series",
  "color-success": "Success and completed states",
  "color-danger": "Errors and destructive actions",
  "color-category": "Secondary categories, specialised content",
  "color-focus": "Keyboard focus indicator",
  "color-border-strong": "Boundaries of form controls (3:1 non-text contrast)",
};
