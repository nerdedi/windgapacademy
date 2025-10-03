#!/bin/bash

# open-optimized.sh
# Opens VS Code with the optimized workspace configuration

# Function to open VS Code with the optimized workspace
open_optimized_workspace() {
  if command -v code &> /dev/null; then
    echo "Opening VS Code with optimized workspace settings..."
    code optimized-dev.code-workspace
  else
    echo "VS Code command-line tool not found."
    echo "Please open 'optimized-dev.code-workspace' manually."
  fi
}

echo "╔════════════════════════════════════════════════╗"
echo "║   Windgap Academy Optimized Workspace Launcher ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "This script will open VS Code with optimized performance settings"
echo "that exclude large directories and apply performance-enhancing configurations."
echo ""
echo "Performance tips:"
echo "  • Use the VS Code command palette (Ctrl+Shift+P) to run 'Developer: Restart Without Extensions'"
echo "    if you experience slowness"
echo "  • Consider disabling heavy extensions when not actively using them"
echo "  • Use the command 'File: Save All & Close All Tabs' periodically to free memory"
echo ""

open_optimized_workspace

echo ""
echo "For additional performance improvements, run:"
echo "  ./scripts/analyze-project.sh"
echo ""
echo "To restructure the project for better maintainability:"
echo "  ./scripts/restructure-project.sh"
