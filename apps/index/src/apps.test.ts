import { readdirSync } from "node:fs";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { APPS, GROUPS, STATUS } from "./apps";

// Folders under apps/ that are not apps themselves.
const NOT_APPS = new Set(["index"]);

// Walk up from this file to the nearest directory called "apps".
function findAppsDir(start: string): string {
  let dir = start;
  while (basename(dir) !== "apps") {
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`No apps/ directory found above ${start}`);
    dir = parent;
  }
  return dir;
}

const APPS_DIR = findAppsDir(dirname(fileURLToPath(import.meta.url)));

const folders = readdirSync(APPS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !NOT_APPS.has(d.name))
  .map((d) => d.name);

describe("apps registry", () => {
  it("has unique ids", () => {
    const ids = APPS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has an entry for every apps/ folder, and a folder for every entry", () => {
    expect(APPS.map((a) => a.id).sort()).toEqual([...folders].sort());
  });

  it("uses known groups and statuses", () => {
    const groups = new Set(GROUPS.map((g) => g.id));
    for (const a of APPS) {
      expect(groups.has(a.group), `${a.id}: group`).toBe(true);
      expect(a.status in STATUS, `${a.id}: status`).toBe(true);
    }
  });

  it("follows the path and source conventions", () => {
    for (const a of APPS) {
      if (a.source) expect(a.source, `${a.id}: source`).toBe(`apps/${a.id}`);
      if (a.path) expect(a.path, `${a.id}: path`).toBe(`/${a.id}`);
    }
  });

  it("only gives a path to apps that are live", () => {
    for (const a of APPS) {
      const live = a.status === "active" || a.status === "in-progress";
      expect(Boolean(a.path), `${a.id}: path vs status`).toBe(live);
    }
  });

  it("uses valid ISO dates", () => {
    for (const a of APPS) {
      expect(a.updated, `${a.id}: updated`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(a.updated)), `${a.id}: updated`).toBe(false);
    }
  });
});