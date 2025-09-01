# This script automates pulling the Node.js Docker image, running a container, and verifying Node.js/npm versions.
# Usage: bash setup-node-docker.sh

set -e

# Pull the Node.js Docker image
echo "Pulling Node.js 22-alpine Docker image..."
docker pull node:22-alpine

echo "Starting Node.js container and verifying versions..."
docker run --rm node:22-alpine sh -c "echo 'Node.js version:'; node -v; echo 'npm version:'; npm -v"

echo "Done."
