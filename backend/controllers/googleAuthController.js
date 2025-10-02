/**
 * Google Sign-In Callback Handler
 *
 * This file handles the backend processing of Google Sign In authentication.
 * It verifies the token, creates or updates the user in the database,
 * and establishes a session.
 */

const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// Initialize Firebase Admin if not already initialized
const initFirebaseAdmin = require("../../firebase/admin");
initFirebaseAdmin();

/**
 * Verify Google ID token
 * @param {string} idToken - The ID token from Google
 * @returns {Promise<Object>} The decoded token payload
 */
async function verifyGoogleToken(idToken) {
  try {
    // In production, you would validate this token with Google's verification endpoint
    // This is a simplified version for demonstration purposes

    // Verify the token using Firebase Auth
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      throw new Error("Invalid token");
    }

    return decodedToken;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw error;
  }
}

/**
 * Create or update user in Firestore
 * @param {Object} userData - User data from Google
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} User document
 */
async function createOrUpdateUser(userData, uid) {
  const db = getFirestore();
  const userRef = db.collection("users").doc(uid);

  // Get existing user data or create a new document
  const userDoc = await userRef.get();

  const now = new Date().toISOString();
  let userData2Save = {};

  if (userDoc.exists) {
    // Update existing user
    userData2Save = {
      lastLogin: now,
      updatedAt: now,
      provider: "google",
      ...userData,
    };
  } else {
    // Create new user
    userData2Save = {
      createdAt: now,
      lastLogin: now,
      updatedAt: now,
      provider: "google",
      role: "student", // Default role
      isActive: true,
      ...userData,
    };
  }

  await userRef.set(userData2Save, { merge: true });

  return {
    uid,
    ...userData2Save,
  };
}

/**
 * Handle Google Sign In callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGoogleCallback(req, res) {
  try {
    const { token, name, email } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Verify the token
    const payload = await verifyGoogleToken(token);

    if (!payload.sub) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const googleUserId = payload.sub;

    // Check if user exists in Firebase Auth
    const auth = getAuth();
    let firebaseUser;

    try {
      // Try to get user by Google ID
      firebaseUser = await auth.getUserByProviderUid("google.com", googleUserId);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // User doesn't exist, create a new one
        const userEmail = email || payload.email || `${googleUserId}@google.windgapacademy.org`;
        const displayName = name || payload.name || "Google User";

        firebaseUser = await auth.createUser({
          displayName,
          email: userEmail,
          emailVerified: true, // Google verifies emails
          providerData: [
            {
              uid: googleUserId,
              providerId: "google.com",
              displayName,
              email: userEmail,
            },
          ],
        });

        // Link Google provider to the user
        await auth.updateUser(firebaseUser.uid, {
          providerToLink: {
            providerId: "google.com",
            uid: googleUserId,
          },
        });
      } else {
        throw error;
      }
    }

    // Create custom token for client-side Firebase Auth
    const customToken = await auth.createCustomToken(firebaseUser.uid);

    // Store additional user data in Firestore
    const userData = {
      displayName: name || payload.name || "Google User",
      email: email || payload.email,
      googleUserId,
    };

    await createOrUpdateUser(userData, firebaseUser.uid);

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || "/"}?token=${customToken}&provider=google`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
}

module.exports = handleGoogleCallback;
