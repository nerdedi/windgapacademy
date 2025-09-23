#!/bin/bash

# Script to apply ESLint and Prettier fixes to Windgap Academy files

echo "Applying ESLint and Prettier fixes..."

# Apply fixes to firebase.js
echo "Fixing firebase.js..."
cp firebase.js.fixed firebase.js

# Apply fixes to Three.js-init.js
echo "Fixing js/three-init.js..."
cp js/three-init.js.fixed js/three-init.js

# Apply fixes to App.jsx
echo "Fixing src/App.jsx..."
cp src/App.jsx.fixed src/App.jsx

# Apply fixes to ExecutiveFunctionTools.jsx
echo "Fixing src/components/ExecutiveFunctionTools.jsx..."
cp src/components/ExecutiveFunctionTools.jsx.fixed src/components/ExecutiveFunctionTools.jsx

# Apply fixes to Navigation.jsx
echo "Fixing src/components/Navigation.jsx..."
cp src/components/Navigation.jsx.fixed src/components/Navigation.jsx

# Apply fixes to AuthContext.js
echo "Fixing src/context/AuthContext.js..."
cp src/context/AuthContext.js.fixed src/context/AuthContext.js

# Apply fixes to NeurodivergentLearningPage.jsx
echo "Fixing src/pages/NeurodivergentLearningPage.jsx..."
cp src/pages/NeurodivergentLearningPage.jsx.fixed src/pages/NeurodivergentLearningPage.jsx

# Apply fixes to vite.config.js
echo "Fixing vite.config.js..."
cp vite.config.js.fixed vite.config.js

# Apply fixes to tailwind.config.js
echo "Fixing tailwind.config.js..."
cp tailwind.config.js.fixed tailwind.config.js

# Clean up temporary files
echo "Cleaning up temporary files..."
rm -f *.fixed
rm -f js/*.fixed
rm -f src/*.fixed
rm -f src/components/*.fixed
rm -f src/context/*.fixed
rm -f src/pages/*.fixed

echo "All fixes applied successfully!"
