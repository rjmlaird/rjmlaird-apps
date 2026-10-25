import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { brandCss, productFavicon, productIconIds } from "../src/index";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const outputs = new Map<string, string>();
outputs.set("css/brand.css", brandCss());
for (const id of productIconIds) outputs.set(`icons/${id}.svg`, `${productFavicon(id)}\n`);

const stale: string[] = [];
for (const [rel, content] of outputs) {
  const path = join(root, rel);
  if (check) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== content) stale.push(rel);
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}

if (check) {
  if (stale.length) {
    console.error(`Generated files are out of date: ${stale.join(", ")}\nRun: pnpm --filter @rjmlaird/brand-tokens generate`);
    process.exit(1);
  }
  console.log(`OK: ${outputs.size} generated files are up to date.`);
} else {
  console.log(`Wrote ${outputs.size} files.`);
}
