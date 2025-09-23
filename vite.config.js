import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  return {
    plugins: [
      react({
        // Enable Fast Refresh for development
        fastRefresh: isDev,
        // Optimize JSX for production
        jsxRuntime: "automatic",
        // Enable JSX in .js files
        include: "**/*.{jsx,tsx,js,ts}",
      }),
    ],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@components": resolve(__dirname, "src/components"),
        "@games": resolve(__dirname, "src/games"),
        "@ai": resolve(__dirname, "src/ai"),
        "@audio": resolve(__dirname, "src/audio"),
        "@effects": resolve(__dirname, "src/effects"),
        "@utils": resolve(__dirname, "src/utils"),
        "@core": resolve(__dirname, "src/core"),
        "@physics": resolve(__dirname, "src/physics"),
        "@ui": resolve(__dirname, "src/ui"),
        "@characters": resolve(__dirname, "src/characters"),
        "@input": resolve(__dirname, "src/input"),
        "@testing": resolve(__dirname, "src/testing"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },

    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify(process.env.npm_package_version || "2.0.0"),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },

    optimizeDeps: {
      include: ["framer-motion", "react", "react-dom", "react-router-dom"],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },

    build: {
      target: "es2020",
      minify: isProd ? "esbuild" : false,
      sourcemap: isDev ? "inline" : false,
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,

      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "animation-vendor": ["framer-motion"],
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/").pop().replace(".js", "")
              : "chunk";
            return `js/${facadeModuleId}-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            const _ext = info[info.length - 1];
            if (/\.(mp3|wav|ogg|m4a)$/i.test(assetInfo.name)) {
              return `audio/[name]-[hash][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
    },

    server: {
      host: true,
      port: 3000,
      strictPort: false,
      hmr: {
        overlay: isDev,
      },
      cors: true,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      host: true,
      port: 4173,
      strictPort: false,
    },

    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  };
});
