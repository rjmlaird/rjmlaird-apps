import { defineConfig } from "vite";

// Plain static build: index.html is the app. Not deployed yet: copy wrangler.jsonc and worker/ from mini-bar when it is ready to publish.
export default defineConfig({ base: "/" });