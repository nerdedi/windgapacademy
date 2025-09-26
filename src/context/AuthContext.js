import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  _createUserWithEmailAndPassword as createUserWithEmailAndPassword,
  doc,
  _FacebookAuthProvider as FacebookAuthProvider,
  _signOut as firebaseSignOut,
  firestore,
  getDoc,
  _GoogleAuthProvider as GoogleAuthProvider,
  _sendEmailVerification as sendEmailVerification,
  serverTimestamp,
  setDoc,
  _signInWithEmailAndPassword as signInWithEmailAndPassword,
  _signInWithPopup as signInWithPopup,
  updateDoc,
  _updateProfile as updateProfile,
} from "../../firebase";

// Import auth error handlers
import { logAuthError, parseFirebaseError, validatePassword } from "../utils/authErrorHandler";

export const AuthContext = createContext();

/**
 * AuthProvider component that provides authentication functionality
 * and user state management throughout the application.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Removed userRoles and userPermissions state as they are not used directly
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLoginTime, setLastLoginTime] = useState(null);

  // Helper function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }

      // Create user document if it doesn't exist
      const newUserData = {
        uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || "",
        photoURL: auth.currentUser.photoURL || "",
        roles: ["user"], // Default role
        permissions: ["read:own_profile"],
        userType: "learner", // Default user type
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", uid), newUserData);
      return newUserData;
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in - fetch additional data from Firestore
          const userData = await fetchUserData(user.uid);

          if (userData) {
            // Removed setUserRoles and setUserPermissions as they are not defined
            setUserProfile(userData);
            setLastLoginTime(userData.lastLogin);

            // Update last login time
            await updateDoc(doc(firestore, "users", user.uid), {
              lastLogin: serverTimestamp(),
            });

            // Combine Firebase user with custom data
            setCurrentUser({
              ...user,
              roles: userData.roles || [],
              permissions: userData.permissions || [],
              userType: userData.userType || "learner",
              profile: userData,
            });
          } else {
            // Basic user info if Firestore fetch fails
            setCurrentUser(user);
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          // Removed setUserRoles and setUserPermissions as they are not defined
          setUserProfile(null);
          setLastLoginTime(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("Authentication state error: " + err.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Import our error handler
  // Add this import at the top of your file
  // import { parseFirebaseError, validatePassword, logAuthError } from "../utils/authErrorHandler";

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);

      // Add login attempt tracking
      const userRef = doc(firestore, "authAttempts", email.toLowerCase());
      const userAttempts = await getDoc(userRef);

      if (userAttempts.exists()) {
        const { attempts, lastAttempt } = userAttempts.data();
        const now = new Date();
        const lastAttemptTime = new Date(lastAttempt);
        const hoursPassed = (now - lastAttemptTime) / (1000 * 60 * 60);

        // If there have been too many recent attempts, block login
        if (attempts >= 5 && hoursPassed < 1) {
          setError("Too many login attempts. Please try again later or reset your password.");
          throw new Error("Too many login attempts");
        }

        // Reset attempts if more than 1 hour has passed
        if (hoursPassed >= 1) {
          await setDoc(userRef, {
            attempts: 1,
            lastAttempt: serverTimestamp(),
          });
        } else {
          // Increment attempts
          await setDoc(
            userRef,
            {
              attempts: attempts + 1,
              lastAttempt: serverTimestamp(),
            },
            { merge: true },
          );
        }
      } else {
        // First login attempt for this email
        await setDoc(userRef, {
          attempts: 1,
          lastAttempt: serverTimestamp(),
        });
      }

      // Attempt login
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Reset attempts on successful login
      await setDoc(
        userRef,
        {
          attempts: 0,
          lastAttempt: serverTimestamp(),
          lastSuccessfulLogin: serverTimestamp(),
        },
        { merge: true },
      );
      return result.user;
    } catch (err) {
      console.error("Sign in error:", err);

      // Use our error handler
      const { userMessage } = parseFirebaseError(err);
      setError(userMessage);

      // Log the error for analytics/debugging
      logAuthError("sign-in", err);

      throw err;
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, displayName, userType = "learner") => {
    try {
      setError(null);

      // Validate password using our utility
      const { isValid, reasons } = validatePassword(password);

      if (!isValid) {
        const errorMessage = `Your password must ${reasons.join(", ")}.`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with displayName
      await updateProfile(result.user, {
        displayName,
      });

      // Create user document in Firestore with roles and permissions
      const userData = {
        uid: result.user.uid,
        email,
        displayName,
        photoURL: "",
        roles: ["user"],
        permissions: ["read:own_profile"],
        userType,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: false,
        accountCreationDate: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", result.user.uid), userData);

      // Send email verification
      await sendEmailVerification(result.user);

      return result.user;
    } catch (err) {
      console.error("Sign up error:", err);

      // Use our error handler
      const { userMessage } = parseFirebaseError(err);
      setError(userMessage);

      // Log the error for analytics/debugging
      logAuthError("sign-up", err);

      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Failed to sign out: " + err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Failed to sign in with Google: " + err.message);
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

  // Sign in with Apple (disabled - not available in current Firebase version)
  const signInWithApple = async () => {
    throw new Error("Apple sign-in is currently not available");
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      // Update Firebase auth profile
      const profileUpdates = {};
      if (data.displayName) profileUpdates.displayName = data.displayName;
      if (data.photoURL) profileUpdates.photoURL = data.photoURL;

      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(auth.currentUser, profileUpdates);
      }

      // Update additional data in Firestore
      const userRef = doc(firestore, "users", currentUser.uid);

      // Remove any fields that shouldn't be stored in Firestore
      const { password: _password, ...firestoreData } = data;

      await updateDoc(userRef, firestoreData);

      // Refresh user data
      const updatedUserData = await fetchUserData(currentUser.uid);
      if (updatedUserData) {
        // Removed setUserRoles and setUserPermissions as they are not defined
        setUserProfile(updatedUserData);

        // Update currentUser with the new data
        setCurrentUser({
          ...auth.currentUser,
          roles: updatedUserData.roles || [],
          permissions: updatedUserData.permissions || [],
          userType: updatedUserData.userType || "learner",
          profile: updatedUserData,
        });
      }

      return true;
    } catch (err) {
      console.error("Update user profile error:", err);
      setError("Failed to update profile: " + err.message);
      throw err;
    }
  };

  // Update avatar/profile picture
  const updateAvatar = async (photoURL) => {
    return updateUserProfile({ photoURL });
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    return updateUserProfile({ preferences });
  };

  // Check if user has required role
  const hasRole = (role) => {
    return currentUser?.roles?.includes(role) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return currentUser?.emailVerified || false;
  };

  // Send email verification link
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      await sendEmailVerification(auth.currentUser);
      return true;
    } catch (err) {
      console.error("Send verification email error:", err);
      const { userMessage } = parseFirebaseError(err);
      setError(userMessage);
      throw err;
    }
  };

  // Check if account is locked
  const checkAccountLock = async (email) => {
    try {
      const userRef = doc(firestore, "authAttempts", email.toLowerCase());
      const userAttempts = await getDoc(userRef);

      if (userAttempts.exists()) {
        const { attempts, lastAttempt, locked, lockUntil } = userAttempts.data();

        // Check if account is explicitly locked
        if (locked) {
          const now = new Date();
          const lockTime = new Date(lockUntil);

          if (now < lockTime) {
            // Account is still locked
            const minutesRemaining = Math.ceil((lockTime - now) / (1000 * 60));
            return {
              locked: true,
              message: `Account temporarily locked. Please try again in ${minutesRemaining} minutes.`,
              remainingTime: minutesRemaining,
            };
          }
          // Lock period expired, update record
          await updateDoc(userRef, {
            locked: false,
            attempts: 0,
          });
          return { locked: false };
        }

        // Check if too many attempts
        if (attempts >= 5) {
          const now = new Date();
          const lastAttemptTime = new Date(lastAttempt);
          const minutesPassed = (now - lastAttemptTime) / (1000 * 60);

          if (minutesPassed < 60) {
            // Lock account for 1 hour
            const lockUntil = new Date(now.getTime() + 60 * 60 * 1000);
            await updateDoc(userRef, {
              locked: true,
              lockUntil: lockUntil,
            });

            return {
              locked: true,
              message:
                "Account temporarily locked due to too many login attempts. Please try again in 60 minutes.",
              remainingTime: 60,
            };
          }
        }
      }

      return { locked: false };
    } catch (err) {
      console.error("Check account lock error:", err);
      return { locked: false }; // Default to not locked on error
    }
  };

  const value = {
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,
    isLoading: loading,
    error,
    lastLoginTime,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    updateUserProfile,
    updateAvatar,
    updatePreferences,
    hasRole,
    hasPermission,
    isEmailVerified,
    sendVerificationEmail,
    checkAccountLock,
  };

  // Use JSX in .jsx files, not .js files
  return React.createElement(AuthContext.Provider, { value }, children);
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
