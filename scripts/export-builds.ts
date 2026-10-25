// scripts/export-builds.ts
import {
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";

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
const APPS_HOSTNAME = new URL(ORIGIN).hostname;
const SOURCE_REF = "main";
const DEFAULT_OUTPUT = "../rjmlaird-api/src/data/apps-builds.json";

/**
 * COMMAND-LINE OPTIONS
 */

interface Options {
  checkOnly: boolean;
  outputFile: string;
}

function parseOptions(args: string[]): Options {
  let checkOnly = false;
  let outputPath = DEFAULT_OUTPUT;
  let outputSpecified = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--check") {
      checkOnly = true;
      continue;
    }

    if (argument === "--output") {
      if (outputSpecified) {
        throw new Error("--output may only be specified once.");
      }

      const value = args[index + 1];

      if (!value || !value.trim() || value.startsWith("--")) {
        throw new Error("--output requires a destination filename.");
      }

      outputPath = value;
      outputSpecified = true;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: "${argument}".`);
  }

  return {
    checkOnly,
    outputFile: resolve(ROOT, outputPath),
  };
}

/**
 * VALIDATION HELPERS
 */

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

/**
 * App.path contains an absolute launch URL.
 *
 * Accepted destinations:
 * - https://apps.rjmlaird.co.uk/...
 * - https://<subdomain>.apps.rjmlaird.co.uk/...
 *
 * Preserve the original registry value in `path`.
 * Export the normalised URL separately as `url`.
 */

function resolveAppUrl(value: string, id: string): string {
  if (
    !value ||
    value !== value.trim() ||
    /[\s\\]/.test(value)
  ) {
    throw new Error(
      `${id}: destination must not be empty or contain whitespace or backslashes.`,
    );
  }

  if (!value.startsWith("https://")) {
    throw new Error(
      `${id}: destination must be an absolute HTTPS URL. Received: ${JSON.stringify(value)}.`,
    );
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `${id}: invalid application destination ${JSON.stringify(value)}.`,
    );
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password
  ) {
    throw new Error(
      `${id}: destination must use HTTPS without embedded credentials.`,
    );
  }

  const allowedHost =
    url.hostname === APPS_HOSTNAME ||
    url.hostname.endsWith(`.${APPS_HOSTNAME}`);

  if (!allowedHost || url.port) {
    throw new Error(
      `${id}: destination must use ${APPS_HOSTNAME} or one of its subdomains, without a non-default port.`,
    );
  }

  return url.href;
}

/**
 * REGISTRY VALIDATION
 */

function validateRegistry(): void {
  const groupIds = new Set(
    GROUPS.map((group) => group.id),
  );

  const seenIds = new Set<string>();

  if (groupIds.size !== GROUPS.length) {
    throw new Error("Duplicate group IDs in GROUPS.");
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
      throw new Error(
        `${app.id}: title and description are required.`,
      );
    }

    if (!groupIds.has(app.group)) {
      throw new Error(
        `${app.id}: unknown group "${app.group}".`,
      );
    }

    if (!Object.prototype.hasOwnProperty.call(STATUS, app.status)) {
      throw new Error(
        `${app.id}: unknown status "${app.status}".`,
      );
    }

    if (!isCalendarDate(app.updated)) {
      throw new Error(
        `${app.id}: updated must be a valid YYYY-MM-DD date.`,
      );
    }

    if (app.path !== undefined) {
      resolveAppUrl(app.path, app.id);
    }

    if (
      app.source !== undefined &&
      app.source !== `apps/${app.id}`
    ) {
      throw new Error(
        `${app.id}: source must equal "apps/${app.id}".`,
      );
    }

    if (app.status === "active" && !app.path) {
      throw new Error(
        `${app.id}: an active app must have a deployment destination.`,
      );
    }

    if (
      app.tech.length === 0 ||
      app.tech.some((technology) => !technology.trim())
    ) {
      throw new Error(
        `${app.id}: tech must contain non-empty names.`,
      );
    }
  }
}

/**
 * CATALOGUE
 *
 * Preserve registry order, statuses and dates.
 * Do not add a generation timestamp that changes on every run.
 */

function createCatalogue() {
  return {
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
            path: app.path,
            url: resolveAppUrl(app.path, app.id),
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
}

/**
 * OUTPUT CHECK
 */

async function checkExport(
  outputFile: string,
  expected: string,
): Promise<void> {
  let existing: string;

  try {
    existing = await readFile(outputFile, "utf8");
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new Error(
        `Missing export: ${outputFile}. Run the export command for this destination first.`,
      );
    }

    throw error;
  }

  if (existing !== expected) {
    throw new Error(
      `The Apps JSON export is stale: ${outputFile}. Regenerate it from apps.ts.`,
    );
  }

  console.log(`Apps export is current: ${outputFile}`);
}

/**
 * OUTPUT WRITE
 */

async function writeExport(
  outputFile: string,
  content: string,
): Promise<void> {
  await mkdir(dirname(outputFile), {
    recursive: true,
  });

  const temporaryFile = `${outputFile}.tmp`;

  await writeFile(temporaryFile, content, "utf8");
  await rename(temporaryFile, outputFile);
}

/**
 * ENTRY POINT
 */

async function main(): Promise<void> {
  const options = parseOptions(
    process.argv.slice(2),
  );

  validateRegistry();

  const catalogue = createCatalogue();
  const output = `${JSON.stringify(catalogue, null, 2)}\n`;

  if (options.checkOnly) {
    await checkExport(options.outputFile, output);
    return;
  }

  await writeExport(options.outputFile, output);

  console.log(
    `Exported ${catalogue.builds.length} apps to ${options.outputFile}`,
  );
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );

  process.exitCode = 1;
});
