import { createContext, useContext, useEffect, useState } from "react";

import {
  AppleAuthProvider,
  auth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // You could fetch additional user data from Firestore here
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, name) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with displayName
      await auth.currentUser.updateProfile({
        displayName: name,
      });

      // Here you could also save additional user data to Firestore including userType
      return userCredential.user;
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setError(null);
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Facebook sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      setError(null);
      const provider = new AppleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Apple sign in error:", err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
