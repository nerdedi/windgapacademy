// Lightweight auth wrappers to centralize authentication logic.
import { signInWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth";
import { auth } from "../../firebase.js";

export async function signInEmail(email, password) {
  if (!auth || !signInWithEmailAndPassword) {
    throw new Error("Firebase auth is not available in this environment");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  if (!auth || !fbSignOut) return;
  try {
    await fbSignOut(auth);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to sign out", e);
  }
}
