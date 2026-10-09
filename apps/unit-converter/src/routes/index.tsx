import { CATEGORIES } from "@rjmlaird/utils";
import { Layout } from "@rjmlaird/ui";
import { Hono } from "hono";

const data = CATEGORIES.map(({ id, name, units }) => ({
  id,
  name,
  units: units.map(({ id, name, symbol }) => ({ id, label: `${name} (${symbol})` })),
}));

// "<" is escaped so the JSON can't close the script tag.
const json = JSON.stringify(data).replace(/</g, "\\u003c");

const script = `
const DATA = ${json};
const $ = (id) => document.getElementById(id);
const cat = $("cat"), from = $("from"), to = $("to"), val = $("val"), out = $("out");
DATA.forEach((c) => cat.add(new Option(c.name, c.id)));
function fill() {
  const c = DATA.find((x) => x.id === cat.value);
  from.length = to.length = 0;
  c.units.forEach((u) => { from.add(new Option(u.label, u.id)); to.add(new Option(u.label, u.id)); });
  if (to.options.length > 1) to.selectedIndex = 1;
  run();
}
async function run() {
  if (val.value === "") { out.textContent = ""; return; }
  const q = new URLSearchParams({ category: cat.value, from: from.value, to: to.value, value: val.value });
  const res = await fetch("/unit-converter/convert?" + q);
  const j = await res.json();
  out.textContent = res.ok ? Number(j.result).toPrecision(10).replace(/\\.?0+(e|$)/, "$1") : j.error;
}
cat.addEventListener("change", fill);
[from, to, val].forEach((el) => el.addEventListener("input", run));
$("swap").addEventListener("click", () => { const t = from.value; from.value = to.value; to.value = t; run(); });
fill();
`;

export const pageRoute = new Hono();

pageRoute.get("/", (c) =>
  c.html(
    <Layout title="Unit Converter">
      <p>Physics, engineering and astronomy units.</p>
      <label for="cat">Category</label>
      <select id="cat" style="width:100%;padding:.5rem;font:inherit"></select>
      <label for="val">Value</label>
      <input id="val" type="number" step="any" value="1" />
      <label for="from">From</label>
      <select id="from" style="width:100%;padding:.5rem;font:inherit"></select>
      <label for="to">To</label>
      <select id="to" style="width:100%;padding:.5rem;font:inherit"></select>
      <button id="swap" type="button">Swap</button>
      <pre id="out" aria-live="polite" style="font-size:1.25rem"></pre>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </Layout>,
  ),
);
