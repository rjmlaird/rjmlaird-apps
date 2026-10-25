import { fontImportCss, tokensCss } from "@rjmlaird/brand-tokens";

export const globalCss = `
${fontImportCss}

${tokensCss()}

/* Legacy names used by this app's own CSS. They alias the canonical tokens so
   the values come from @rjmlaird/brand-tokens, not from this file. */
:root {
  --navy: var(--color-bg);
  --navy-raised: var(--color-surface);
  --teal: var(--color-primary);
  --teal-hover: var(--color-primary-hover);
  --amber: var(--color-highlight);
  --text-hi: var(--color-text);
  --text-lo: var(--color-text-muted);
  --border: var(--color-border);
  /* Product-level choice: the index is narrower than the 1320px site maximum. */
  --content-width: 1080px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--navy);
  color: var(--text-hi);
  font-family: var(--font-body);
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(0, 194, 168, 0.06), transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(245, 166, 35, 0.05), transparent 45%),
    var(--navy);
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
  border: 1px solid var(--color-border-strong);
  background: linear-gradient(
    180deg,
    rgba(18, 24, 38, 0.95),
    rgba(11, 15, 26, 0.95)
  );
  color: var(--text-hi);
}

button:hover {
  border-color: rgba(0, 194, 168, 0.35);
}

:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

::selection {
  background: rgba(0, 194, 168, 0.25);
  color: var(--text-hi);
}

.wrap {
  width: min(100% - (var(--page-gutter) * 2), var(--content-width));
  margin-inline: auto;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }
}

`;
