/*
  Lightweight firebase client wrapper
  - Provides runtime `app` and `auth` exports from the project's central `firebase.js` file
  - Exposes a `getFirestoreClient` helper that lazily requires the modular Firestore
  This file is CommonJS to match other helpers in the repo; it is intentionally small
  so TypeScript/ESM consumers can `import { auth } from '../lib/firebaseClient.js'`.
*/
let runtime = {};
try {
  // lazy require so tests and environments without firebase installed won't break
  // eslint-disable-next-line global-require
  runtime = require("../../firebase.js");
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn(
    "firebase runtime not available in this environment",
    e && e.message ? e.message : e,
  );
  runtime = {};
}

const app = runtime.app || null;
const auth = runtime.auth || null;

function getFirestoreClient() {
  try {
    // eslint-disable-next-line global-require
    const { getFirestore } = require("firebase/firestore");
    if (app) return getFirestore(app);
    return getFirestore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("getFirestore not available in this environment", e && e.message ? e.message : e);
    return null;
  }
}

module.exports = { app, auth, getFirestoreClient };
