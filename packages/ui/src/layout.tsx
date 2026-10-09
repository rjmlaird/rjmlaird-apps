import type { FC, PropsWithChildren } from "hono/jsx";

const css = `
:root{color-scheme:light dark;font-family:system-ui,sans-serif}
body{margin:0;padding:1rem}
main{max-width:34rem;margin:0 auto}
label{display:block;margin:.75rem 0 .25rem}
input{width:100%;padding:.5rem;box-sizing:border-box;font:inherit}
button{margin-top:1rem;padding:.6rem 1rem;font:inherit;cursor:pointer}
pre{padding:.75rem;overflow-x:auto;border:1px solid #8884}
`;

export const Layout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
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
