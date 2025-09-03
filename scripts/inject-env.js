// Inject .env variables into frontend build (for Vite, Webpack, etc.)
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const envVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_MEASUREMENT_ID",
];

const outPath = path.join(__dirname, "../src/env.js");
const content =
  "export const env = " +
  JSON.stringify(Object.fromEntries(envVars.map((k) => [k, process.env[k] || ""])), null, 2) +
  ";\n";

fs.writeFileSync(outPath, content);
console.log("Injected environment variables to src/env.js");
