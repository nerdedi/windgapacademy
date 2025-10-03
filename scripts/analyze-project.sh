#!/bin/bash

# analyze-project.sh
# This script analyzes the Windgap Academy codebase for performance issues and complexity

echo "╔════════════════════════════════════════════════╗"
echo "║      Windgap Academy Project Analysis Tool     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Create output directory if it doesn't exist
mkdir -p ./tmp/analysis

# Function to print section headers
print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Analyze directory sizes
print_header "ANALYZING DIRECTORY SIZES"
echo "Finding the largest directories in the project..."
du -h -d 2 | sort -hr | head -15 > ./tmp/analysis/directory_sizes.txt
cat ./tmp/analysis/directory_sizes.txt
echo ""
echo "✓ Directory size analysis saved to ./tmp/analysis/directory_sizes.txt"

# Find large files
print_header "IDENTIFYING LARGE FILES"
echo "Finding files larger than 1MB (excluding node_modules, .git, etc.)..."
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/o3de/*" \
  -size +1000k | sort -n > ./tmp/analysis/large_files.txt
cat ./tmp/analysis/large_files.txt
echo ""
echo "✓ Large files list saved to ./tmp/analysis/large_files.txt"

# Check duplicate files in components and src
print_header "CHECKING FOR DUPLICATE STRUCTURES"
echo "Looking for potential duplicate code structures..."

# Check for similar component names in different directories
find ./components ./src -name "*.jsx" -o -name "*.tsx" | sort > ./tmp/analysis/all_components.txt
cat ./tmp/analysis/all_components.txt | awk -F'/' '{print $NF}' | sort | uniq -d > ./tmp/analysis/duplicate_component_names.txt

if [ -s ./tmp/analysis/duplicate_component_names.txt ]; then
  echo "Found components with the same name in different directories:"
  cat ./tmp/analysis/duplicate_component_names.txt
  echo ""
  
  # Show the locations of these duplicate named components
  while IFS= read -r component; do
    echo "Locations of $component:"
    grep -l "$component" ./tmp/analysis/all_components.txt
    echo ""
  done < ./tmp/analysis/duplicate_component_names.txt
else
  echo "No duplicate component names found."
fi
echo "✓ Duplicate structure analysis saved to ./tmp/analysis/duplicate_component_names.txt"

# Analyze imports
if command -v npx &> /dev/null; then
  print_header "ANALYZING IMPORT COMPLEXITY"
  echo "Checking for circular dependencies (this may take a while)..."
  
  if npx madge --circular ./src > ./tmp/analysis/circular_deps.txt 2>/dev/null; then
    if [ -s ./tmp/analysis/circular_deps.txt ]; then
      echo "Found circular dependencies:"
      cat ./tmp/analysis/circular_deps.txt
    else
      echo "No circular dependencies found."
    fi
    echo "✓ Circular dependency analysis saved to ./tmp/analysis/circular_deps.txt"
  else
    echo "⚠️ madge not available. Install with: npm install -g madge"
  fi
fi

# Check for context duplication
print_header "CHECKING CONTEXT STRUCTURE"
echo "Analyzing context organization..."
find . -path "*/context*/*.js*" | sort > ./tmp/analysis/context_files.txt
echo "Context files found:"
cat ./tmp/analysis/context_files.txt
echo ""
echo "✓ Context structure analysis saved to ./tmp/analysis/context_files.txt"

# Check bundle size if webpack-bundle-analyzer is available
if [ -f "package.json" ] && grep -q "webpack-bundle-analyzer" package.json; then
  print_header "BUNDLE SIZE ANALYSIS"
  echo "You can analyze bundle size with:"
  echo "npm run build -- --analyze"
  echo ""
  echo "If this command doesn't work, add this to your package.json scripts:"
  echo '"analyze": "webpack-bundle-analyzer build/bundle-stats.json"'
fi

# VS Code performance suggestions
print_header "VS CODE PERFORMANCE RECOMMENDATIONS"
cat << 'EOF'
For optimal VS Code performance with this project:

1. Use the optimized workspace:
   $ code optimized-dev.code-workspace

2. Disable unnecessary extensions:
   - VS Code > Extensions > ... > Disable (Workspace)
   - Consider disabling: Prettier, ESLint when not actively using

3. Adjust VS Code settings:
   - "js/ts.implicitProjectConfig.checkJs": false
   - "typescript.tsserver.maxTsServerMemory": 4096
   - "files.watcherExclude": add large directories

4. If still experiencing slowness:
   - Try "code --disable-extensions" for basic editing
   - Use lightweight editors like Sublime Text for quick edits
   - Split the project into smaller focused workspaces
EOF

# Generate recommendations
print_header "RECOMMENDED NEXT STEPS"
cat << 'EOF'
Based on common findings, consider:

1. Project Structure Optimization:
   - Move to a feature-based organization (auth, math, etc.)
   - Use consistent directory naming (context vs contexts)
   - Implement barrel exports (index.js) for cleaner imports

2. Dependency Management:
   - Remove unused dependencies with "npm prune"
   - Consider using pnpm for more efficient node_modules
   - Run "npm dedupe" to eliminate duplicate packages

3. Code Splitting:
   - Implement React.lazy for route-based code splitting
   - Use dynamic imports for large dependencies
   - Create optimized entry points for different features

4. Performance Monitoring:
   - Add Webpack Bundle Analyzer to your build process
   - Set up Lighthouse CI for performance regression testing
   - Create a performance budget and enforce it in CI

Refer to the detailed optimization plan in:
/workspaces/windgapacademy/docs/OPTIMIZATION_PLAN.md
EOF

echo ""
echo "Analysis complete. Results saved in ./tmp/analysis/"