# Fix applied

`index.html` (and the built copy `dist/index.html`) declared `const dateFmt` twice, which is a
SyntaxError. The whole inline script failed to load, so the page stayed on "Loading…" and never
called the launch API.

Change: the first declaration is now `const dayFmt = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" });`
which is what `formatWhen()` already expected (it calls `dayFmt.format(...)` for approximate dates).
The old line also combined `dateStyle`/`timeStyle` with `timeZoneName`, which `Intl.DateTimeFormat` does not allow.

Redeploy: `npm install && npm run build && npx wrangler deploy`
(or just `npx wrangler deploy` — `dist/` is already patched).
