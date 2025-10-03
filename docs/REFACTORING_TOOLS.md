# Windgap Academy Refactoring Tools

This directory contains tools to help identify refactoring opportunities and assist with the refactoring process for the Windgap Academy codebase.

## Available Tools

### 1. Code Complexity Analyzer

Analyzes the codebase for complexity issues like large files, long functions, and high coupling, providing recommendations for refactoring.

```bash
# Run the analyzer
./scripts/code-complexity-analyzer.sh

# Reports are saved to ./tmp/code-analysis/
```

### 2. Component Dependency Visualizer

Generates an interactive visualization of component dependencies to help identify tightly coupled components and architecture issues.

```bash
# Generate the visualization
node scripts/component-dependency-visualizer.js

# Open the generated HTML file
# The file is saved to ./tmp/dependency-analysis/component-dependencies.html
```

### 3. Component Extractor

Helps extract components from larger components to improve code organization and follow the Single Responsibility Principle.

```bash
# Extract a component
node scripts/component-extractor.js <source-file> <component-name> <start-line> <end-line>

# Example:
node scripts/component-extractor.js src/components/Dashboard.jsx FilterPanel 120 180
```

### 4. Test Generator

Generates test boilerplate for components and utility functions.

```bash
# Generate a test file for a component or utility
node scripts/test-generator.js <source-file>

# Example:
node scripts/test-generator.js src/components/Button.jsx
```

## Refactoring Process Guide

Follow this process to systematically refactor the codebase:

1. **Analyze**: Run the Code Complexity Analyzer to identify areas needing attention

   ```bash
   ./scripts/code-complexity-analyzer.sh
   ```

2. **Visualize**: Generate a component dependency graph to understand relationships

   ```bash
   node scripts/component-dependency-visualizer.js
   ```

3. **Plan**: Create a refactoring plan based on the analysis results
   - Target the largest files first
   - Look for components with high coupling
   - Focus on functions with high complexity

4. **Extract**: Break down large components into smaller, focused ones

   ```bash
   node scripts/component-extractor.js <source-file> <component-name> <start-line> <end-line>
   ```

5. **Test**: Generate and implement tests for the refactored code

   ```bash
   node scripts/test-generator.js <refactored-file>
   ```

6. **Verify**: Ensure all tests pass and the application functions correctly
   ```bash
   npm test
   ```

## Best Practices

- Commit small, incremental changes
- Maintain test coverage throughout refactoring
- Document architectural decisions in component documentation
- Follow the principles outlined in the `CODE_REFACTORING_GUIDE.md`

## Additional Resources

- [CODE_REFACTORING_GUIDE.md](/docs/CODE_REFACTORING_GUIDE.md): Comprehensive refactoring guide
- [REFACTORING_EXAMPLE.md](/docs/REFACTORING_EXAMPLE.md): Practical refactoring example
- [COMPONENT_DOCUMENTATION_TEMPLATE.md](/docs/COMPONENT_DOCUMENTATION_TEMPLATE.md): Template for documenting components

## Requirements

- Node.js 14+ for the JavaScript tools
- Bash shell for the analyzer script
- Jest for running tests
