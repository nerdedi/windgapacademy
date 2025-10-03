#!/usr/bin/env node

/**
 * component-dependency-visualizer.js
 *
 * This script analyzes component dependencies in the Windgap Academy codebase
 * and generates a visualization showing the relationships between components.
 *
 * Usage:
 *   node scripts/component-dependency-visualizer.js
 *
 * Output:
 *   - Generates an HTML file with a visual dependency graph
 */

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

// Configuration
const DIRS_TO_SCAN = ["./src", "./components"];
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
const OUTPUT_DIR = "./tmp/dependency-analysis";
const OUTPUT_FILE = "component-dependencies.html";

// Data structures to hold component relationships
const components = new Map();
const dependencies = [];

/**
 * Find all React components in the specified directories
 */
async function findComponents() {
  for (const dir of DIRS_TO_SCAN) {
    if (!fs.existsSync(dir)) continue;
    await scanDirectory(dir);
  }

  console.log(`Found ${components.size} components in the codebase.`);
}

/**
 * Recursively scan a directory for component files
 */
async function scanDirectory(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and other excluded directories
      if (entry.isDirectory()) {
        if (!["node_modules", ".git", "build", "dist"].includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else if (EXTENSIONS.includes(path.extname(entry.name))) {
        await analyzeFile(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err);
  }
}

/**
 * Analyze a file to find component definitions and imports
 */
async function analyzeFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");

    // Look for component definition
    // This is a simplistic approach - a proper AST parser would be more accurate
    const componentMatch = content.match(
      /(?:function|class|const)\s+([A-Z][A-Za-z0-9]+)\s*(?:extends\s+React\.Component|\(|\=)/g,
    );

    if (componentMatch) {
      // Get the component name(s)
      componentMatch.forEach((match) => {
        const name = match.replace(/(?:function|class|const)\s+/, "").split(/[\s\(=]/)[0];
        if (/^[A-Z]/.test(name)) {
          // Only consider components (PascalCase)
          components.set(name, {
            name,
            path: filePath,
            imports: [],
          });
        }
      });
    }

    // Look for component imports
    const importLines =
      content.match(/import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['""][^'""]+['""];?/g) || [];

    importLines.forEach((line) => {
      const importedComponents = [];

      // Extract named imports
      const namedMatch = line.match(/import\s+{([^}]+)}/);
      if (namedMatch) {
        const namedImports = namedMatch[1].split(",").map((imp) => imp.trim().split(/\s+as\s+/)[0]);
        importedComponents.push(...namedImports);
      }

      // Extract default imports
      const defaultMatch = line.match(/import\s+([A-Z][A-Za-z0-9]+)\s+from/);
      if (defaultMatch) {
        importedComponents.push(defaultMatch[1]);
      }

      // Get the source path
      const sourceMatch = line.match(/from\s+['"]([^'"]+)['"]/);
      if (sourceMatch) {
        const source = sourceMatch[1];

        // Add to component imports if this file defines a component
        importedComponents.forEach((importName) => {
          if (/^[A-Z]/.test(importName)) {
            // Only consider components (PascalCase)
            // Store the dependency info for later analysis
            dependencies.push({
              from: path.basename(filePath, path.extname(filePath)),
              to: importName,
              sourcePath: source,
            });
          }
        });
      }
    });
  } catch (err) {
    console.error(`Error analyzing file ${filePath}:`, err);
  }
}

/**
 * Generate the HTML visualization
 */
async function generateVisualization() {
  // Create output directory if it doesn't exist
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error("Error creating output directory:", err);
      return;
    }
  }

  // Prepare data for visualization
  const nodes = [...components.values()].map((comp, i) => ({
    id: comp.name,
    label: comp.name,
    title: `<b>${comp.name}</b><br/>${comp.path}`,
    group: getComponentGroup(comp.path),
  }));

  const edges = dependencies
    .filter((dep) => {
      // Only include edges where both components are detected
      return [...components.keys()].includes(dep.to);
    })
    .map((dep) => ({
      from: dep.from,
      to: dep.to,
      arrows: "to",
    }));

  // Generate HTML with vis.js visualization
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Windgap Academy Component Dependency Graph</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style type="text/css">
      #mynetwork {
        width: 100%;
        height: 800px;
        border: 1px solid lightgray;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        color: #333;
      }
      .info-panel {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .controls {
        margin-bottom: 20px;
      }
      button {
        padding: 8px 16px;
        margin-right: 10px;
        background: #0366d6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background: #0255b3;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 10px;
      }
      .color-box {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <h1>Windgap Academy Component Dependency Graph</h1>
    
    <div class="info-panel">
      <p>This visualization shows dependencies between components in the Windgap Academy codebase.</p>
      <p>Arrows indicate import relationships. Hover over nodes to see file paths.</p>
      <p>Components are color-coded by directory.</p>
      
      <div class="legend">
        <div class="legend-item">
          <div class="color-box" style="background-color: #97C2FC;"></div>
          <span>UI Components</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #FB7E81;"></div>
          <span>Features</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #7BE141;"></div>
          <span>Pages</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #FFA500;"></div>
          <span>Layout</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #6E6EFD;"></div>
          <span>Other</span>
        </div>
      </div>
    </div>
    
    <div class="controls">
      <button id="zoom-fit">Fit View</button>
      <button id="toggle-physics">Toggle Physics</button>
    </div>
    
    <div id="mynetwork"></div>
    
    <script type="text/javascript">
      // Create a network
      const container = document.getElementById('mynetwork');
      
      const data = {
        nodes: new vis.DataSet(${JSON.stringify(nodes)}),
        edges: new vis.DataSet(${JSON.stringify(edges)})
      };
      
      const options = {
        nodes: {
          shape: 'dot',
          size: 16,
          font: {
            size: 14
          }
        },
        edges: {
          width: 1,
          smooth: {
            type: 'continuous'
          }
        },
        physics: {
          stabilization: true,
          barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200
          }
        },
        groups: {
          ui: { color: { background: '#97C2FC', border: '#2B7CE9' } },
          feature: { color: { background: '#FB7E81', border: '#E6194B' } },
          page: { color: { background: '#7BE141', border: '#3CB44B' } },
          layout: { color: { background: '#FFA500', border: '#E67E00' } },
          other: { color: { background: '#6E6EFD', border: '#0000FF' } }
        },
        layout: {
          hierarchical: {
            enabled: false
          }
        }
      };
      
      const network = new vis.Network(container, data, options);
      
      // Event handlers
      document.getElementById('zoom-fit').addEventListener('click', function() {
        network.fit();
      });
      
      let physicsEnabled = true;
      document.getElementById('toggle-physics').addEventListener('click', function() {
        physicsEnabled = !physicsEnabled;
        network.setOptions({ physics: { enabled: physicsEnabled } });
      });
      
      // Display info when network stabilizes
      network.on("stabilizationIterationsDone", function () {
        console.log("Stabilization done");
        document.querySelector('.info-panel').innerHTML += '<p>Graph rendering complete. Use mouse wheel to zoom and drag to pan.</p>';
      });
    </script>
  </body>
  </html>
  `;

  // Write the HTML file
  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  await writeFile(outputPath, html);

  console.log(`Visualization generated at ${outputPath}`);
  console.log(`Open this file in a browser to view the component dependencies.`);
}

/**
 * Determine the group (color) for a component based on its path
 */
function getComponentGroup(filePath) {
  if (filePath.includes("/ui/") || filePath.includes("/components/ui/")) {
    return "ui";
  } else if (filePath.includes("/features/") || filePath.includes("/components/features/")) {
    return "feature";
  } else if (filePath.includes("/pages/")) {
    return "page";
  } else if (filePath.includes("/layout/") || filePath.includes("/components/layout/")) {
    return "layout";
  } else {
    return "other";
  }
}

/**
 * Main function
 */
async function main() {
  console.log("Starting component dependency analysis...");
  await findComponents();
  await generateVisualization();
  console.log("Analysis complete.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
