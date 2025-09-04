/* eslint-disable import/order */
// tiny typed wrapper around the runtime JS firebase module
// so TypeScript consumers get proper types instead of implicit any
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
// Import the runtime module (JS) that initializes Firebase at runtime
// Keep this import relative to project root identical to existing imports
// The runtime module exports `app` and `auth` (may be null if not initialized)
// We re-export them with TS types so other files can import safely.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const runtime = require("../../firebase.js");

export const app: FirebaseApp | null = runtime.app ?? null;
export const auth: Auth | null = runtime.auth ?? null;

export default { app, auth };
