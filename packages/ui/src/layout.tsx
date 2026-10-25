import type { FC, PropsWithChildren } from "hono/jsx";

// Minimal branded page shell for Hono-rendered tools. The Worker must serve /brand.css
// (generated from @rjmlaird/brand-tokens by `pnpm brand:sync`).
const css = `
body{margin:0;padding:1rem;background:var(--rj-bg);color:var(--rj-text);font-family:var(--font-body);line-height:1.6}
main{max-width:34rem;margin:0 auto}
h1{font-family:var(--font-display)}
label{display:block;margin:.75rem 0 .25rem}
pre{padding:.75rem;overflow-x:auto;border:1px solid var(--rj-border);border-radius:var(--radius);font-family:var(--font-mono)}
`;

export const Layout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0B0F1A" />
      <title>{`${title} · apps.rjmlaird.co.uk`}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      <link rel="stylesheet" href="/brand.css" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <main>
        <h1>{title}</h1>
        {children}
      </main>
    </body>
  </html>
);
