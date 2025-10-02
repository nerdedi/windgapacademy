#!/bin/bash

# Security update script for FreeSpeech AAC application
# Created on October 2, 2025
# This script should be run from the root of the windgapacademy project

echo "🔒 Starting FreeSpeech security update process..."

# Check if we're in the correct directory
if [ ! -d "freespeech" ]; then
    echo "❌ Error: freespeech directory not found! Run this script from the windgapacademy root."
    exit 1
fi

# Create a backup branch
echo "📦 Creating backup branch..."
git checkout -b security-updates-backup
git add .
git commit -m "Backup before security updates" --no-verify || true

# Switch back and create a working branch
git checkout feature/auth-and-lms
git checkout -b security-updates

# Update dependencies
echo "🔄 Updating FreeSpeech dependencies..."
cd freespeech

# Step 1: Update esbuild independently
echo "⬆️ Updating esbuild..."
npm install esbuild@latest --save-dev

# Step 2: Try to update specific dependencies with compatible versions
echo "⬆️ Updating cookie dependency..."
npm install cookie@0.7.0 --save-dev

# Step 3: Create a new .npmrc to handle workspace protocol
echo "📝 Creating .npmrc configuration..."
cat > .npmrc << EOL
# Allow workspace protocol
node-linker=hoisted
legacy-peer-deps=true
EOL

# Step 4: Try to update Kit safely
echo "⬆️ Updating SvelteKit carefully..."
npm install @sveltejs/kit@latest --save-dev --force

# Check if the updates fixed the vulnerabilities
echo "🔍 Running security audit..."
npm audit

echo "✅ Updates completed. Please test the application thoroughly before merging."
echo "To test the application, run: cd freespeech && npm run dev"
echo "If there are issues, you can restore from the backup branch: git checkout security-updates-backup"
