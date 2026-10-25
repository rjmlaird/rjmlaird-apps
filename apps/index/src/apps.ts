export type Status = "active" | "in-progress" | "planned" | "archived";
export type GroupId = "space" | "places" | "home";

export interface App {
  /** Must match the folder name under apps/ (checked by apps.test.ts). */
  id: string;
  title: string;
  description: string;
  group: GroupId;
  /** What the app actually runs on, verified against its code. No placeholders. */
  tech: string[];
  status: Status;
  /** ISO date, YYYY-MM-DD */
  updated: string;
  /** Public URL, always `https://${id}.apps.rjmlaird.co.uk`. Omit until the app is deployed. */
  path?: string;
  /** Folder in the repo, shown as the "Source" link. Always `apps/${id}`. */
  source?: string;
}

/** Alias kept because page.tsx imports the type as `Apps`. */
export type Apps = App;

export const REPO = "https://github.com/rjmlaird/rjmlaird-apps";

export const GROUPS: { id: GroupId; name: string; blurb: string }[] = [
  { id: "space", name: "Space & Astronomy", blurb: "Dashboards and planners for observing and space data." },
  { id: "places", name: "Places & Infrastructure", blurb: "Weather and local data dashboards." },
  { id: "home", name: "Home & Everyday", blurb: "Personal inventory and planning apps for around the house." },
];

export const STATUS: Record<Status, { label: string; order: number }> = {
  active: { label: "Active", order: 1 },
  "in-progress": { label: "In progress", order: 2 },
  planned: { label: "Planned", order: 3 },
  archived: { label: "Archived", order: 4 },
};

// Add an app here and it appears on the index. Keep `id` equal to the apps/ folder name.
// Flip an app to "active" and add `path` only once it is deployed.
//
// Tech tags describe what the shipped page really uses. Several apps are a single
// vanilla-JS index.html; the React/Vite/TypeScript files in those folders are an unused scaffold.
export const APPS: App[] = [
  // Space & Astronomy
  {
    id: "astrodash",
    title: "Astro Mission Control",
    description:
      "An astronomy dashboard for observing, combining sky positions with weather, space weather, aurora alerts and satellite data.",
    group: "space",
    tech: ["JavaScript", "Leaflet", "Open-Meteo", "NOAA SWPC", "NASA DONKI"],
    status: "in-progress",
    updated: "2026-10-11",
    path: "https://astrodash.apps.rjmlaird.co.uk",
    source: "apps/astrodash",
  },
  {
    id: "launches",
    title: "Upcoming Rocket Launches",
    description:
      "A readable schedule of the next 20 rocket launches, with times, vehicles and status.",
    group: "space",
    tech: ["JavaScript", "Launch Library 2"],
    status: "in-progress",
    updated: "2026-10-21",
    path: "https://launches.apps.rjmlaird.co.uk",
    source: "apps/launches",
  },

  // Places & Infrastructure
  {
    id: "weatherdash",
    title: "Weather Dashboard",
    description:
      "A weather dashboard showing current conditions and forecasts for a chosen location.",
    group: "places",
    tech: ["JavaScript", "Open-Meteo", "RainViewer"],
    status: "in-progress",
    updated: "2026-10-11",
    path: "https://weatherdash.apps.rjmlaird.co.uk",
    source: "apps/weatherdash",
  },

  // Home & Everyday
  {
    id: "spice-cupboard",
    title: "Spice Cupboard & Mix Manager",
    description:
      "Keep track of the spices you have, and see which spice mixes you can make now or are one ingredient short of, with batch scaling.",
    group: "home",
    tech: ["JavaScript", "Tailwind CSS", "localStorage"],
    status: "active",
    updated: "2026-10-11",
    path: "https://spice-cupboard.apps.rjmlaird.co.uk",
    source: "apps/spice-cupboard",
  },
  {
    id: "mini-bar",
    title: "Mini Bar",
    description:
      "A home bar inventory and cocktail manager: record what you have and see which drinks you can make now.",
    group: "home",
    tech: ["JavaScript", "Tailwind CSS", "localStorage"],
    status: "in-progress",
    updated: "2026-10-11",
    path: "https://mini-bar.apps.rjmlaird.co.uk",
    source: "apps/mini-bar",
  },
  {
    id: "first-aid-kit",
    title: "First Aid Kit Inventory",
    description:
      "Track the contents of your first aid kits: expiry dates, minimum quantities, inspection checklists and an automatic restock list.",
    group: "home",
    tech: ["JavaScript", "localStorage"],
    status: "in-progress",
    updated: "2026-10-22",
    path: "https://first-aid-kit.apps.rjmlaird.co.uk",
    source: "apps/first-aid-kit",
  },
  {
    id: "kinship-notes",
    title: "Kinship Notes",
    description:
      "Import a GEDCOM family tree, explore it as a whole tree, hourglass, pedigree, descendants or fan chart, and keep private research notes, questions and tasks against each person. Everything stays in your browser.",
    group: "home",
    tech: ["React", "Vite", "TypeScript", "Vitest"],
    status: "in-progress",
    updated: "2026-10-22",
    path: "https://kinship-notes.apps.rjmlaird.co.uk",
    source: "apps/kinship-notes",
  },
];
