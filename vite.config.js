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
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "framer-motion",
        "firebase/app",
        "firebase/auth",
        "firebase/firestore",
      ],
      exclude: ["three", "@react-three/fiber", "@react-three/drei"],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
        target: "es2020",
      },
    },

    build: {
      target: "es2020",
      minify: isProd ? "esbuild" : false,
      sourcemap: isDev ? "inline" : false,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,

      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React libraries
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
              return "react-vendor";
            }
            // React Router
            if (id.includes("node_modules/react-router")) {
              return "router-vendor";
            }
            // Animation libraries
            if (id.includes("node_modules/framer-motion")) {
              return "animation-vendor";
            }
            // Three.js and 3D libraries
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "three-vendor";
            }
            // Firebase
            if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
              return "firebase-vendor";
            }
            // UI libraries
            if (id.includes("node_modules/@headlessui") || id.includes("node_modules/@heroicons")) {
              return "ui-vendor";
            }
            // Stores (keep together for better performance)
            if (id.includes("/src/stores/")) {
              return "stores";
            }
            // Components by category
            if (id.includes("/src/components/lessonModules/")) {
              return "lesson-modules";
            }
            if (id.includes("/src/components/curriculum/")) {
              return "curriculum";
            }
            if (id.includes("/src/pages/Tools/")) {
              return "tools-pages";
            }
            // Analytics and adaptive features
            if (id.includes("/src/analytics/") || id.includes("/src/adaptive/")) {
              return "adaptive-features";
            }
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
      fs: {
        strict: true,
        allow: [resolve(__dirname)],
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
