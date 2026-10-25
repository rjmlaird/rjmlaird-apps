#!/usr/bin/env node
// Copies Font Awesome Free (css + webfonts) from node_modules into ./public/vendor/fontawesome of the app it runs in,
// so icons are served from the app's own origin instead of a CDN. Run via `pnpm build:icons`.
import { cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(join(process.cwd(), "package.json"));
const root = dirname(require.resolve("@fortawesome/fontawesome-free/package.json"));
const out = join(process.cwd(), "public/vendor/fontawesome");
mkdirSync(join(out, "css"), { recursive: true });
cpSync(join(root, "css/all.min.css"), join(out, "css/all.min.css"));
cpSync(join(root, "webfonts"), join(out, "webfonts"), { recursive: true });
console.log("Font Awesome copied to", out);
