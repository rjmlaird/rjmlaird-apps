/** Earth's standard gravitational parameter, km^3/s^2. */
export const EARTH_MU = 398_600.4418;

/** Orbital period in seconds. a in km, mu in km^3/s^2. */
export function calculateOrbitalPeriod(a: number, mu: number = EARTH_MU): number {
  return 2 * Math.PI * Math.sqrt(a ** 3 / mu);
}

/** Orbital speed (km/s) at radius r (km) on an orbit of semi-major axis a (vis-viva). */
export function visViva(r: number, a: number, mu: number = EARTH_MU): number {
  return Math.sqrt(mu * (2 / r - 1 / a));
}

/** Format seconds as e.g. "1h 31m 34s". */
export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h && `${h}h`, (h || m) && `${m}m`, `${sec}s`].filter(Boolean).join(" ");
}

export * from "./units";
