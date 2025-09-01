#!/bin/sh
# Automated Docker Node.js setup script
# Usage: bash setup-node-docker-quick.sh

set -e

echo "Pulling Node.js 22-alpine Docker image..."
docker pull node:22-alpine

echo "Starting Node.js container and verifying versions..."
docker run --rm node:22-alpine sh -c "echo 'Node.js version:'; node -v; echo 'npm version:'; npm -v"

echo "Done."
