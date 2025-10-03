#!/bin/bash

# Start the math exercises development environment
echo "🧮 Starting Windgap Academy Adaptive Math Exercises Development..."

# Change to the project directory
cd "$(dirname "$0")"

# Check if Vite is installed
if ! command -v vite &> /dev/null; then
    echo "Vite is not installed. Installing vite..."
    npm install -g vite
fi

# Check for required packages
echo "Checking for required packages..."
REQUIRED_PACKAGES=("framer-motion" "firebase" "katex")
for package in "${REQUIRED_PACKAGES[@]}"; do
  if ! npm list | grep -q "$package"; then
    echo "Installing required package: $package..."
    npm install "$package"
  fi
done

# Set environment variables for math exercises development
export VITE_FEATURE_MATH_EXERCISES=true
export VITE_ENABLE_ADAPTIVE_LEARNING=true
export VITE_ENABLE_QUEST_BASED_LEARNING=true

# Start the development server
echo "🚀 Starting development server with adaptive math exercises enabled..."
echo "📚 Navigate to http://localhost:3000/math/adaptive-quest to view the Adaptive Math Exercises"
npm run dev -- --port 3000 --open /math/adaptive-quest
