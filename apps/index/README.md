# Apps index

The listing page at **apps.rjmlaird.co.uk**. A Hono Worker that renders the registry in `src/apps.ts` as a filterable, grouped catalogue of every app.

## Routes

| Route          | Response                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `/`            | The catalogue (cached for 5 minutes)                                                                |
| `/favicon.svg` | Generated index icon                                                                                |
| `/brand`       | Brand reference: tokens, contrast ratios, components, product icons, metadata convention. `noindex` |
| anything else  | Plain-text 404 pointing back to the index                                                           |

The Worker owns `apps.rjmlaird.co.uk` only. Each app has its own Worker on its own subdomain.

## The page

Filters for group, technology, and status, plus sorting by recently or least recently updated, title, or status. Filtering runs in the browser with no dependencies, and a summary line announces the result count for screen readers.

## The registry (`src/apps.ts`)

Add an app by adding an entry. Fields:

| Field                  | Rule                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| `id`                   | Folder name under `apps/`                                              |
| `title`, `description` | Plain English, shown on the card                                       |
| `group`                | `space`, `places` or `home`                                            |
| `tech`                 | What the shipped page really uses. The filter is built from these tags |
| `status`               | `active`, `in-progress`, `planned` or `archived`                       |
| `updated`              | ISO date, `YYYY-MM-DD`                                                 |
| `path`                 | `https://<id>.apps.rjmlaird.co.uk`. Set only when deployed             |
| `source`               | `apps/<id>`, linked to the repository                                  |

Apps with no `path` show as coming soon. The test below enforces which statuses may or may not have a `path`.

## Brand

Colours, fonts, favicon and page metadata come from `@rjmlaird/brand-tokens`. Legacy names in `src/global-css.ts` (`--navy`, `--teal` and so on) alias the canonical tokens. The page keeps a 1080 px content width as a product-level choice.

## Tests

```sh
pnpm --filter ./apps/index test
pnpm --filter ./apps/index typecheck
```

The tests fail if:

- an `apps/` folder has no entry, or an entry has no folder
- an `id`, `path` or `source` breaks the convention
- an app has no product icon in `packages/brand-tokens/src/icons.ts`
- the page metadata breaks the shared convention

## Development

```sh
pnpm --filter ./apps/index dev      # wrangler dev, port 8789, inspector 9231
pnpm --filter ./apps/index build    # wrangler deploy --dry-run
pnpm --filter ./apps/index run deploy
```

## Known issues

- `package.json` is still named `@rjmlaird/tools-index`.
- The index text mentions "tools" in places, which is a leftover from the earlier repository.
