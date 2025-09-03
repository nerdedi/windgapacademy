
// scripts/optimize-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../assets/images');
const outputDir = path.join(__dirname, '../dist/assets/images');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Supported image formats
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  if (!supportedExtensions.includes(ext)) {
    console.log(`Skipping unsupported file: ${file}`);
    return;
  }

  sharp(inputPath)
    .resize({ width: 1200 }) // Resize to max width of 1200px
    .toFormat('webp') // Convert to WebP for better compression
    .webp({ quality: 80 })
    .toFile(outputPath.replace(ext, '.webp'))
    .then(() => {
      console.log(`✅ Optimized: ${file}`);
    })
    .catch(err => {
      console.error(`❌ Error optimizing ${file}:`, err);
    });
});
