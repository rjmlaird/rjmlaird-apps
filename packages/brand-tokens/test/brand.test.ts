import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AA,
  brandCss,
  contrastRatio,
  headTags,
  hasProductIcon,
  palette,
  pageTitle,
  productFavicon,
  productIconIds,
  referencePage,
  resolve,
  semantic,
  surfaces,
  textRoles,
  tokensCss,
  validateMeta,
  type SemanticRole,
} from "../src/index";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("contrast", () => {
  it("computes known WCAG ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("keeps every text role at AA (4.5:1) on every surface", () => {
    for (const role of textRoles) {
      for (const s of surfaces) {
        const r = contrastRatio(resolve(role), palette[s]);
        expect(r, `${role} on ${s}`).toBeGreaterThanOrEqual(AA.text);
      }
    }
  });

  it("keeps on-primary text at AA on primary and its hover", () => {
    for (const bg of ["color-primary", "color-primary-hover"] as SemanticRole[]) {
      expect(contrastRatio(resolve("color-on-primary"), resolve(bg)), bg).toBeGreaterThanOrEqual(AA.text);
    }
  });

  it("keeps focus and control borders at 3:1 on every surface", () => {
    for (const role of ["color-focus", "color-border-strong"] as SemanticRole[]) {
      for (const s of surfaces) {
        expect(contrastRatio(resolve(role), palette[s]), `${role} on ${s}`).toBeGreaterThanOrEqual(AA.nonText);
      }
    }
  });
});

describe("tokens", () => {
  it("matches the canonical values supplied for the brand", () => {
    expect(palette.bg).toBe("#0B0F1A");
    expect(palette.surface).toBe("#141B29");
    expect(palette.text).toBe("#EDEAE3");
    expect(palette.teal).toBe("#00C2A8");
    expect(palette.amber).toBe("#F5A623");
    expect(palette.focus).toBe("#7FE6D4");
  });

  it("emits a custom property for every palette key and semantic role", () => {
    const css = tokensCss();
    for (const key of Object.keys(palette)) expect(css).toContain(`--palette-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:`);
    for (const role of Object.keys(semantic)) expect(css).toContain(`--${role}:`);
  });

  it("scopes primitives so bare elements are never restyled", () => {
    const rules = brandCss().split("\n").filter((l) => /^[.a-z*:#]/i.test(l) && l.includes("{"));
    for (const line of rules) {
      const selector = line.slice(0, line.indexOf("{")).trim();
      if (selector.startsWith(":root")) continue;
      expect(selector, selector).toMatch(/^\.(rj-|is-)|^\.rj-app/);
    }
  });
});

describe("generated files", () => {
  it("css/brand.css is up to date", () => {
    expect(readFileSync(join(root, "css/brand.css"), "utf8")).toBe(brandCss());
  });

  it("has one up-to-date svg per product icon and no extras", () => {
    const files = readdirSync(join(root, "icons")).filter((f) => f.endsWith(".svg")).sort();
    expect(files).toEqual(productIconIds.map((id) => `${id}.svg`).sort());
    for (const id of productIconIds) {
      expect(readFileSync(join(root, "icons", `${id}.svg`), "utf8")).toBe(`${productFavicon(id)}\n`);
    }
  });
});

describe("icons", () => {
  it("gives every product a distinct icon", () => {
    const svgs = productIconIds.map((id) => productFavicon(id));
    expect(new Set(svgs).size).toBe(svgs.length);
  });

  it("falls back to the generic motif for unknown ids", () => {
    expect(hasProductIcon("nope")).toBe(false);
    expect(productFavicon("nope")).toBe(productFavicon("astrodash"));
  });

  it("uses only brand colours", () => {
    const allowed = new Set([palette.bg, palette.teal, palette.amber].map((c) => c.toLowerCase()));
    for (const id of productIconIds) {
      for (const hex of productFavicon(id).match(/#[0-9a-f]{6}/gi) ?? []) expect(allowed.has(hex.toLowerCase()), `${id}: ${hex}`).toBe(true);
    }
  });
});

describe("metadata", () => {
  it("builds the title convention", () => {
    expect(pageTitle("Weather Dashboard")).toBe("Weather Dashboard · apps.rjmlaird.co.uk");
  });

  it("flags poor metadata", () => {
    expect(validateMeta({ name: "", description: "Too short" }).length).toBeGreaterThan(0);
    expect(validateMeta({ name: "Ok", description: "A perfectly reasonable description of what this small app does for people." })).toEqual([]);
  });

  it("escapes values in head tags", () => {
    const html = headTags({ name: `A "quoted" <app>`, description: "Fine & dandy, a description that is long enough to pass." });
    expect(html).toContain("&quot;quoted&quot; &lt;app&gt;");
    expect(html).not.toContain("<app>");
  });
});

describe("reference page", () => {
  it("renders every palette key, semantic role and product icon", () => {
    const html = referencePage();
    for (const key of Object.keys(palette)) expect(html).toContain(palette[key as keyof typeof palette]);
    for (const role of Object.keys(semantic)) expect(html).toContain(`--${role}`);
    for (const id of productIconIds) expect(html).toContain(`aria-label="${id} icon"`);
    expect(html).not.toContain("FAIL");
  });
});
