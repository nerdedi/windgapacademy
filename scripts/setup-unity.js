#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🎮 Windgap Academy Unity Setup Script");
console.log("=====================================\n");

// Create necessary directories
const directories = [
  "public/unity-builds",
  "public/unity-builds/windgap-academy",
  "public/unity-builds/windgap-academy/Build",
  "public/unity-builds/windgap-academy/TemplateData",
];

console.log("📁 Creating Unity build directories...");
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`✓ Exists: ${dir}`);
  }
});

// Create a placeholder Unity config
const unityConfig = {
  dataUrl: "/unity-builds/windgap-academy/Build/windgap-academy.data",
  frameworkUrl: "/unity-builds/windgap-academy/Build/windgap-academy.framework.js",
  codeUrl: "/unity-builds/windgap-academy/Build/windgap-academy.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "Windgap Academy",
  productName: "Windgap Academy",
  productVersion: "1.0.0",
  showBanner: false,
  matchWebGLToCanvasSize: true,
  devicePixelRatio: 1,
};

const configPath = "public/unity-builds/unity-config.json";
fs.writeFileSync(configPath, JSON.stringify(unityConfig, null, 2));
console.log(`✅ Created Unity config: ${configPath}`);

// Create a simple HTML template for testing
const testTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Windgap Academy Unity Test</title>
    <style>
        body { margin: 0; padding: 20px; background: #1a1a1a; color: white; font-family: Arial, sans-serif; }
        #unity-container { width: 100%; height: 600px; background: #333; border-radius: 10px; }
        .info { background: #2a2a2a; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="info">
        <h1>🎮 Windgap Academy Unity Test Page</h1>
        <p>This page will load your Unity WebGL build when you place the files in the correct location.</p>
        <p><strong>Required files:</strong></p>
        <ul>
            <li>Build/windgap-academy.data</li>
            <li>Build/windgap-academy.framework.js</li>
            <li>Build/windgap-academy.wasm</li>
            <li>Build/windgap-academy.loader.js</li>
        </ul>
    </div>
    
    <div id="unity-container">
        <div style="text-align: center; padding-top: 250px;">
            <h2>Unity Build Not Found</h2>
            <p>Place your Unity WebGL build files in public/unity-builds/windgap-academy/</p>
        </div>
    </div>

    <script>
        // This will be replaced with actual Unity loader when build files are present
        console.log('Unity test page loaded');
        console.log('Place Unity build files in: public/unity-builds/windgap-academy/Build/');
    </script>
</body>
</html>`;

const testPath = "public/unity-builds/test.html";
fs.writeFileSync(testPath, testTemplate);
console.log(`✅ Created test page: ${testPath}`);

// Create package.json scripts if they don't exist
const packageJsonPath = "package.json";
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Add Unity-related scripts
  const unityScripts = {
    "unity:setup": "node scripts/setup-unity.js",
    "unity:test":
      "echo 'Open http://localhost:3000/unity-builds/test.html to test Unity integration'",
    "unity:copy": "echo 'Copy your Unity WebGL build to public/unity-builds/windgap-academy/'",
  };

  let scriptsAdded = false;
  Object.entries(unityScripts).forEach(([key, value]) => {
    if (!packageJson.scripts[key]) {
      packageJson.scripts[key] = value;
      scriptsAdded = true;
    }
  });

  if (scriptsAdded) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Added Unity scripts to package.json");
  }
}

console.log("\n🎯 Setup Complete!");
console.log("==================");
console.log("\n📋 Next Steps:");
console.log("1. Create your Unity project using Unity 2023.2 LTS");
console.log("2. Copy the provided C# scripts to your Unity project");
console.log("3. Build for WebGL platform");
console.log("4. Copy the build files to: public/unity-builds/windgap-academy/");
console.log("5. Test at: http://localhost:3000/unity-builds/test.html");
console.log("\n🚀 Your React app is now ready for Unity integration!");

// Create a simple README for Unity integration
const readmeContent = `# Unity Integration for Windgap Academy

## Quick Start

1. **Install Unity Hub** and **Unity 2023.2 LTS**
2. **Create new Unity project** with 3D (URP) template
3. **Copy the provided C# scripts** to your Unity project
4. **Build for WebGL** platform
5. **Copy build files** to \`public/unity-builds/windgap-academy/\`

## File Structure

\`\`\`
public/unity-builds/windgap-academy/
├── Build/
│   ├── windgap-academy.data
│   ├── windgap-academy.framework.js
│   ├── windgap-academy.wasm
│   └── windgap-academy.loader.js
└── TemplateData/
    └── style.css
\`\`\`

## Testing

- Test page: http://localhost:3000/unity-builds/test.html
- Main integration: Launch any Unity experience from the 3D Experiences page

## Scripts

- \`npm run unity:setup\` - Run this setup script
- \`npm run unity:test\` - Instructions for testing
- \`npm run unity:copy\` - Instructions for copying build files

## Unity Project Setup

1. Create Unity project with these settings:
   - Template: 3D (URP)
   - Platform: WebGL
   - Compression: Brotli
   - Memory: 512MB

2. Copy these scripts to your Unity project:
   - GameManager.cs → Assets/_Project/Scripts/Core/
   - CharacterController.cs → Assets/_Project/Scripts/Characters/
   - NatalieController.cs → Assets/_Project/Scripts/Characters/
   - AnimationManager.cs → Assets/_Project/Scripts/Animation/

3. Build Settings:
   - File → Build Settings
   - Platform: WebGL
   - Player Settings → Publishing Settings → Compression Format: Brotli
   - Build

4. Copy build output to \`public/unity-builds/windgap-academy/\`

## Troubleshooting

- **Build fails**: Check Unity console for errors
- **WebGL not loading**: Check browser console for errors
- **Files not found**: Verify file paths match exactly
- **Performance issues**: Reduce quality settings in Unity

For detailed implementation guide, see: unity-implementation-guide.md
`;

fs.writeFileSync("UNITY_INTEGRATION.md", readmeContent);
console.log("✅ Created UNITY_INTEGRATION.md guide");
