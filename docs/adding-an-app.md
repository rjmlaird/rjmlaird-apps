# Adding an app

1. **Folder** `apps/<id>/` (lowercase, hyphens). The id must match the folder and the registry entry.
2. **Files** `index.html`, `public/favicon.svg`, `package.json` (copy `weatherdash`), `vite.config.ts`, `wrangler.jsonc` and `worker/index.ts` (copy and change `name` and the route to `<id>.apps.rjmlaird.co.uk`).
3. **Head** copy from an existing app; set title, description, theme-color.
4. **Tailwind or Font Awesome?** Copy `tailwind.config.cjs`, `tailwind.input.css` and the `build:*` scripts from `mini-bar`. Never use CDNs.
5. **Footer** add the `.rj-parent` footer.
6. **Registry** add an entry to `apps/index/src/apps.ts`. Use `status: "planned"` and no `path` until deployed.
7. **README** add `apps/<id>/README.md` (what it does, data stored, external services, commands).
8. `pnpm brand:sync && pnpm verify`.

Note: `wrangler.jsonc` `name` is the Worker's identity in Cloudflare. Renaming it later creates a new Worker.
