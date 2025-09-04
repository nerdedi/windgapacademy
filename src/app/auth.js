// Lightweight auth wrappers to centralize authentication logic.
const { auth } = require("../../firebase.js");
const { signInWithEmailAndPassword, signOut: fbSignOut } = (() => {
  try {
    // lazy require to avoid breaking environments without firebase installed
    // eslint-disable-next-line global-require
    const a = require("firebase/auth");
    return { signInWithEmailAndPassword: a.signInWithEmailAndPassword, signOut: a.signOut };
  } catch (e) {
    return {};
  }
})();

async function signInEmail(email, password) {
  if (!auth || !signInWithEmailAndPassword) {
    throw new Error("Firebase auth is not available in this environment");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

async function signOutUser() {
  if (!auth || !fbSignOut) return;
  try {
    await fbSignOut(auth);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to sign out", e);
  }
}

module.exports = { signInEmail, signOutUser };
