import { EARTH_MU, calculateOrbitalPeriod, visViva } from "@rjmlaird/utils";
import { Hono } from "hono";

export interface CalculateRequest {
  /** Semi-major axis, km */
  a: number;
  /** Eccentricity, 0 <= e < 1 */
  e: number;
  /** Gravitational parameter, km^3/s^2 (default: Earth) */
  mu?: number;
}

export interface CalculateResponse {
  periodSeconds: number;
  periapsisKm: number;
  apoapsisKm: number;
  periapsisVelocityKmS: number;
  apoapsisVelocityKmS: number;
  meanVelocityKmS: number;
}

function parse(input: Record<string, unknown>): CalculateRequest | string {
  const a = Number(input.a);
  const e = Number(input.e);
  const mu = input.mu === undefined || input.mu === "" ? EARTH_MU : Number(input.mu);
  if (!Number.isFinite(a) || a <= 0) return "a must be a positive number (km)";
  if (!Number.isFinite(e) || e < 0 || e >= 1) return "e must satisfy 0 <= e < 1";
  if (!Number.isFinite(mu) || mu <= 0) return "mu must be a positive number";
  return { a, e, mu };
}

export function solve({ a, e, mu = EARTH_MU }: CalculateRequest): CalculateResponse {
  const rp = a * (1 - e);
  const ra = a * (1 + e);
  return {
    periodSeconds: calculateOrbitalPeriod(a, mu),
    periapsisKm: rp,
    apoapsisKm: ra,
    periapsisVelocityKmS: visViva(rp, a, mu),
    apoapsisVelocityKmS: visViva(ra, a, mu),
    meanVelocityKmS: Math.sqrt(mu / a),
  };
}

export const calculateRoute = new Hono();

calculateRoute.get("/", (c) => {
  const parsed = parse(c.req.query());
  return typeof parsed === "string" ? c.json({ error: parsed }, 400) : c.json(solve(parsed));
});

calculateRoute.post("/", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = parse(body);
  return typeof parsed === "string" ? c.json({ error: parsed }, 400) : c.json(solve(parsed));
});
