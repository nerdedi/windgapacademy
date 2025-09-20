import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AppleAuthProvider,
  TwitterProvider,
  sendEmailVerification,
  updateProfile,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebase";

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Helper function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        // Create user document if it doesn't exist
        const newUserData = {
          uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || "",
          photoURL: auth.currentUser.photoURL || "",
          roles: ["user"], // Default role
          permissions: ["read:own_profile"],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", uid), newUserData);
        return newUserData;
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          // User is signed in
          const userData = await fetchUserData(user.uid);
          if (userData) {
            setUserRoles(userData.roles || []);
            setUserPermissions(userData.permissions || []);

            // Update last login time
            await updateDoc(doc(db, "users", user.uid), {
              lastLogin: new Date().toISOString(),
            });

            setCurrentUser({
              ...user,
              roles: userData.roles || [],
              permissions: userData.permissions || [],
              userType: userData.userType || "learner",
            });
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          setUserRoles([]);
          setUserPermissions([]);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth, db]);

  // Sign in with email and password
  const signIn = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, displayName, userType = "learner") => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile
      await updateProfile(result.user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email,
        displayName,
        photoURL: "",
        roles: ["user"],
        permissions: ["read:own_profile"],
        userType,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      // Send email verification
      await sendEmailVerification(result.user);

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logOut = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    setError(null);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    setError(null);
    try {
      const provider = new AppleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Enroll MFA
  const enrollMFA = async (phoneNumber, verifier) => {
    setError(null);
    try {
      if (!auth.currentUser) {
        throw new Error("User must be signed in to enroll in MFA");
      }

      const multiFactorUser = multiFactor(auth.currentUser);
      const phoneInfoOptions = {
        phoneNumber,
        session: await multiFactorUser.getSession(),
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier);

      return verificationId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Complete MFA enrollment with verification code
  const completeMFAEnrollment = async (verificationId, verificationCode) => {
    setError(null);
    try {
      if (!auth.currentUser) {
        throw new Error("User must be signed in to complete MFA enrollment");
      }

      const multiFactorUser = multiFactor(auth.currentUser);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);

      await multiFactorUser.enroll(multiFactorAssertion, "Phone Number");

      // Update user document to mark MFA as enabled
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        mfaEnabled: true,
        mfaEnrolledAt: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Check if user has the required role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.roles && currentUser.roles.includes(role);
  };

  // Check if user has the required permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions && currentUser.permissions.includes(permission);
  };

  // Add a role to a user
  const addRole = async (userId, role) => {
    setError(null);
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const roles = userData.roles || [];

      if (!roles.includes(role)) {
        roles.push(role);
        await updateDoc(userRef, { roles });

        // Update local state if this is the current user
        if (currentUser && currentUser.uid === userId) {
          setUserRoles([...roles]);
          setCurrentUser({
            ...currentUser,
            roles,
          });
        }
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove a role from a user
  const removeRole = async (userId, role) => {
    setError(null);
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const roles = userData.roles || [];
      const updatedRoles = roles.filter((r) => r !== role);

      await updateDoc(userRef, { roles: updatedRoles });

      // Update local state if this is the current user
      if (currentUser && currentUser.uid === userId) {
        setUserRoles([...updatedRoles]);
        setCurrentUser({
          ...currentUser,
          roles: updatedRoles,
        });
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userRoles,
    userPermissions,
    loading,
    error,
    signIn,
    signUp,
    logOut,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    enrollMFA,
    completeMFAEnrollment,
    hasRole,
    hasPermission,
    addRole,
    removeRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
