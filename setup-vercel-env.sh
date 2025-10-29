#!/bin/bash

# Setup Firebase environment variables in Vercel
echo "Setting up Firebase environment variables in Vercel..."

# Firebase configuration values
FIREBASE_API_KEY="AIzaSyC9vm4XXrKPByzwVtaDmvaWL2IsZ5my8xw"
FIREBASE_AUTH_DOMAIN="windgap-academy-e2c48.firebaseapp.com"
FIREBASE_PROJECT_ID="windgap-academy-e2c48"
FIREBASE_STORAGE_BUCKET="windgap-academy-e2c48.firebasestorage.app"
FIREBASE_MESSAGING_SENDER_ID="444841255811"
FIREBASE_APP_ID="1:444841255811:web:24f12f01c19e51d4f7ccb6"
FIREBASE_MEASUREMENT_ID="G-VJFSNPCK60"

# Add environment variables to Vercel
echo "Adding VITE_FIREBASE_API_KEY..."
echo "$FIREBASE_API_KEY" | npx vercel env add VITE_FIREBASE_API_KEY

echo "Adding VITE_FIREBASE_AUTH_DOMAIN..."
echo "$FIREBASE_AUTH_DOMAIN" | npx vercel env add VITE_FIREBASE_AUTH_DOMAIN

echo "Adding VITE_FIREBASE_PROJECT_ID..."
echo "$FIREBASE_PROJECT_ID" | npx vercel env add VITE_FIREBASE_PROJECT_ID

echo "Adding VITE_FIREBASE_STORAGE_BUCKET..."
echo "$FIREBASE_STORAGE_BUCKET" | npx vercel env add VITE_FIREBASE_STORAGE_BUCKET

echo "Adding VITE_FIREBASE_MESSAGING_SENDER_ID..."
echo "$FIREBASE_MESSAGING_SENDER_ID" | npx vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID

echo "Adding VITE_FIREBASE_APP_ID..."
echo "$FIREBASE_APP_ID" | npx vercel env add VITE_FIREBASE_APP_ID

echo "Adding VITE_FIREBASE_MEASUREMENT_ID..."
echo "$FIREBASE_MEASUREMENT_ID" | npx vercel env add VITE_FIREBASE_MEASUREMENT_ID

echo "Done! All Firebase environment variables have been added to Vercel."
echo "You may need to redeploy your project for the changes to take effect."
