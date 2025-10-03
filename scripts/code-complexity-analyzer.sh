#!/bin/bash

# code-complexity-analyzer.sh
# This script analyzes the codebase for complexity issues and provides refactoring recommendations

echo "╔════════════════════════════════════════════════╗"
echo "║   Windgap Academy Code Complexity Analyzer    ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Create output directory
REPORT_DIR="./tmp/code-analysis"
mkdir -p "$REPORT_DIR"

# Function to print section headers
print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Find large files (over 300 lines)
print_header "LARGE FILES (>300 LINES)"
echo "These files may violate the Single Responsibility Principle and should be refactored:"
find ./src ./components -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" | xargs wc -l 2>/dev/null | awk '$1 > 300 {print $0}' | sort -nr > "$REPORT_DIR/large_files.txt"
cat "$REPORT_DIR/large_files.txt"
echo ""
echo "✓ Full list saved to $REPORT_DIR/large_files.txt"

# Find files with many imports (potential high coupling)
print_header "FILES WITH HIGH COUPLING"
echo "Files with more than 15 imports may have too many dependencies:"
find ./src ./components -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" | while read -r file; do
  imports=$(grep -c "^import " "$file")
  if [ "$imports" -gt 15 ]; then
    echo "$imports imports: $file"
  fi
done | sort -nr > "$REPORT_DIR/high_coupling.txt"
cat "$REPORT_DIR/high_coupling.txt"
echo ""
echo "✓ Full list saved to $REPORT_DIR/high_coupling.txt"

# Find long functions/methods
print_header "LONG FUNCTIONS"
echo "Functions with more than 50 lines may be doing too much:"
grep -r "function" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" ./src ./components | wc -l > "$REPORT_DIR/function_count.txt"
echo "Total functions found: $(cat "$REPORT_DIR/function_count.txt")"

# This is a basic approach - a more accurate analysis would require an AST parser
echo "Checking for long function bodies..."
node -e "
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

async function findLongFunctions(dir, extensions, minLines) {
  const longFunctions = [];

  async function processFile(filePath) {
    if (!extensions.includes(path.extname(filePath))) return;

    try {
      const content = await readFile(filePath, 'utf8');
      const lines = content.split('\\n');

      let functionStartLine = -1;
      let openBraces = 0;
      let functionName = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Very basic function detection - would need a proper parser for accuracy
        if ((line.includes('function') || line.includes('=>')) &&
            functionStartLine === -1 &&
            !line.includes('import') &&
            line.includes('{')) {
          functionStartLine = i;
          // Extract function name with a simple regex
          const match = line.match(/function\\s+([\\w$]+)|const\\s+([\\w$]+)\\s*=\\s*function|([\\w$]+)\\s*:\\s*function|([\\w$]+)\\s*=\\s*\\(/);
          functionName = match ? match[1] || match[2] || match[3] || match[4] || 'anonymous' : 'anonymous';
          openBraces = 1;
          continue;
        }

        if (functionStartLine !== -1) {
          openBraces += (line.match(/{/g) || []).length;
          openBraces -= (line.match(/}/g) || []).length;

          if (openBraces === 0) {
            const functionLength = i - functionStartLine + 1;
            if (functionLength >= minLines) {
              longFunctions.push({
                file: filePath,
                name: functionName,
                start: functionStartLine + 1,
                end: i + 1,
                length: functionLength
              });
            }
            functionStartLine = -1;
            functionName = '';
          }
        }
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }

  async function traverse(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip node_modules and other common directories to exclude
      if (entry.name === 'node_modules' || entry.name === '.git' ||
          entry.name === 'build' || entry.name === 'dist') {
        continue;
      }

      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else {
        await processFile(fullPath);
      }
    }
  }

  await traverse(dir);
  return longFunctions;
}

async function main() {
  try {
    const longFunctions = await findLongFunctions('./src', ['.js', '.jsx', '.ts', '.tsx'], 50);
    longFunctions.sort((a, b) => b.length - a.length);

    const reportPath = './tmp/code-analysis/long_functions.json';
    await writeFile(reportPath, JSON.stringify(longFunctions, null, 2));

    // Print the top 10 longest functions
    console.log(\`Found \${longFunctions.length} functions with more than 50 lines.\`);
    console.log('\\nTop 10 longest functions:');
    for (let i = 0; i < Math.min(10, longFunctions.length); i++) {
      const fn = longFunctions[i];
      console.log(\`\${fn.length} lines: \${fn.file} - \${fn.name}() (lines \${fn.start}-\${fn.end})\`);
    }
  } catch (err) {
    console.error('Error analyzing functions:', err);
  }
}

main();" 2>/dev/null || echo "Function analysis failed. Node.js may not be available."

echo ""
echo "✓ Function analysis saved to $REPORT_DIR/long_functions.json"

# Find potential duplicate code (similar file names)
print_header "POTENTIAL CODE DUPLICATION"
echo "Files with similar names that might contain duplicated logic:"

# Find all component files
find ./src ./components -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" | sort > "$REPORT_DIR/all_files.txt"

# Extract just the filenames
cat "$REPORT_DIR/all_files.txt" | xargs -n1 basename | sort > "$REPORT_DIR/filenames.txt"

# Find duplicate filenames (ignoring directory)
cat "$REPORT_DIR/filenames.txt" | sort | uniq -d > "$REPORT_DIR/duplicate_filenames.txt"

if [ -s "$REPORT_DIR/duplicate_filenames.txt" ]; then
  echo "Found files with identical names in different directories:"
  cat "$REPORT_DIR/duplicate_filenames.txt"

  # Show full paths for duplicate files
  echo ""
  echo "Full paths to these files:"
  while IFS= read -r filename; do
    grep "/$filename$" "$REPORT_DIR/all_files.txt"
  done < "$REPORT_DIR/duplicate_filenames.txt"
else
  echo "No duplicate filenames found."
fi

echo ""
echo "Looking for similar component names..."
find ./src ./components -name "*Component.jsx" -o -name "*Component.tsx" | sort > "$REPORT_DIR/component_files.txt"
if [ -s "$REPORT_DIR/component_files.txt" ]; then
  echo "Found potential duplicate components:"
  cat "$REPORT_DIR/component_files.txt"
else
  echo "No obvious component duplicates found."
fi

echo ""
echo "✓ Duplication analysis saved to $REPORT_DIR/duplicate_filenames.txt"

# Analyze folder structure for separation of concerns
print_header "FOLDER STRUCTURE ANALYSIS"
echo "Examining folder structure for separation of concerns..."

# Count components, hooks, utils, etc.
component_count=$(find ./src ./components -name "*.jsx" -o -name "*.tsx" | wc -l)
hook_count=$(find ./src -path "*/hooks/*" -name "*.js" -o -name "*.ts" | wc -l)
util_count=$(find ./src -path "*/utils/*" -name "*.js" -o -name "*.ts" | wc -l)
context_count=$(find ./src -path "*/context*/*" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | wc -l)

echo "Component count: $component_count"
echo "Hook count: $hook_count"
echo "Utility function count: $util_count"
echo "Context files: $context_count"
echo ""

# Check for components outside of component folders
outside_components=$(find ./src -maxdepth 1 -name "*.jsx" -o -name "*.tsx" | wc -l)
if [ "$outside_components" -gt 0 ]; then
  echo "WARNING: Found $outside_components component files directly in src/ folder."
  echo "These should be moved to a components/ directory for better organization."
fi

# Check for state management consistency
contexts_dir=$(find ./src -name "contexts" -type d | wc -l)
context_dir=$(find ./src -name "context" -type d | wc -l)

if [ "$contexts_dir" -gt 0 ] && [ "$context_dir" -gt 0 ]; then
  echo "WARNING: Found both 'contexts' and 'context' directories."
  echo "Recommend standardizing on one naming convention for better consistency."
fi

echo ""
echo "✓ Structure analysis completed"

# Generate report on modularization opportunities
print_header "MODULARIZATION OPPORTUNITIES"

echo "Recommended actions based on analysis:"
echo ""
echo "1. Break down large components:"
echo "   - Focus first on files over 300 lines (see $REPORT_DIR/large_files.txt)"
echo "   - Extract presentational components from containers"
echo "   - Create custom hooks for complex logic"
echo ""
echo "2. Reduce coupling:"
echo "   - Components with many imports should be refactored (see $REPORT_DIR/high_coupling.txt)"
echo "   - Consider context API or state management libraries for deeply nested prop passing"
echo "   - Use dependency injection for services"
echo ""
echo "3. Address function complexity:"
echo "   - Split functions over 50 lines into smaller, focused functions"
echo "   - Use function composition for complex operations"
echo "   - Consider using the strategy pattern for functions with many conditionals"
echo ""
echo "4. Standardize project structure:"
echo "   - Move to a feature-based organization as outlined in CODE_REFACTORING_GUIDE.md"
echo "   - Standardize on consistent naming conventions"
echo "   - Create barrel exports (index.js files) for cleaner imports"
echo ""
echo "5. Eliminate duplication:"
echo "   - Check similar files for duplicate code (see $REPORT_DIR/duplicate_filenames.txt)"
echo "   - Create shared components for repeated UI patterns"
echo "   - Extract shared logic into utility functions"

echo ""
echo "Analysis complete. See $REPORT_DIR/ for detailed reports."
echo "For comprehensive refactoring guidance, refer to /workspaces/windgapacademy/docs/CODE_REFACTORING_GUIDE.md"
