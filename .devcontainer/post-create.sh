#!/usr/bin/env bash
set -euo pipefail

echo "Running post-create steps..."
cd /workspaces/windgapacademy

# Install dependencies if package.json exists and SKIP_NPM is not set
if [ -f package.json ] && [ "${SKIP_NPM:-0}" != "1" ]; then
  echo "Installing npm dependencies..."
  npm install --no-audit --no-fund
else
  echo "Skipping npm install (SKIP_NPM=${SKIP_NPM:-0})"
fi

# Run a quick build if a build script exists and SKIP_NPM is not set
if [ "${SKIP_NPM:-0}" != "1" ] && npm run | grep -q "build"; then
  echo "Running npm run build..."
  npm run build || true
else
  echo "Skipping npm run build (SKIP_NPM=${SKIP_NPM:-0})"
fi

echo "Post-create tasks completed."
