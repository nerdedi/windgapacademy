/*
  Lightweight firebase client wrapper using ES modules
  - Provides runtime `app` and `auth` exports from the project's central `firebase.js` file
  - Exposes a `getFirestoreClient` helper that lazily gets the modular Firestore
*/
import { getFirestore } from "firebase/firestore";

let app = null;
let auth = null;

try {
  const runtime = await import("../../firebase.js");
  app = runtime.app || null;
  auth = runtime.auth || null;
} catch (e) {
  console.warn(
    "firebase runtime not available in this environment",
    e && e.message ? e.message : e,
  );
}

function getFirestoreClient() {
  try {
    if (app) return getFirestore(app);
    return getFirestore();
  } catch (e) {
    console.warn("getFirestore not available in this environment", e && e.message ? e.message : e);
    return null;
  }
}

export { app, auth, getFirestoreClient };
