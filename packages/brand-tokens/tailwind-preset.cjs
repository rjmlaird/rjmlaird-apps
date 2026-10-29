/**
 * Tailwind preset for apps that use utility classes (mini-bar, spice-cupboard).
 * It re-points Tailwind's slate/teal/rose/emerald/amber/blue scales at the brand
 * palette, so existing markup such as `bg-slate-900 text-brand-400` renders in
 * brand colours without class-by-class edits. Keep this in step with src/tokens.css.
 */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: [
          '"Space Grotesk"',
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: { brand: "6px" },
      colors: {
        brand: {
          50: "#E6FBF8",
          100: "#C2F5EE",
          200: "#9AEEE2",
          300: "#7FE6D4",
          400: "#2FD3BC",
          500: "#00C2A8",
          600: "#00A38D",
          700: "#007F6E",
          800: "#005F53",
          900: "#004A41",
        },
        // Surfaces: ink -> ink2 -> card -> lift
        darkbg: "#0B0F1A",
        darkcard: "#141B29",
        darkborder: "#2A3449",
        slate: {
          50: "#F5F3EE",
          100: "#EDEAE3",
          200: "#D8D5CE",
          300: "#B7BECC",
          400: "#9AA4B8",
          500: "#8A98B2",
          600: "#66738C",
          700: "#2A3449",
          800: "#1A2236",
          900: "#0F1520",
          950: "#0B0F1A",
        },
        rose: { 300: "#FFAAAA", 400: "#FF8080", 500: "#F26B6B", 800: "#7F2D2D" },
        emerald: { 300: "#86EFAC", 400: "#4ADE80", 500: "#22C55E" },
        amber: { 300: "#FBC76A", 400: "#F5A623", 500: "#E0921A" },
        blue: { 400: "#38BDF8", 500: "#0EA5E9" },
      },
    },
  },
};
