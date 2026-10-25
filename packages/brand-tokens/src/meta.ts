import { palette } from "./tokens";

/** Hostname family every app lives under. */
export const SITE = "apps.rjmlaird.co.uk";
export const SITE_NAME = "rjmlaird apps";

export interface AppMeta {
  /** Product name. Used for the document title and should match the page's <h1>. */
  name: string;
  /** One or two sentences, plain English. */
  description: string;
  /** Favicon URL. Defaults to /favicon.svg. */
  faviconHref?: string;
  /** e.g. "noindex" for internal pages. */
  robots?: string;
}

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 160;

/** Title convention: "<Product name> · apps.rjmlaird.co.uk". */
export function pageTitle(name: string): string {
  return `${name} · ${SITE}`;
}

/** Returns a list of problems. Empty means the metadata follows the convention. */
export function validateMeta(meta: AppMeta): string[] {
  const problems: string[] = [];
  const name = meta.name.trim();
  if (!name) problems.push("name is empty");
  if (name !== meta.name) problems.push("name has leading or trailing whitespace");
  if (pageTitle(name).length > TITLE_MAX) problems.push(`title is longer than ${TITLE_MAX} characters`);
  const d = meta.description.trim();
  if (d.length < DESCRIPTION_MIN) problems.push(`description is shorter than ${DESCRIPTION_MIN} characters`);
  if (d.length > DESCRIPTION_MAX) problems.push(`description is longer than ${DESCRIPTION_MAX} characters`);
  if (!/[.!?]$/.test(d)) problems.push("description should end with a full stop");
  if (/\s{2,}/.test(d)) problems.push("description contains repeated whitespace");
  return problems;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The shared <head> block every app should emit: charset, viewport, title,
 * description, theme colour, colour scheme, favicon and Open Graph basics.
 */
export function headTags(meta: AppMeta): string {
  const title = escapeHtml(pageTitle(meta.name));
  const description = escapeHtml(meta.description);
  const icon = escapeHtml(meta.faviconHref ?? "/favicon.svg");
  const tags = [
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="theme-color" content="${palette.bg}" />`,
    `<meta name="color-scheme" content="dark" />`,
    ...(meta.robots ? [`<meta name="robots" content="${escapeHtml(meta.robots)}" />`] : []),
    `<link rel="icon" type="image/svg+xml" href="${icon}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
  ];
  return tags.join("\n");
}
