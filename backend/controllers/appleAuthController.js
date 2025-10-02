/**
 * Apple Sign-In Callback Handler
 *
 * This file handles the backend processing of Apple Sign In authentication.
 * It verifies the token, creates or updates the user in the database,
 * and establishes a session.
 */

const jwt = require("jsonwebtoken");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// Initialize Firebase Admin if not already initialized
const initFirebaseAdmin = require("../../firebase/admin");
initFirebaseAdmin();

/**
 * Verify Apple ID token
 * @param {string} idToken - The ID token from Apple
 * @returns {Promise<Object>} The decoded token payload
 */
async function verifyAppleToken(idToken) {
  try {
    // In production, you would validate this token with Apple's public key
    // This is a simplified version for demonstration purposes

    // Decode the token without verification (for demo only)
    // In production, use Apple's JWKS endpoint to get the public key
    // and verify the token signature
    const decoded = jwt.decode(idToken, { complete: true });

    if (!decoded) {
      throw new Error("Invalid token");
    }

    return decoded.payload;
  } catch (error) {
    console.error("Error verifying Apple token:", error);
    throw error;
  }
}

/**
 * Create or update user in Firestore
 * @param {Object} userData - User data from Apple
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
      provider: "apple",
      ...userData,
    };
  } else {
    // Create new user
    userData2Save = {
      createdAt: now,
      lastLogin: now,
      updatedAt: now,
      provider: "apple",
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
 * Handle Apple Sign In callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleAppleCallback(req, res) {
  try {
    const { token, code, firstName, lastName, email } = req.query;

    if (!token || !code) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Verify the token
    const payload = await verifyAppleToken(token);

    if (!payload.sub) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const appleUserId = payload.sub;

    // Check if user exists in Firebase Auth
    const auth = getAuth();
    let firebaseUser;

    try {
      // Try to get user by Apple ID
      firebaseUser = await auth.getUserByProviderUid("apple.com", appleUserId);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // User doesn't exist, create a new one
        const userEmail = email || payload.email || `${appleUserId}@appleid.windgapacademy.org`;
        const displayName =
          firstName && lastName ? `${firstName} ${lastName}` : payload.name || "Apple User";

        firebaseUser = await auth.createUser({
          displayName,
          email: userEmail,
          emailVerified: true, // Apple verifies emails
          providerData: [
            {
              uid: appleUserId,
              providerId: "apple.com",
              displayName,
              email: userEmail,
            },
          ],
        });

        // Link Apple provider to the user
        await auth.updateUser(firebaseUser.uid, {
          providerToLink: {
            providerId: "apple.com",
            uid: appleUserId,
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
      displayName:
        firstName && lastName ? `${firstName} ${lastName}` : payload.name || "Apple User",
      email: email || payload.email,
      appleUserId,
    };

    await createOrUpdateUser(userData, firebaseUser.uid);

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || "/"}?token=${customToken}&provider=apple`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Apple callback error:", error);
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
}

module.exports = handleAppleCallback;
