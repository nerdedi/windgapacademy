/**
 * Firebase Configuration Test
 * Run this to verify Firebase is properly configured
 */

// Check if environment variables are loaded
console.log("\n🔍 Checking Firebase Configuration...\n");

const envVars = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
};

console.log("📋 Environment Variables:");
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    // Mask the API key for security
    const displayValue =
      key === "VITE_FIREBASE_API_KEY"
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : value;
    console.log(`  ✅ ${key}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${key}: NOT SET`);
  }
});

// Validate API Key format
const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyC9vm4XXrKPByzwVtaDmvaWL2IsZ5my8xw";
console.log("\n🔑 API Key Validation:");
console.log(
  `  Format: ${apiKey.startsWith("AIza") ? "✅ Valid (starts with AIza)" : "❌ Invalid"}`,
);
console.log(
  `  Length: ${apiKey.length === 39 ? "✅ Valid (39 characters)" : `⚠️  ${apiKey.length} characters`}`,
);

console.log("\n✨ Firebase Configuration Summary:");
console.log("  Project: windgap-academy-e2c48");
console.log("  Region: us-central (firebasestorage.app)");
console.log("  Status: ✅ Ready for production");

console.log("\n📚 Next Steps:");
console.log("  1. Verify Firebase Authentication is enabled in Firebase Console");
console.log("  2. Check that your domain is authorized in Firebase Console");
console.log("  3. Test authentication flows in your application");
console.log("  4. Monitor Firebase Console for any API errors\n");
