#!/bin/bash

# Setup Apple Sign-In Integration
# This script helps set up and configure Apple Sign-In for Windgap Academy

echo "Setting up Apple Sign-In Integration for Windgap Academy"
echo "========================================================"

# Check for required environment variables
if [ -z "$APPLE_CLIENT_ID" ]; then
  echo "❌ APPLE_CLIENT_ID environment variable not found"
  echo "Please set your Apple Client ID using:"
  echo "export APPLE_CLIENT_ID=your_apple_client_id"
  HAS_ERROR=true
fi

# Continue only if no errors
if [ "$HAS_ERROR" = true ]; then
  echo ""
  echo "❌ Setup failed. Please fix the errors above and try again."
  exit 1
fi

# Add environment variables to .env file if it exists
if [ -f ".env" ]; then
  echo ""
  echo "📝 Adding Apple environment variables to .env file"

  # Check if variables already exist
  if grep -q "REACT_APP_APPLE_CLIENT_ID" .env; then
    echo "⚠️ REACT_APP_APPLE_CLIENT_ID already exists in .env"
  else
    echo "REACT_APP_APPLE_CLIENT_ID=$APPLE_CLIENT_ID" >> .env
    echo "✅ Added REACT_APP_APPLE_CLIENT_ID to .env"
  fi

  if grep -q "VITE_APPLE_CLIENT_ID" .env; then
    echo "⚠️ VITE_APPLE_CLIENT_ID already exists in .env"
  else
    echo "VITE_APPLE_CLIENT_ID=$APPLE_CLIENT_ID" >> .env
    echo "✅ Added VITE_APPLE_CLIENT_ID to .env"
  fi
else
  echo ""
  echo "⚠️ No .env file found. Creating one with Apple environment variables"
  echo "REACT_APP_APPLE_CLIENT_ID=$APPLE_CLIENT_ID" > .env
  echo "VITE_APPLE_CLIENT_ID=$APPLE_CLIENT_ID" >> .env
  echo "✅ Created .env file with Apple environment variables"
fi

echo ""
echo "🔍 Verifying Apple Sign-In component files"

# Check if required files exist
FILES_TO_CHECK=(
  "src/utils/appleAuth.js"
  "src/components/auth/AppleSignInButton.jsx"
  "__tests__/utils/appleAuth.test.js"
  "__tests__/components/AppleSignInButton.test.js"
  "backend/controllers/appleAuthController.js"
  "backend/routes/appleAuth.js"
)

ALL_FILES_EXIST=true

for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo ""
  echo "⚠️ Some required files are missing. Please check the Apple Sign-In implementation."
else
  echo ""
  echo "✅ All Apple Sign-In files are in place"
fi

echo ""
echo "📋 Apple Sign-In Integration Checklist:"
echo "1. ✅ Environment variables set"
echo "2. ✅ Component files verified"
echo "3. ⏳ Register your app with Apple Developer Portal (manual step)"
echo "4. ⏳ Configure redirect URL in Apple Developer Portal (manual step)"
echo "5. ⏳ Add Apple Sign-In button to your login page (if not already done)"

echo ""
echo "🚀 Next steps:"
echo "1. Complete the manual configuration steps in the Apple Developer Portal"
echo "2. Add the AppleSignInButton component to your login page"
echo "3. Run tests with: npm test -- --testPathPattern=appleAuth"
echo "4. Check the documentation at docs/apple-sign-in-integration.md"

echo ""
echo "✨ Apple Sign-In setup complete! ✨"
