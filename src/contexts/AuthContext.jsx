import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithApple } from "../utils/appleAuth";
import { signInWithGoogle } from "../utils/googleAuth";
import { microsoftAuth } from "../utils/microsoftAuth";
import { initializeOAuth } from "../utils/oauthImplementation";

// Create the auth context
const AuthContext = createContext();

/**
 * Authentication Provider component
 * Manages authentication state and provides user information to the application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication on mount
  useEffect(() => {
    // Initialize OAuth providers
    initializeOAuth();

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          // Transform Firebase user into our app user format
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            provider: firebaseUser.providerData[0]?.providerId || "unknown",
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            createdAt: firebaseUser.metadata?.creationTime,
            lastLogin: firebaseUser.metadata?.lastSignInTime,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error.message);
        setLoading(false);
      },
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error.message);
      return { success: false, error };
    }
  };

  /**
   * Update user profile information
   * @param {Object} profileData - New profile data
   */
  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error("No user is signed in");

      // Update profile in Firebase Auth
      await auth.currentUser.updateProfile({
        displayName: profileData.name,
        photoURL: profileData.photoURL,
      });

      // Update email if changed
      if (profileData.email && profileData.email !== user.email) {
        await auth.currentUser.updateEmail(profileData.email);
      }

      // Update local user state
      setUser({
        ...user,
        name: profileData.name || user.name,
        email: profileData.email || user.email,
        photoURL: profileData.photoURL || user.photoURL,
      });

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message);
      return { success: false, error };
    }
  };

  /**
   * Sign in with Google
   * @returns {Promise<Object>} User data
   */
  const signInWithGoogleAuth = async () => {
    try {
      const authData = await signInWithGoogle();

      // User will be set by Firebase auth state change listener
      return authData;
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
      throw error;
    }
  };

  /**
   * Sign in with Apple
   * @returns {Promise<Object>} User data
   */
  const signInWithAppleAuth = async () => {
    try {
      const authData = await signInWithApple();

      // User will be set by Firebase auth state change listener
      return authData;
    } catch (error) {
      console.error("Apple sign-in error:", error);
      setError(error.message);
      throw error;
    }
  };

  /**
   * Sign in with Microsoft
   * @returns {Promise<Object>} User data
   */
  const signInWithMicrosoftAuth = async () => {
    try {
      const user = await microsoftAuth.signIn();

      // User will be set by Firebase auth state change listener
      return user;
    } catch (error) {
      console.error("Microsoft sign-in error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    setUser,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    signInWithGoogle: signInWithGoogleAuth,
    signInWithApple: signInWithAppleAuth,
    signInWithMicrosoft: signInWithMicrosoftAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
