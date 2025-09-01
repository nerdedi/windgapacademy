#!/bin/sh
# This script automates Docker installation and Node.js setup for Alpine Linux v3.21+
# Usage: sudo sh setup-docker-node-alpine.sh

set -e

# Update package index
echo "Updating package index..."
apk update

# Install Docker
echo "Installing Docker..."
apk add docker

# Ensure OpenRC is installed for rc-service
echo "Installing OpenRC (for rc-service)..."
if ! apk add openrc; then
	echo "Error: Failed to install OpenRC."
	echo "Troubleshooting:"
	echo "- Make sure you have network access."
	echo "- Try running 'sudo apk update' and then 'sudo apk add openrc' manually."
	echo "- If you are in a restricted environment (e.g., Codespaces), Docker may not be supported."
	exit 1
fi
# Start Docker service
echo "Starting Docker service..."
rc-service docker start

# Add current user to docker group (optional)
echo "Adding $USER to docker group (optional)..."
addgroup $USER docker || true

# Print Docker version
echo "Docker version:"
docker --version

# Pull Node.js Docker image
echo "Pulling Node.js 22-alpine Docker image..."
docker pull node:22-alpine

# Run Node.js container and verify versions
echo "Starting Node.js container and verifying versions..."
docker run --rm node:22-alpine sh -c "echo 'Node.js version:'; node -v; echo 'npm version:'; npm -v"

echo "Done."
