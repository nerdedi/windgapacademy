#!/bin/bash

# Setup Three.js Dependencies for Windgap Academy
# This script installs and configures all Three.js related dependencies

echo "Setting up Three.js dependencies for Windgap Academy..."

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "Error: package.json not found. Are you in the project root directory?"
  exit 1
fi

# Install Three.js and related dependencies
echo "Installing Three.js dependencies..."
npm install --save three@latest
npm install --save framer-motion@latest

echo "Adding React components for Three.js support..."
npm install --save react-three-fiber@latest @react-three/drei@latest @react-three/postprocessing@latest

# Create directories if they don't exist
mkdir -p src/threeJs/assets
mkdir -p public/assets/characters
mkdir -p public/assets/environments

echo "Setup complete! Three.js dependencies installed."
echo ""
echo "Usage:"
echo "1. Import the Three.js character system:"
echo "   import { VirtualCharacters, LearningEnvironment } from './src/threeJs';"
echo ""
echo "2. Use the components in your React app:"
echo "   <VirtualCharacters"
echo "     containerId=\"my-characters\""
echo "     selectedCharacters={['winnie']}"
echo "     environment=\"classroom\""
echo "   />"
echo ""
echo "3. If needed, initialize Three.js globally:"
echo "   import { initThreeJsGlobally } from './src/threeJs';"
echo "   initThreeJsGlobally();"
echo ""
echo "See src/examples/ExampleThreeJsUsage.jsx for more examples."