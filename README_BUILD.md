# Windgap Academy Build & Asset Optimization

## Quick Start

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Development build (watch mode):**
   ```sh
   npm run dev
   ```
3. **Production build (minified):**
   ```sh
   npm run build
   ```
4. **Optimize images:**
   ```sh
   npm run optimize-images
   ```
   - This uses [sharp](https://sharp.pixelplumbing.com/) to compress images and convert them to WebP format for faster loading.
   - Place your source images in `assets/images/` before running the script.

## Output
- Bundled/minified JS and CSS will be in the `dist/` folder.
- Optimized images will be in `assets/images-optimized/` and `assets/images-webp/`.

## Requirements
- Node.js and npm installed on your system.

## Notes
- You can adjust entry points in the scripts if your main JS file is not `app.js`.
- For advanced configuration, see the [esbuild documentation](https://esbuild.github.io/).
- For image optimization, see the [sharp documentation](https://sharp.pixelplumbing.com/).
