import { Hono } from "hono";
import { productFavicon, referencePage } from "@rjmlaird/brand-tokens";
import { IndexPage } from "./page";

const app = new Hono();

app.get("/", (c) => {
  c.header("cache-control", "public, max-age=300");
  return c.html(<IndexPage />);
});

const favicon = productFavicon("index");
app.get("/favicon.svg", (c) =>
  c.body(favicon, 200, {
    "content-type": "image/svg+xml",
    "cache-control": "public, max-age=86400",
  }),
);

app.get("/brand", (c) => {
  c.header("cache-control", "public, max-age=300");
  return c.html(referencePage());
});

app.notFound((c) =>
  c.text("Not found. See https://apps.rjmlaird.co.uk for available apps.", 404),
);

export default app;
