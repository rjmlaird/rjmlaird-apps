import { defineConfig } from "vite";

// Plain static build: index.html is the app. Deployed as weatherdash.apps.rjmlaird.co.uk by the Worker in wrangler.jsonc.
export default defineConfig({ base: "/" });
