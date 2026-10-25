import { brandCss } from "./brand-css";

// Brand tokens, focus, reduced motion and .rj-* components are generated into ./brand-css.ts
// (run `pnpm brand:sync` from the repo root). Only index-page layout lives here.
export const globalCss = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

${brandCss}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --content-width: 1080px;
  --page-gutter: 1.5rem;
}

html {
  background: var(--rj-bg);
  color: var(--rj-text);
  font-family: var(--font-body);
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: var(--rj-bg);
}

h1,
h2,
h3 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: -0.01em;
}

p,
ul,
ol {
  margin-top: 0;
}

a {
  color: inherit;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  border: 1px solid var(--rj-border-strong);
  background: var(--rj-surface-raised);
  color: var(--rj-text);
  border-radius: var(--radius);
}

button:hover {
  border-color: var(--rj-primary-border);
}

::selection {
  background: var(--rj-primary-border);
  color: var(--rj-text);
}

.wrap {
  width: min(100% - (var(--page-gutter) * 2), var(--content-width));
  margin-inline: auto;
}

@media (max-width: 560px) {
  :root {
    --page-gutter: 1rem;
  }
}
`;
