#!/bin/bash
# setup-khan-exercises.sh
# This script helps set up Khan Academy exercises in the Windgap Academy project

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Khan Academy Exercises Setup ===${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo -e "${RED}Git is not installed. Please install git and try again.${NC}"
  exit 1
fi

# Define the directory for Khan exercises
KHAN_DIR="khan-exercises"
FULL_PATH="$(pwd)/$KHAN_DIR"

# Check if the directory already exists
if [ -d "$KHAN_DIR" ]; then
  echo -e "${YELLOW}The directory $KHAN_DIR already exists.${NC}"
  read -p "Do you want to update it? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Updating Khan Academy exercises..."
    cd "$KHAN_DIR"
    git pull
    cd ..
  else
    echo "Skipping update."
  fi
else
  echo "Cloning Khan Academy exercises repository..."
  git clone https://github.com/Khan/khan-exercises.git
  echo -e "${GREEN}Khan Academy exercises repository cloned successfully.${NC}"
fi

# Create a simple Express server to serve the exercises
echo "Creating Express server for Khan exercises..."

# Create server directory if it doesn't exist
mkdir -p scripts

# Create the server file
cat > scripts/serve-khan-exercises.js << 'EOF'
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from khan-exercises directory
app.use(express.static(path.join(__dirname, '..', 'khan-exercises')));

// Add a health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Khan exercises server is running' });
});

// Add a list route to show available exercises
app.get('/list', (req, res) => {
  const fs = require('fs');
  const exercisesDir = path.join(__dirname, '..', 'khan-exercises', 'exercises');

  try {
    const files = fs.readdirSync(exercisesDir)
      .filter(file => file.endsWith('.html'))
      .map(file => ({
        id: file.replace('.html', ''),
        name: file.replace('.html', '').replace(/_/g, ' '),
        path: `/exercises/${file}`
      }));

    res.json({ exercises: files });
  } catch (err) {
    res.status(500).json({ error: 'Could not list exercises', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Khan exercises server running at http://localhost:${port}`);
  console.log(`- List available exercises: http://localhost:${port}/list`);
  console.log(`- Access exercises at: http://localhost:${port}/exercises/[exercise-name].html`);
});
EOF

# Make sure we have required dependencies
echo "Checking for required npm packages..."
if ! npm list express &> /dev/null || ! npm list cors &> /dev/null; then
  echo "Installing required npm packages..."
  npm install --save-dev express cors
fi

# Add the script to package.json if it doesn't exist
if ! grep -q "\"khan:serve\"" package.json; then
  echo "Adding khan:serve script to package.json..."
  sed -i '/\"scripts\": {/a \    \"khan:serve\": \"node scripts\/serve-khan-exercises.js\",' package.json
fi

# Create a README for Khan exercises integration
cat > khan-academy-README.md << 'EOF'
# Khan Academy Integration for Windgap Academy

This directory contains resources and tools for integrating Khan Academy exercises
into the Windgap Academy platform.

## Getting Started

1. **Start the Khan Exercises Server**:
   ```bash
   npm run khan:serve
   ```
   This will start a local server at http://localhost:3001

2. **Browse Available Exercises**:
   Visit http://localhost:3001/list to see all available exercises

3. **View a Specific Exercise**:
   Visit http://localhost:3001/exercises/[exercise-name].html

   For example: http://localhost:3001/exercises/adding_decimals.html

## Integration Components

The following React components are available for integration:

- `KhanAcademyExercise` - Embed specific Khan Academy exercises
- `KhanAcademyResources` - Browse and embed Khan Academy resources

## Documentation

For more detailed information, see:
- `docs/KHAN_ACADEMY_INTEGRATION.md` - Full integration guide

## Resources

- [Khan Academy API Documentation](https://github.com/Khan/khan-api)
- [Khan Academy Exercises Repository](https://github.com/Khan/khan-exercises)
EOF

echo -e "${GREEN}Khan Academy exercises setup complete!${NC}"
echo -e "${BLUE}To start the Khan exercises server:${NC}"
echo -e "  npm run khan:serve"
echo
echo -e "${BLUE}Server will run at:${NC} http://localhost:3001"
echo
echo -e "${BLUE}For more information, see:${NC} khan-academy-README.md"
