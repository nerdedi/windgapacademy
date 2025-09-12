import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  return {
    plugins: [
      react({
        // Enable Fast Refresh for development
        fastRefresh: isDev,
        // Optimize JSX for production
        jsxRuntime: "automatic",
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
    },

    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify(process.env.npm_package_version || "2.0.0"),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },

    optimizeDeps: {
      include: ["framer-motion", "react", "react-dom", "react-router-dom"],
    },

    build: {
      target: "es2020",
      minify: isProd ? "terser" : false,
      sourcemap: isDev ? "inline" : false,

      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.info"],
              passes: 2,
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            },
          }
        : {},

      rollupOptions: {
        output: {
          manualChunks: {
            // Core React libraries
            "react-vendor": ["react", "react-dom", "react-router-dom"],

            // Animation libraries
            "animation-vendor": ["framer-motion"],
          },

          // Optimize chunk naming for caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/").pop().replace(".js", "")
              : "chunk";
            return `js/${facadeModuleId}-[hash].js`;
          },

          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            const ext = info[info.length - 1];
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

      chunkSizeWarningLimit: 1000,

      // Enable CSS code splitting
      cssCodeSplit: true,

      // Optimize asset handling
      assetsInlineLimit: 4096,
    },

    server: {
      host: true,
      port: 3000,
      strictPort: false,

      hmr: {
        overlay: isDev,
        port: 3001,
      },

      // Enable CORS for development
      cors: true,

      // Proxy configuration for API calls
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

    // CSS configuration
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // Environment variables
    envPrefix: ["VITE_", "WINDGAP_"],

    // Worker configuration for Web Workers
    worker: {
      format: "es",
    },
  };
});
