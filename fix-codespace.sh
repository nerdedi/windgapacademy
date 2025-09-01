#!/bin/bash

set -e

# Remove current repo if it's broken
cd /workspaces
if [ -d "windgapacademy" ]; then
  rm -rf windgapacademy
fi

# Re-clone your repository
git clone https://github.com/nerdedi/windgapacademy.git
cd windgapacademy

# Initialize submodules (if you use any; safe to run even if you don't)
git submodule update --init --recursive

# Fix workspace folder permissions
sudo chown -R vscode:vscode /workspaces/windgapacademy

echo "Workspace reset complete. Please trigger a Full Rebuild Container from Codespaces menu."