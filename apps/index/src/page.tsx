import type { FC } from "hono/jsx";
import { css } from "./styles";
import { script } from "./script";
import { GROUPS, REPO, STATUS, APPS } from "./apps";
import type { Apps } from "./apps";

const byUpdatedDesc = (a: Apps, b: Apps) =>
  b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title);

const techOptions = [...new Set(APPS.flatMap((t) => t.tech))].sort((a, b) => a.localeCompare(b));
const groups = GROUPS.filter((g) => APPS.some((t) => t.group === g.id));

const AppsCard: FC<{ app: Apps }> = ({ app }) => (
  <article
    class="card"
    data-card
    data-group={app.group}
    data-tech={app.tech.map((t) => t.toLowerCase()).join("|")}
    data-status={app.status}
    data-updated={app.updated}
    data-title={app.title.toLowerCase()}
    data-status-order={String(STATUS[app.status].order)}
  >
    <div class="card-top">
      <h3>{app.title}</h3>
      <span class={`status status-${app.status}`}>{STATUS[app.status].label}</span>
    </div>
    <p class="desc">{app.description}</p>
    <ul class="tech" aria-label="Technologies used">
      {app.tech.map((t) => (
        <li>{t}</li>
      ))}
    </ul>
    <div class="card-links">
      {app.path ? (
        <a class="btn-primary" href={app.path}>
          Open app <span aria-hidden="true">→</span>
        </a>
      ) : (
        <span class="btn-disabled">Coming soon</span>
      )}
      {app.source && (
        <a class="btn-secondary" href={`${REPO}/tree/main/${app.source}`} target="_blank" rel="noopener">
          Source
        </a>
      )}
    </div>
    <p class="updated">
      Updated <time datetime={app.updated}>{app.updated}</time>
    </p>
  </article>
);

export const IndexPage: FC = () => (
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Appss · apps.rjmlaird.co.uk</title>
      <meta
        name="description"
        content="Stable, bookmarkable calculators, converters and data utilities for space, physics, places and the web."
      />
      <meta name="theme-color" content="#0b0f1a" />
      <meta name="color-scheme" content="dark" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <header class="hero wrap">
        <div class="orbit-line" aria-hidden="true"></div>
        <p class="eyebrow">rjmlaird.co.uk / apps</p>
        <h1>Small apps that do one job well.</h1>
        <p class="sub">
          Stable, bookmarkable calculators, converters and data utilities. Each app runs
          separately; this is the shared index for finding them.
        </p>
      </header>

      <main class="wrap">
        <section class="filters" aria-labelledby="filter-heading">
          <div class="filter-intro">
            <p class="section-kicker">Browse apps</p>
            <h2 id="filter-heading">Find a app</h2>
            <p>Narrow the collection by subject area, technology and status, then choose how the results are ordered.</p>
          </div>
          <div class="filter-controls">
            <div class="filter-field">
              <label for="group-filter">Subject area</label>
              <select id="group-filter" name="group">
                <option value="all">All subject areas</option>
                {groups.map((g) => (
                  <option value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div class="filter-field">
              <label for="tech-filter">Technology</label>
              <select id="tech-filter" name="technology">
                <option value="all">All technologies</option>
                {techOptions.map((t) => (
                  <option value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div class="filter-field">
              <label for="status-filter">Status</label>
              <select id="status-filter" name="status">
                <option value="all">All statuses</option>
                {Object.entries(STATUS).map(([id, s]) => (
                  <option value={id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div class="filter-field">
              <label for="sort-filter">Sort by</label>
              <select id="sort-filter" name="sort">
                <option value="updated-desc">Recently updated</option>
                <option value="updated-asc">Oldest update</option>
                <option value="title-asc">Title, A to Z</option>
                <option value="title-desc">Title, Z to A</option>
                <option value="status">Status</option>
              </select>
            </div>
            <button class="clear-filter" id="clear-filter" type="button" hidden>
              Clear filters
            </button>
          </div>
          <p class="filter-summary" id="filter-summary" aria-live="polite">
            Showing all {APPS.length} apps, recently updated first.
          </p>
        </section>

        <div id="apps-content">
          {groups.map((g) => (
            <section
              class="lab-group"
              id={g.id}
              data-group-section
              aria-labelledby={`${g.id}-heading`}
            >
              <div class="section-heading">
                <p class="section-kicker">{g.name}</p>
                <h2 id={`${g.id}-heading`}>{g.blurb}</h2>
              </div>
              <div class="grid" data-grid>
                {APPS.filter((t) => t.group === g.id)
                  .sort(byUpdatedDesc)
                  .map((t) => (
                    <AppsCard app={t} />
                  ))}
              </div>
            </section>
          ))}
        </div>

        <p class="no-results" id="no-results" hidden role="status">
          No apps match those filters. Try changing a selection or clear the filters.
        </p>
      </main>

      <footer class="wrap footer">
        <a href="https://rjmlaird.co.uk">← Back to rjmlaird.co.uk</a>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </body>
  </html>
);
