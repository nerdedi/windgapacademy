#!/bin/bash
# comprehensive-security-audit.sh
# A script to perform a comprehensive security audit of all projects in the workspace
# and create automated pull requests for vulnerabilities where possible

set -e

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Windgap Academy Comprehensive Security Audit ===${NC}"
echo "Starting security audit for all projects..."

# Check git status before proceeding
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${YELLOW}WARNING: You have uncommitted changes. Consider committing or stashing them before proceeding.${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting audit."
    exit 1
  fi
fi

# Create a new branch for security fixes
BRANCH_NAME="security/comprehensive-updates-$(date +%Y%m%d)"
git checkout -b $BRANCH_NAME

# Function to audit and fix a project
audit_project() {
  local project_dir=$1
  local project_name=$2

  echo -e "${BLUE}=== Auditing $project_name ===${NC}"
  cd "$project_dir"

  # Run npm audit to get vulnerabilities
  echo "Running npm audit for $project_name..."
  npm audit > "audit-results-$(date +%Y%m%d).txt" || true

  # Save current dependencies for comparison
  cp package.json package.json.backup

  # Try to fix vulnerabilities without breaking changes
  echo "Attempting to fix vulnerabilities without breaking changes..."
  npm audit fix || true

  # Check if any fixes were applied
  if diff -q package.json package.json.backup > /dev/null; then
    echo -e "${YELLOW}No automatic fixes were applied for $project_name${NC}"
  else
    echo -e "${GREEN}Automatic fixes were applied for $project_name${NC}"
    # Test if the project still works after fixes
    echo "Testing if project still works after fixes..."
    if [[ -f "package.json" ]]; then
      npm run test || true
    fi
  fi

  # Restore backup if needed
  # rm package.json.backup

  # Run npm audit again to see remaining vulnerabilities
  echo "Checking for remaining vulnerabilities..."
  npm audit > "remaining-vulnerabilities-$(date +%Y%m%d).txt" || true

  echo -e "${GREEN}Audit complete for $project_name${NC}"
  echo ""
}

# Main Windgap Academy project
echo "Auditing main Windgap Academy project..."
audit_project "/workspaces/windgapacademy" "Windgap Academy"

# FreeSpeech project
if [ -d "/workspaces/windgapacademy/freespeech" ]; then
  echo "Auditing FreeSpeech project..."
  audit_project "/workspaces/windgapacademy/freespeech" "FreeSpeech"
else
  echo -e "${YELLOW}FreeSpeech project directory not found.${NC}"
fi

# Backend project
if [ -d "/workspaces/windgapacademy/backend" ]; then
  echo "Auditing Backend project..."
  audit_project "/workspaces/windgapacademy/backend" "Backend"
else
  echo -e "${YELLOW}Backend project directory not found.${NC}"
fi

# MCP Server project
if [ -d "/workspaces/windgapacademy/mcp-server" ]; then
  echo "Auditing MCP Server project..."
  audit_project "/workspaces/windgapacademy/mcp-server" "MCP Server"
else
  echo -e "${YELLOW}MCP Server project directory not found.${NC}"
fi

# Go back to root directory
cd "/workspaces/windgapacademy"

# Check if any changes were made
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${GREEN}Security fixes were applied. Creating a commit...${NC}"
  git add .
  git commit -m "security: Apply automated security fixes across projects"
  echo -e "${GREEN}Commit created. You can now push the branch and create a pull request.${NC}"
  echo "Run: git push -u origin $BRANCH_NAME"
else
  echo -e "${YELLOW}No security fixes were applied. No commits needed.${NC}"
  git checkout -
  git branch -D $BRANCH_NAME
fi

echo -e "${BLUE}=== Security Audit Complete ===${NC}"
echo "Check the audit results in each project directory for details on remaining vulnerabilities."
