import { CATEGORIES, convertUnits } from "@rjmlaird/utils";
import { Hono } from "hono";

export const convertRoutes = new Hono();

/** GET /units — all categories and their units. */
convertRoutes.get("/units", (c) =>
  c.json(
    CATEGORIES.map(({ id, name, base, units }) => ({
      id,
      name,
      base,
      units: units.map(({ id, name, symbol }) => ({ id, name, symbol })),
    })),
  ),
);

/** GET /convert?category=length&value=1&from=au&to=km */
convertRoutes.get("/convert", (c) => {
  const { category = "", from = "", to = "", value = "" } = c.req.query();
  const n = Number(value);
  if (value === "" || !Number.isFinite(n)) return c.json({ error: "value must be a number" }, 400);
  try {
    return c.json(convertUnits(category, from, to, n));
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "Bad request" }, 400);
  }
});
