import { Layout } from "@rjmlaird/ui";
import { Hono } from "hono";

// Posts to the absolute path so it works with or without a trailing slash.
const script = `
const form = document.getElementById("f");
const out = document.getElementById("out");
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  const res = await fetch("/orbital-calc/calculate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  out.textContent = JSON.stringify(await res.json(), null, 2);
});
`;

export const pageRoute = new Hono();

pageRoute.get("/", (c) =>
  c.html(
    <Layout title="Orbital Calculator">
      <p>Two-body orbit parameters (default: Earth).</p>
      <form id="f">
        <label for="a">Semi-major axis a (km)</label>
        <input id="a" name="a" type="number" step="any" value="6778" required />
        <label for="e">Eccentricity e (0 ≤ e &lt; 1)</label>
        <input id="e" name="e" type="number" step="any" value="0" min="0" max="0.999999" required />
        <button type="submit">Calculate</button>
      </form>
      <pre id="out" aria-live="polite"></pre>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </Layout>,
  ),
);
