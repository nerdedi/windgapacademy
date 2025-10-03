#!/usr/bin/env node

/**
 * component-extractor.js
 *
 * This script helps with extracting components from larger components,
 * following the Single Responsibility Principle.
 *
 * Usage:
 *   node scripts/component-extractor.js <source-file> <component-name> <start-line> <end-line>
 *
 * Example:
 *   node scripts/component-extractor.js src/components/Dashboard.jsx FilterPanel 120 180
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error(
    "Usage: node component-extractor.js <source-file> <component-name> <start-line> <end-line>",
  );
  console.error(
    "Example: node component-extractor.js src/components/Dashboard.jsx FilterPanel 120 180",
  );
  process.exit(1);
}

const sourceFile = args[0];
const componentName = args[1];
const startLine = parseInt(args[2]);
const endLine = parseInt(args[3]);

// Check if file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: File ${sourceFile} does not exist`);
  process.exit(1);
}

// Check if line numbers are valid
if (isNaN(startLine) || isNaN(endLine) || startLine < 1 || startLine >= endLine) {
  console.error("Error: Invalid line numbers");
  process.exit(1);
}

// Check if component name is valid (PascalCase)
if (!/^[A-Z][A-Za-z0-9]*$/.test(componentName)) {
  console.error("Error: Component name must be in PascalCase");
  process.exit(1);
}

// Extract the directory and base name from the source file
const sourceDir = path.dirname(sourceFile);
const sourceBaseName = path.basename(sourceFile);
const sourceExt = path.extname(sourceFile);

// Create target file path
const targetFile = path.join(sourceDir, `${componentName}${sourceExt}`);

// Check if target file already exists
if (fs.existsSync(targetFile)) {
  console.error(`Error: Target file ${targetFile} already exists`);
  process.exit(1);
}

/**
 * Extract component code from source file
 */
async function extractComponent() {
  const lines = fs.readFileSync(sourceFile, "utf8").split("\n");

  // Extract the component code
  const componentCode = lines.slice(startLine - 1, endLine).join("\n");

  // Extract imports from the source file
  const importLines = [];
  const reactImportRegex = /import\s+.*React.*\s+from\s+['"]react['"]/;
  let hasReactImport = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("import ")) {
      importLines.push(line);
      if (reactImportRegex.test(line)) {
        hasReactImport = true;
      }
    }
    // Stop when we reach the first non-import statement
    if (line.trim() !== "" && !line.startsWith("import ") && !line.startsWith("//")) {
      break;
    }
  }

  // Add React import if missing
  if (!hasReactImport) {
    importLines.push('import React from "react";');
  }

  // Analyze the extracted code to find props usage
  const propsUsed = findPropsUsed(componentCode);

  // Generate the new component file
  const newComponentCode = generateComponentFile(importLines, componentCode, propsUsed);

  // Write the new component file
  fs.writeFileSync(targetFile, newComponentCode);

  console.log(`Component ${componentName} extracted to ${targetFile}`);

  // Now update the source file to use the new component
  await updateSourceFile(lines, propsUsed);

  console.log(`Source file ${sourceFile} updated to use the extracted component`);
}

/**
 * Find props used in the component code
 */
function findPropsUsed(code) {
  const propsUsed = new Set();

  // Look for prop usage patterns like props.something, { something }, or destructured props
  const propMatches = code.match(/props\.\w+/g) || [];
  propMatches.forEach((match) => {
    propsUsed.add(match.replace("props.", ""));
  });

  // Look for destructured props
  const destructureMatches = code.match(/const\s*{\s*([^}]+)\s*}\s*=\s*props/g) || [];
  destructureMatches.forEach((match) => {
    const innerMatch = match.match(/{\s*([^}]+)\s*}/);
    if (innerMatch) {
      innerMatch[1].split(",").forEach((prop) => {
        const trimmedProp = prop.trim().split(":")[0].split("=")[0].trim();
        if (trimmedProp) {
          propsUsed.add(trimmedProp);
        }
      });
    }
  });

  // Look for other usages by scanning each line
  const lines = code.split("\n");
  const jsxPropRegex = /\s(\w+)=\{/g;

  lines.forEach((line) => {
    let match;
    while ((match = jsxPropRegex.exec(line)) !== null) {
      if (
        !/^(className|style|onClick|onChange|value|id|key|type|href|src|alt|target|rel|name|title|placeholder|disabled|checked|required|readOnly|autoFocus|autoComplete|role|aria-|data-)/.test(
          match[1],
        )
      ) {
        propsUsed.add(match[1]);
      }
    }
  });

  return [...propsUsed];
}

/**
 * Generate the new component file
 */
function generateComponentFile(importLines, componentCode, propsUsed) {
  // Create props interface/type for TypeScript files
  const isTypeScript = targetFile.endsWith(".tsx") || targetFile.endsWith(".ts");
  let propsType = "";

  if (isTypeScript && propsUsed.length > 0) {
    propsType = `\ninterface ${componentName}Props {\n  ${propsUsed.map((prop) => `${prop}: any;`).join("\n  ")}\n}\n`;
  }

  // Create the new component
  const propsList = propsUsed.length > 0 ? `{ ${propsUsed.join(", ")} }` : "props";
  const propsParam =
    isTypeScript && propsUsed.length > 0 ? `(props: ${componentName}Props)` : `(${propsList})`;

  return `${importLines.join("\n")}\n
${propsType}
const ${componentName} = ${propsParam} => {
${componentCode}
};

export default ${componentName};
`;
}

/**
 * Update the source file to use the new component
 */
async function updateSourceFile(lines, propsUsed) {
  // Add import for the new component
  const importLine = `import ${componentName} from './${componentName}';`;

  // Find where to insert the import
  let lastImportIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) {
      lastImportIndex = i;
    } else if (lines[i].trim() !== "" && !lines[i].startsWith("//")) {
      break;
    }
  }

  // Insert the import after the last import
  lines.splice(lastImportIndex + 1, 0, importLine);

  // Create the component JSX with props
  const propsString =
    propsUsed.length > 0 ? propsUsed.map((prop) => `${prop}={${prop}}`).join(" ") : "";

  const componentJsx = `<${componentName} ${propsString} />`;

  // Replace the extracted code with the component usage
  lines.splice(startLine, endLine - startLine, componentJsx);

  // Write the updated source file
  fs.writeFileSync(sourceFile, lines.join("\n"));

  // Ask if the user wants to view a diff
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Would you like to see a diff of the changes? (y/n) ", (answer) => {
    if (answer.toLowerCase() === "y") {
      const { spawn } = require("child_process");
      const diff = spawn("git", ["diff", sourceFile]);

      diff.stdout.on("data", (data) => {
        console.log(data.toString());
      });

      diff.stderr.on("data", (data) => {
        console.error(data.toString());
      });

      diff.on("close", (code) => {
        rl.close();
      });
    } else {
      rl.close();
    }
  });
}

// Run the main function
extractComponent().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
