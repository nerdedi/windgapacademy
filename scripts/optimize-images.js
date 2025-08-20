// Image optimization and WebP conversion using sharp
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../assets/images');
const outputDir = path.join(__dirname, '../assets/images-optimized');
const webpDir = path.join(__dirname, '../assets/images-webp');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir, { recursive: true });

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);
  const webpPath = path.join(webpDir, file.replace(ext, '.webp'));

  // Optimize and save original format
  sharp(inputPath)
    .toFile(outputPath)
    .then(() => console.log(`Optimized: ${file}`))
    .catch(err => console.error(`Error optimizing ${file}:`, err));

  // Convert to WebP
  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(webpPath)
    .then(() => console.log(`Converted to WebP: ${file}`))
    .catch(err => console.error(`Error converting ${file} to WebP:`, err));
});
