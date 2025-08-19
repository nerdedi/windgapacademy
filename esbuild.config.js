const esbuild = require('esbuild');
const { minify } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

// CSS bundling/minification
esbuild.build({
  entryPoints: ['styles/windgap-academy.css'],
  bundle: true,
  minify: true,
  outfile: 'dist/windgap-academy.min.css',
  watch: process.argv.includes('--watch'),
}).catch(() => process.exit(1));

// JS bundling/minification
esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/app.bundle.js',
  sourcemap: true,
  watch: process.argv.includes('--watch'),
}).catch(() => process.exit(1));

// HTML minification
const htmlPath = path.join(__dirname, 'index.html');
const htmlOut = path.join(__dirname, 'dist/index.html');
if (fs.existsSync(htmlPath)) {
  fs.readFile(htmlPath, 'utf8', async (err, data) => {
    if (err) throw err;
    const minified = await minify(data, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
    fs.writeFile(htmlOut, minified, err => {
      if (err) throw err;
    });
  });
}
