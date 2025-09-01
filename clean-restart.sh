#!/bin/sh
# Automated cleanup and restart script for Node.js ES module issues
# Usage: bash clean-restart.sh

set -e

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Print message to restart terminal/session
cat <<EOF

Cleanup complete. Please restart your terminal or VS Code session to ensure Node.js picks up the new module settings.
Then run:
  node app.js
EOF
