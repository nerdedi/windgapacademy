#!/usr/bin/env node

/**
 * test-generator.js
 *
 * This script generates test files for React components and utility functions.
 * It analyzes the source file and creates appropriate test boilerplate.
 *
 * Usage:
 *   node scripts/test-generator.js <source-file>
 *
 * Example:
 *   node scripts/test-generator.js src/components/Button.jsx
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: node test-generator.js <source-file>");
  console.error("Example: node test-generator.js src/components/Button.jsx");
  process.exit(1);
}

const sourceFile = args[0];

// Check if file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: File ${sourceFile} does not exist`);
  process.exit(1);
}

// Read the source file
const sourceCode = fs.readFileSync(sourceFile, "utf8");
const fileExt = path.extname(sourceFile);
const fileName = path.basename(sourceFile, fileExt);
const isTypeScript = fileExt === ".ts" || fileExt === ".tsx";
const isReactComponent =
  fileExt === ".jsx" ||
  fileExt === ".tsx" ||
  sourceCode.includes("import React") ||
  sourceCode.includes('from "react"');

// Determine the test file path
let testDir;
const sourceDir = path.dirname(sourceFile);

if (sourceDir.includes("__tests__")) {
  // Source is already in a test directory, put test file alongside it
  testDir = sourceDir;
} else if (fs.existsSync(path.join(sourceDir, "__tests__"))) {
  // There's a __tests__ directory in the source directory
  testDir = path.join(sourceDir, "__tests__");
} else if (fs.existsSync(path.join(process.cwd(), "__tests__"))) {
  // There's a top-level __tests__ directory
  const relativePath = path.relative(process.cwd(), sourceDir);
  testDir = path.join(process.cwd(), "__tests__", relativePath);
} else {
  // Create a __tests__ directory in the source directory
  testDir = path.join(sourceDir, "__tests__");
}

// Create the test directory if it doesn't exist
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`Created test directory: ${testDir}`);
}

// Determine the test file name
const testFilePath = path.join(testDir, `${fileName}.test${isTypeScript ? ".tsx" : ".jsx"}`);

// Check if test file already exists
if (fs.existsSync(testFilePath)) {
  console.error(`Error: Test file ${testFilePath} already exists`);
  process.exit(1);
}

/**
 * Extract component props from source code
 */
function extractProps() {
  const propsRegex = isTypeScript
    ? /interface\s+(\w+Props)\s*\{([^}]+)\}/
    : /const\s+\w+\s*=\s*\(\s*(?:{\s*([^}]+)\s*}|\w+)\s*\)/;

  const propsMatch = sourceCode.match(propsRegex);

  if (propsMatch) {
    if (isTypeScript) {
      // For TypeScript, extract from interface
      return propsMatch[2]
        .split(";")
        .map((prop) => prop.trim())
        .filter((prop) => prop && !prop.startsWith("//"));
    } else {
      // For JavaScript, extract from function parameters
      return propsMatch[1]
        ? propsMatch[1]
            .split(",")
            .map((prop) => prop.trim())
            .filter((prop) => prop && !prop.startsWith("//"))
        : [];
    }
  }

  return [];
}

/**
 * Extract exported functions from source code
 */
function extractExportedFunctions() {
  const functions = [];

  // Match export declarations
  const exportRegex = /export\s+(const|function|default)\s+(\w+)/g;
  let match;

  while ((match = exportRegex.exec(sourceCode)) !== null) {
    if (match[1] !== "default" || match[2] !== fileName) {
      functions.push(match[2]);
    }
  }

  // Look for default export if no exports were found
  if (functions.length === 0) {
    const defaultExportRegex = /export\s+default\s+(\w+)/;
    const defaultMatch = sourceCode.match(defaultExportRegex);

    if (defaultMatch) {
      functions.push(defaultMatch[1]);
    }
  }

  return functions;
}

/**
 * Generate React component test
 */
function generateComponentTest() {
  const props = extractProps();

  return `${isTypeScript ? 'import React from "react";' : ""}
import { render, screen, fireEvent } from '@testing-library/react';
import ${fileName} from '${path
    .relative(testDir, sourceFile)
    .replace(/\\/g, "/")
    .replace(/\.\w+$/, "")}';

describe('${fileName} component', () => {
  const defaultProps = {
${
  props.length > 0
    ? props
        .map((prop) => {
          // Extract prop name from TypeScript interface or JS destructuring
          const propName = isTypeScript ? prop.split(":")[0].trim() : prop.split("=")[0].trim();

          if (!propName) return null;

          // Provide sensible default values based on prop name patterns
          if (propName.includes("on") && propName.startsWith("on")) {
            return `    ${propName}: jest.fn(),`;
          } else if (propName.includes("callback")) {
            return `    ${propName}: jest.fn(),`;
          } else if (propName.includes("enabled") || propName.includes("visible")) {
            return `    ${propName}: true,`;
          } else if (propName.includes("id")) {
            return `    ${propName}: 'test-id',`;
          } else if (propName.includes("name")) {
            return `    ${propName}: 'Test Name',`;
          } else if (propName.includes("title")) {
            return `    ${propName}: 'Test Title',`;
          } else if (propName.includes("items") || propName.includes("data")) {
            return `    ${propName}: [],`;
          } else {
            return `    ${propName}: 'test-value',`;
          }
        })
        .filter(Boolean)
        .join("\n")
    : "    // Add props here as needed"
}
  };

  test('renders correctly', () => {
    render(<${fileName} {...defaultProps} />);
    // Add assertions here
    // Example: expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });

${
  props.some((p) => p.includes("click") || p.includes("onClick"))
    ? `
  test('handles click events', () => {
    const onClick = jest.fn();
    render(<${fileName} {...defaultProps} onClick={onClick} />);
    // Example: fireEvent.click(screen.getByRole('button'));
    // expect(onClick).toHaveBeenCalled();
  });
`
    : ""
}

${
  props.some((p) => p.includes("change") || p.includes("onChange"))
    ? `
  test('handles change events', () => {
    const onChange = jest.fn();
    render(<${fileName} {...defaultProps} onChange={onChange} />);
    // Example: fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
    // expect(onChange).toHaveBeenCalled();
  });
`
    : ""
}

  // Add more tests as needed
});
`;
}

/**
 * Generate utility function test
 */
function generateUtilityTest() {
  const functions = extractExportedFunctions();

  return `import ${functions.length === 1 ? functions[0] : `{ ${functions.join(", ")} }`} from '${path
    .relative(testDir, sourceFile)
    .replace(/\\/g, "/")
    .replace(/\.\w+$/, "")}';

describe('${fileName}', () => {
${functions
  .map(
    (func) => `
  describe('${func}', () => {
    test('should work correctly with valid inputs', () => {
      // TODO: Add test cases with valid inputs
      // const result = ${func}(validInput);
      // expect(result).toEqual(expectedOutput);
    });

    test('should handle edge cases', () => {
      // TODO: Add test cases for edge cases
      // expect(${func}(null)).toEqual(fallbackValue);
    });
  });`,
  )
  .join("\n")}
});
`;
}

/**
 * Write the test file
 */
function writeTestFile() {
  const testContent = isReactComponent ? generateComponentTest() : generateUtilityTest();

  fs.writeFileSync(testFilePath, testContent);
  console.log(`Generated test file: ${testFilePath}`);

  // Provide next steps
  console.log("\nNext steps:");
  console.log("1. Review and complete the test file with specific assertions");
  console.log("2. Run the test with: npm test -- " + path.relative(process.cwd(), testFilePath));
  console.log("3. Consider adding more test cases for edge cases and error handling");
}

// Generate the test file
writeTestFile();

// Ask the user if they want to open the test file
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Would you like to open the generated test file? (y/n) ", (answer) => {
  if (answer.toLowerCase() === "y") {
    const { spawn } = require("child_process");
    const open = spawn("code", [testFilePath]);

    open.stderr.on("data", (data) => {
      console.error(`Error opening file: ${data}`);
    });
  }

  rl.close();
});
