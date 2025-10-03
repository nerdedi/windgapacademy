/**
 * Google Authentication Utility
 * Handles Google Sign In authentication flow for Windgap Academy
 */
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

/**
 * Initialize Google Sign In
 * This should be called when the application starts
 */
export const initializeGoogleAuth = () => {
  // Load the Google Sign In script if not already loaded
  if (!document.getElementById("google-sign-in-script")) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-sign-in-script";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  console.log("Google auth initialized");
};

/**
 * Sign in with Google
 * @returns {Promise} Promise that resolves with the authentication data
 */
export const signInWithGoogle = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // Add scopes for additional permissions
    provider.addScope("profile");
    provider.addScope("email");

    // Sign in with popup
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info
    const user = result.user;

    // Store additional user info in Firestore if needed
    const db = getFirestore();
    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        authProvider: "google",
        lastLogin: new Date().toISOString(),
      },
      { merge: true },
    );

    return {
      provider: "google",
      token: token,
      user: {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      },
    };
  } catch (error) {
    console.error("Google Sign In error", error);
    throw error;
  }
};

/**
 * Create backend authentication URL for Google
 * @param {Object} authData Data from Google Sign In
 * @returns {string} URL for backend authentication
 */
export const createAuthUrl = (authData) => {
  const params = new URLSearchParams({
    token: authData.token,
    ...(authData.user?.name && { name: authData.user.name }),
    ...(authData.user?.email && { email: authData.user.email }),
  });

  return `/api/auth/google/callback?${params.toString()}`;
};

export default {
  initializeGoogleAuth,
  signInWithGoogle,
  createAuthUrl,
};
