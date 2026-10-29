import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed independently as astrodash.apps.rjmlaird.co.uk
export default defineConfig({
  plugins: [react()],
  base: "/",
});
