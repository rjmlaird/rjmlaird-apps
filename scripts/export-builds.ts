import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  APPS,
  GROUPS,
  REPO,
  STATUS,
} from "../apps/index/src/apps.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

const ORIGIN = "https://apps.rjmlaird.co.uk";
const SOURCE_REF = "main";

const args = process.argv.slice(2);

const checkOnly = args.includes("--check");

const outputIndex = args.indexOf("--output");

if (
  outputIndex !== -1 &&
  (!args[outputIndex + 1] || args[outputIndex + 1].startsWith("--"))
) {
  throw new Error("--output requires a destination filename.");
}

const outputFile = resolve(
  ROOT,
  outputIndex === -1
    ? "../rjmlaird-api/src/data/apps-builds.json"
    : args[outputIndex + 1],
);

/**
 * Validate the registry before exporting.
 */

const groupIds = new Set(GROUPS.map((group) => group.id));
const seenIds = new Set<string>();

if (groupIds.size !== GROUPS.length) {
  throw new Error("Duplicate group IDs in GROUPS.");
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

for (const app of APPS) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.id)) {
    throw new Error(`Invalid app ID: "${app.id}".`);
  }

  if (seenIds.has(app.id)) {
    throw new Error(`Duplicate app ID: "${app.id}".`);
  }

  seenIds.add(app.id);

  if (!app.title.trim() || !app.description.trim()) {
    throw new Error(`${app.id}: title and description are required.`);
  }

  if (!groupIds.has(app.group)) {
    throw new Error(`${app.id}: unknown group "${app.group}".`);
  }

  if (!Object.hasOwn(STATUS, app.status)) {
    throw new Error(`${app.id}: unknown status "${app.status}".`);
  }

  if (!isCalendarDate(app.updated)) {
    throw new Error(
      `${app.id}: updated must be a valid YYYY-MM-DD date.`,
    );
  }

  const expectedDomain = `${app.id}.apps.rjmlaird.co.uk`;
  if (
    app.path !== undefined &&
    app.path !== `/${app.id}` &&
    app.path !== expectedDomain &&
    app.path !== `https://${expectedDomain}`
  ) {
    throw new Error(
      `${app.id}: path must equal "/${app.id}" or "${expectedDomain}".`,
    );
  }

  if (app.source !== undefined && app.source !== `apps/${app.id}`) {
    throw new Error(
      `${app.id}: source must equal "apps/${app.id}".`,
    );
  }

  if (app.status === "active" && !app.path) {
    throw new Error(
      `${app.id}: an active app must have a deployment path.`,
    );
  }

  if (
    app.tech.length === 0 ||
    app.tech.some((technology) => !technology.trim())
  ) {
    throw new Error(`${app.id}: tech must contain non-empty names.`);
  }
}

/**
 * Export in the shape consumed by the combined Builds API.
 */

const catalogue = {
  schemaVersion: 1,
  origin: ORIGIN,
  repository: REPO,
  sourceRef: SOURCE_REF,

  groups: GROUPS,
  statuses: STATUS,

  builds: APPS.map((app) => ({
    id: `apps/${app.id}`,
    sourceId: app.id,
    type: "app",

    title: app.title,
    description: app.description,
    group: app.group,
    tech: app.tech,
    status: app.status,
    updated: app.updated,

    repository: REPO,

    ...(app.path
      ? {
          path: app.path.startsWith("/") ? app.path : undefined,
          url: app.path.startsWith("http")
            ? app.path
            : app.path.includes(".")
              ? `https://${app.path}`
              : `https://${app.id}.apps.rjmlaird.co.uk`,
        }
      : {}),

    ...(app.source
      ? {
          sourcePath: app.source,
          source: `${REPO}/tree/${SOURCE_REF}/${app.source}`,
        }
      : {}),
  })),
};

const output = `${JSON.stringify(catalogue, null, 2)}\n`;

async function main() {
  if (checkOnly) {
    const existing = await readFile(outputFile, "utf8").catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code === "ENOENT") {
          throw new Error(
            `Missing export: ${outputFile}. Run the export command first.`,
          );
        }

        throw error;
      },
    );

    if (existing !== output) {
      throw new Error(
        "The JSON export is stale. Regenerate it from apps.ts.",
      );
    }

    console.log(`Export is current: ${outputFile}`);
    return;
  }

  await mkdir(dirname(outputFile), { recursive: true });

  const temporaryFile = `${outputFile}.tmp`;

  await writeFile(temporaryFile, output, "utf8");
  await rename(temporaryFile, outputFile);

  console.log(
    `Exported ${catalogue.builds.length} apps to ${outputFile}`,
  );
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : String(error),
  );

  process.exitCode = 1;
});