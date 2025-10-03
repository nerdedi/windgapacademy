#!/bin/bash

# Change directory to the project root (where this script is located)
cd "$(dirname "$0")" || exit

# Start the dev server with specific route
echo "Starting Windgap Academy with Fraction Mastery exercise..."
echo "Once the server is running, open your browser to: http://localhost:3000/math/fraction-mastery"

# Check if npm is available
if command -v npm &> /dev/null; then
    npm run dev
else
    echo "Error: npm not found. Please make sure Node.js is installed."
    exit 1
fi
