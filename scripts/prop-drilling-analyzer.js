#!/usr/bin/env node

/**
 * prop-drilling-analyzer.js
 *
 * This script analyzes the component tree to identify excessive prop drilling,
 * which can indicate components that would benefit from using React Context
 * or other state management solutions.
 *
 * Usage:
 *   node scripts/prop-drilling-analyzer.js [--threshold=3] [--dir=./src]
 *
 * Options:
 *   --threshold=N   Minimum depth of prop drilling to report (default: 3)
 *   --dir=PATH      Directory to scan (default: ./src)
 */

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Parse command line arguments
const args = process.argv.slice(2);
let threshold = 3;
let scanDir = "./src";

for (const arg of args) {
  if (arg.startsWith("--threshold=")) {
    threshold = parseInt(arg.split("=")[1]);
  } else if (arg.startsWith("--dir=")) {
    scanDir = arg.split("=")[1];
  }
}

// Data structures
const components = new Map(); // Component name -> Component info
const propPaths = new Map(); // Prop name -> Array of paths
const outputDir = "./tmp/prop-drilling";

/**
 * Main function
 */
async function main() {
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║    Windgap Academy Prop Drilling Analyzer     ║");
  console.log("╚════════════════════════════════════════════════╝");
  console.log(`\nAnalyzing components for prop drilling with threshold ${threshold}...\n`);

  try {
    // Create output directory
    await mkdir(outputDir, { recursive: true });

    // Scan for components
    await scanForComponents(scanDir);

    // Analyze prop drilling
    await analyzePropDrilling();

    // Generate report
    await generateReport();

    console.log(`\nAnalysis complete. Report saved to ${outputDir}/prop-drilling-report.html`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

/**
 * Scan for components recursively
 */
async function scanForComponents(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.warn(`Directory ${dir} does not exist, skipping`);
      return;
    }

    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and other common directories to exclude
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === "build" ||
        entry.name === "dist"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await scanForComponents(fullPath);
      } else if (isReactComponentFile(entry.name)) {
        await analyzeComponentFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

/**
 * Check if a file is likely a React component
 */
function isReactComponentFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return (
    (ext === ".jsx" || ext === ".tsx" || ext === ".js" || ext === ".ts") &&
    !filename.includes(".test.") &&
    !filename.includes(".spec.")
  );
}

/**
 * Analyze a single component file
 */
async function analyzeComponentFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");

    // Look for component definitions using simplistic regex approach
    // A more robust solution would use an AST parser
    const componentRegex = /(?:function|const|class)\s+([A-Z][A-Za-z0-9_]+)\s*(?:=|\(|extends)/g;
    let match;

    while ((match = componentRegex.exec(content)) !== null) {
      const componentName = match[1];

      // Skip if it doesn't look like a component name (PascalCase)
      if (!/^[A-Z]/.test(componentName)) continue;

      // Analyze props
      const props = extractProps(content, componentName);

      components.set(componentName, {
        name: componentName,
        path: filePath,
        props,
        usedProps: new Set(),
        children: new Set(),
      });

      // Find child components
      const childComponents = findChildComponents(content, [...components.keys()]);
      const component = components.get(componentName);
      component.children = new Set(childComponents);
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
  }
}

/**
 * Extract props from a component definition
 */
function extractProps(content, componentName) {
  const props = new Set();

  // Look for props in function parameters
  const funcPropsRegex = new RegExp(
    `(?:function|const)\\s+${componentName}\\s*=?\\s*\\(\\s*(?:{([^}]+)}|([\\w]+))`,
    "g",
  );
  const funcMatch = funcPropsRegex.exec(content);

  if (funcMatch) {
    if (funcMatch[1]) {
      // Destructured props
      const propsStr = funcMatch[1];
      const propNames = propsStr.split(",").map((p) => p.trim().split(":")[0].split("=")[0].trim());
      propNames.forEach((prop) => {
        if (prop && !prop.includes("...")) props.add(prop);
      });
    }
  }

  // Look for prop usage with dot notation (props.something)
  const dotPropsRegex = /props\.(\w+)/g;
  let dotMatch;

  while ((dotMatch = dotPropsRegex.exec(content)) !== null) {
    props.add(dotMatch[1]);
  }

  return [...props];
}

/**
 * Find child components used in a component
 */
function findChildComponents(content, knownComponents) {
  const childComponents = [];

  // Look for JSX usage of components
  for (const component of knownComponents) {
    const jsxRegex = new RegExp(`<${component}[\\s>]`, "g");
    if (jsxRegex.test(content)) {
      childComponents.push(component);
    }
  }

  return childComponents;
}

/**
 * Analyze prop drilling through the component tree
 */
async function analyzePropDrilling() {
  // For each prop in each component
  for (const [componentName, component] of components.entries()) {
    for (const prop of component.props) {
      // Initialize prop path if it doesn't exist
      if (!propPaths.has(prop)) {
        propPaths.set(prop, []);
      }

      // Find prop drilling paths starting from this component
      const paths = findPropDrillingPaths(componentName, prop, [], new Set());
      propPaths.get(prop).push(...paths);
    }
  }

  // Filter paths by threshold
  for (const [prop, paths] of propPaths.entries()) {
    const filteredPaths = paths.filter((path) => path.length >= threshold);
    propPaths.set(prop, filteredPaths);

    // Remove props with no significant drilling
    if (filteredPaths.length === 0) {
      propPaths.delete(prop);
    }
  }
}

/**
 * Recursively find prop drilling paths through the component tree
 */
function findPropDrillingPaths(componentName, prop, currentPath, visited) {
  // Avoid cycles
  if (visited.has(componentName)) {
    return [];
  }

  // Add component to current path
  const newPath = [...currentPath, componentName];
  visited.add(componentName);

  // Get component info
  const component = components.get(componentName);
  if (!component) {
    return [];
  }

  const paths = [];

  // If the component passes this prop to its children, follow those paths
  for (const childName of component.children) {
    const childComponent = components.get(childName);
    if (!childComponent) continue;

    // Check if child component uses this prop
    const propRegex = new RegExp(`${prop}\\s*=\\s*{\\s*${prop}\\s*}`, "g");
    const childContent = fs.readFileSync(childComponent.path, "utf8");

    if (propRegex.test(childContent)) {
      // Found prop being passed down
      const childPaths = findPropDrillingPaths(childName, prop, newPath, new Set([...visited]));
      paths.push(...childPaths);

      // If no further drilling, include this path
      if (childPaths.length === 0 && childComponent.props.includes(prop)) {
        paths.push([...newPath, childName]);
      }
    }
  }

  // If this component is a leaf (no further drilling), include this path
  if (paths.length === 0) {
    paths.push(newPath);
  }

  return paths;
}

/**
 * Generate HTML report
 */
async function generateReport() {
  // Sort props by maximum drilling depth
  const sortedProps = [...propPaths.entries()].sort((a, b) => {
    const maxDepthA = Math.max(...a[1].map((path) => path.length));
    const maxDepthB = Math.max(...b[1].map((path) => path.length));
    return maxDepthB - maxDepthA;
  });

  // Generate HTML content
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Windgap Academy Prop Drilling Report</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #0366d6;
        border-bottom: 1px solid #eaecef;
        padding-bottom: 10px;
      }
      h2 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        color: #24292e;
      }
      .prop-section {
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f6f8fa;
        border-radius: 5px;
      }
      .prop-name {
        font-weight: bold;
        color: #d73a49;
      }
      .path-list {
        margin-left: 20px;
      }
      .path {
        background-color: white;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .component {
        display: inline-block;
        padding: 3px 6px;
        font-family: monospace;
        background-color: #e1e4e8;
        border-radius: 3px;
        margin: 2px;
      }
      .arrow {
        color: #6a737d;
        margin: 0 5px;
      }
      .path-length {
        color: #6a737d;
        font-style: italic;
        margin-left: 10px;
      }
      .recommendations {
        background-color: #f1f8ff;
        padding: 15px;
        border-left: 4px solid #0366d6;
        margin-bottom: 20px;
      }
      .summary {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .stats {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 20px;
      }
      .stat-box {
        flex: 1;
        background-color: #f6f8fa;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        min-width: 150px;
      }
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #0366d6;
        display: block;
      }
      .stat-label {
        color: #6a737d;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>Windgap Academy Prop Drilling Report</h1>

    <div class="stats">
      <div class="stat-box">
        <span class="stat-value">${sortedProps.length}</span>
        <span class="stat-label">Props with Drilling Issues</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${components.size}</span>
        <span class="stat-label">Components Analyzed</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${threshold}</span>
        <span class="stat-label">Drilling Threshold</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${sortedProps.length > 0 ? Math.max(...sortedProps.flatMap(([_, paths]) => paths.map((path) => path.length))) : 0}</span>
        <span class="stat-label">Max Drilling Depth</span>
      </div>
    </div>

    <div class="recommendations">
      <p class="summary">Recommendations:</p>
      <ul>
        <li>Consider using React Context for props that are drilled through many components</li>
        <li>For complex state management, consider Redux or Zustand</li>
        <li>Use custom hooks to encapsulate related state and logic</li>
        <li>Use compound components pattern for tightly coupled component hierarchies</li>
        <li>Consider restructuring component hierarchies to minimize prop drilling</li>
      </ul>
    </div>

    <h2>Props with Excessive Drilling</h2>

    ${sortedProps.length === 0 ? "<p>No excessive prop drilling detected.</p>" : ""}

    ${sortedProps
      .map(
        ([prop, paths]) => `
      <div class="prop-section">
        <h3 class="prop-name">${prop}</h3>
        <p>Found in ${paths.length} drilling path${paths.length > 1 ? "s" : ""}</p>

        <div class="path-list">
          ${paths
            .map(
              (path) => `
            <div class="path">
              <span class="path-length">Depth: ${path.length}</span><br>
              ${path.map((comp) => `<span class="component">${comp}</span>`).join('<span class="arrow">→</span>')}
            </div>
          `,
            )
            .join("")}
        </div>

        <p><strong>Recommendation:</strong> ${getRecommendation(prop, paths)}</p>
      </div>
    `,
      )
      .join("")}

    <h2>Next Steps</h2>
    <p>Consider implementing the following refactorings:</p>
    <ol>
      <li>Create React Context providers for the most deeply drilled props</li>
      <li>Refactor components to use the new contexts</li>
      <li>Run this analyzer again to verify improvements</li>
    </ol>

    <script>
      // Add collapsible functionality
      document.querySelectorAll('.prop-name').forEach(elem => {
        elem.addEventListener('click', () => {
          const pathList = elem.parentNode.querySelector('.path-list');
          pathList.style.display = pathList.style.display === 'none' ? 'block' : 'none';
        });
      });
    </script>
  </body>
  </html>
  `;

  // Write HTML report
  await writeFile(path.join(outputDir, "prop-drilling-report.html"), html);

  // Write JSON data for further processing
  await writeFile(
    path.join(outputDir, "prop-drilling-data.json"),
    JSON.stringify(Object.fromEntries(propPaths), null, 2),
  );

  // Print summary to console
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Prop Drilling Analysis Summary`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nAnalyzed ${components.size} components`);
  console.log(
    `Found ${sortedProps.length} props with excessive drilling (threshold: ${threshold})`,
  );

  if (sortedProps.length > 0) {
    console.log(`\nTop 5 props with deepest drilling:`);
    sortedProps.slice(0, 5).forEach(([prop, paths]) => {
      const maxDepth = Math.max(...paths.map((path) => path.length));
      console.log(`- ${prop}: ${maxDepth} components deep`);
    });
  }
}

/**
 * Generate a recommendation based on prop usage patterns
 */
function getRecommendation(prop, paths) {
  const maxDepth = Math.max(...paths.map((path) => path.length));

  if (maxDepth >= 5) {
    return `Create a dedicated React Context for "${prop}" and related props`;
  } else if (maxDepth >= 4) {
    return `Use React Context or consider restructuring component hierarchy`;
  } else {
    return `Consider using a custom hook or compound components pattern`;
  }
}

// Run main function
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
