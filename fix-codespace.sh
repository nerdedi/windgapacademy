#!/bin/bash

set -e

# Move to your workspace directory
cd /workspaces/windgapacademy

# If local changes exist, stash them to avoid conflicts
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Stashing local changes..."
  git stash
fi

# Pull latest changes from remote main branch, using merge
git pull --no-rebase origin main

# Show that the script is present
ls -l fix-codespace.sh

# Make sure the script is executable
chmod +x fix-codespace.sh

echo "Run this script again to reset your workspace if needed:"
echo "bash fix-codespace.sh"

# You may now run any further recovery steps, e.g. rebuilding container
