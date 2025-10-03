// Portions of this file were generated with the assistance of GitHub Copilot

import { getAuth, OAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { app } from "../../firebase";

/**
 * Microsoft Authentication utility for Windgap Academy
 * Provides functions to authenticate users via Microsoft OAuth
 */
export class MicrosoftAuthProvider {
  constructor() {
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.provider = new OAuthProvider("microsoft.com");

    // Configure Microsoft provider
    this.provider.setCustomParameters({
      // Force re-consent to ensure we get fresh tokens
      prompt: "consent",
      // Request access to Microsoft Graph API
      tenant: "common",
      // Request additional scopes
      scopes: ["user.read", "calendars.read", "offline_access"],
    });
  }

  /**
   * Sign in with Microsoft popup
   * @returns {Promise<Object>} User object
   * @throws {Error} Authentication error
   */
  async signIn() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);

      // Get OAuth tokens from result
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      // Store user data and tokens in Firestore
      await this.storeUserData(result.user, accessToken);

      return result.user;
    } catch (error) {
      console.error("Microsoft authentication error:", error);
      throw error;
    }
  }

  /**
   * Store user data and tokens in Firestore
   * @param {Object} user - Firebase user object
   * @param {string} accessToken - Microsoft access token
   */
  async storeUserData(user, accessToken) {
    try {
      const userRef = doc(this.db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          "authProviders.microsoft": {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            picture: user.photoURL,
            accessToken,
            lastLogin: new Date().toISOString(),
          },
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          roles: ["user"],
          permissions: ["read:own_profile"],
          userType: "learner",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          authProviders: {
            microsoft: {
              id: user.uid,
              email: user.email,
              name: user.displayName,
              picture: user.photoURL,
              accessToken,
              lastLogin: new Date().toISOString(),
            },
          },
        });
      }
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  }

  /**
   * Fetch Microsoft Graph API data for the user
   * @param {string} accessToken - Microsoft access token
   * @returns {Promise<Object>} User profile data
   */
  async fetchUserProfile(accessToken) {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Microsoft Graph API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching Microsoft user profile:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const microsoftAuth = new MicrosoftAuthProvider();

// Export default for direct import
export default microsoftAuth;
