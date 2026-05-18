import { copyFileSync, cpSync, existsSync, mkdirSync } from "fs";
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Plugin to copy static assets after build
function copyStaticAssets() {
  return {
    name: "copy-static-assets",
    closeBundle() {
      const dist = "dist";
      // Copy styles
      if (existsSync("styles")) {
        mkdirSync(`${dist}/styles`, { recursive: true });
        cpSync("styles", `${dist}/styles`, { recursive: true });
      }
      // Copy js
      if (existsSync("js")) {
        mkdirSync(`${dist}/js`, { recursive: true });
        cpSync("js", `${dist}/js`, { recursive: true });
      }
      // Copy assets
      if (existsSync("assets")) {
        mkdirSync(`${dist}/assets`, { recursive: true });
        cpSync("assets", `${dist}/assets`, { recursive: true });
      }
      // Copy main.js
      if (existsSync("main.js")) {
        copyFileSync("main.js", `${dist}/main.js`);
      }
      console.log("✅ Static assets copied to dist/");
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStaticAssets()],
  root: ".",
  build: {
    outDir: "dist",
    sourcemap: false, // Disabled for production — reduces build output and avoids source leakage
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@babylonjs")) return "vendor-babylon";
            if (id.includes("three") || id.includes("@react-three")) return "vendor-three";
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("jspdf")) return "vendor-jspdf";
            if (id.includes("firebase")) return "vendor-firebase";
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"], // Prevent React duplication
    include: ["date-fns"], // Pre-bundle date-fns to avoid HMR issues
    // DO NOT set force: true - it causes churn & reconnects
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
