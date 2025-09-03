import { vitePluginReact } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginNode } from "vite-plugin-node";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [vitePluginReact(), viteStaticCopy(), viteSingleFile(), vitePluginNode()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["components/__tests__/**/*.js"],
  },
});
