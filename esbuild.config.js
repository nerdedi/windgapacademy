import fs from "fs";
import process from "node:process";
import path from "path";

import esbuild from "esbuild";
import { minify } from "html-minifier-terser";

const watch = process.argv.includes("--watch");

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["styles/windgap-academy.css"],
      bundle: true,
      minify: true,
      outfile: "dist/windgap-academy.min.css",
      watch,
    });

    await esbuild.build({
      entryPoints: ["app.js"],
      bundle: true,
      minify: true,
      outfile: "dist/app.bundle.js",
      sourcemap: true,
      watch,
    });

    const htmlPath = path.join(process.cwd(), "index.html");
    const htmlOut = path.join(process.cwd(), "dist/index.html");
    if (fs.existsSync(htmlPath)) {
      const data = fs.readFileSync(htmlPath, "utf8");
      const minified = await minify(data, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
      fs.writeFileSync(htmlOut, minified);
    }

    console.log("Build completed.");
  } catch (e) {
    console.error("Build failed:", e);
    process.exit(1);
  }
}

build();
