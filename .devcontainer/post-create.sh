#!/usr/bin/env bash
set -euo pipefail

echo "Running post-create steps..."
cd /workspaces/windgapacademy

# Install dependencies using Yarn if yarn.lock exists
if [ -f yarn.lock ]; then
  echo "Installing Yarn dependencies..."
  yarn install
# Otherwise, install dependencies using npm if package.json exists and SKIP_NPM is not set
elif [ -f package.json ] && [ "${SKIP_NPM:-0}" != "1" ]; then
  echo "Installing npm dependencies..."
  npm install --no-audit --no-fund
else
  echo "Skipping dependency installation (SKIP_NPM=${SKIP_NPM:-0})"
fi

# Run a build using npm if a build script exists, SKIP_NPM is not set, and the previous steps were successful
if [ -f package.json ] && [ -z "${SKIP_NPM:-}" ]; then
  echo "Running build..."
  if ! npm run build; then
    echo "Build failed! Check logs above."
    exit 1
  fi
else
  echo "Skipping build (SKIP_NPM=${SKIP_NPM:-0})"
fi

echo "Post-create tasks completed."
