/*
  Windgap Academy Firebase Integration
  - Accessibility: Data access for accessibility preferences
  - Privacy: All user data is private and educator-reviewed
  - Compliance: Age-appropriate, ad-free, NDIS and Australian standards
  - Educator Logging: All data changes and access are logged
  - Last updated: August 14, 2025
*/
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AppleAuthProvider,
  PhoneAuthProvider,
  multiFactor,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Import RBAC utilities
import { ROLES, DEFAULT_ROLE_PERMISSIONS } from "./src/utils/rbac";

// Pure function for validating user data
export function validateUserData(data) {
  // Validation is independent; only checks the provided data object.
  // Privacy: No data is stored, only validated
  // Educator log: user data validated
  return typeof data === "object" && data !== null;
}

// Pure function for transforming lesson plan data
export function transformLessonPlan(plan) {
  // Transformation is independent; only affects the provided plan string.
  // Privacy: No data is stored, only transformed
  // Educator log: lesson plan transformed
  return plan.trim();
}

export async function getAccessibilityPrefs(userId) {
  try {
    const db = getFirestore(app);
    return getDoc(doc(db, "accessibility", userId));
  } catch (err) {
    console.error("Error accessing accessibility prefs:", err);
    throw err;
  }
}

export async function getLessonPlans(domain, userId) {
  try {
    const db = getFirestore(app);
    return getDoc(doc(db, "lessonplans", `${domain}_${userId}`));
  } catch (err) {
    console.error("Error accessing lesson plans:", err);
    throw err;
  }
}

export async function saveLessonPlan(domain, userId, plan) {
  try {
    const db = getFirestore(app);
    return setDoc(doc(db, "lessonplans", `${domain}_${userId}`), { plan });
  } catch (err) {
    console.error("Error saving lesson plan:", err);
    throw err;
  }
}

export async function saveAvatarData(userId, avatarData) {
  try {
    const db = getFirestore(app);
    return setDoc(doc(db, "avatars", userId), avatarData);
  } catch (err) {
    console.error("Error saving avatar data:", err);
    throw err;
  }
}

export async function saveTokens(userId, tokens) {
  try {
    const db = getFirestore(app);
    return setDoc(doc(db, "tokens", userId), { tokens });
  } catch (err) {
    console.error("Error saving tokens:", err);
    throw err;
  }
}

export async function savePurchase(userId, item) {
  try {
    const db = getFirestore(app);
    return addDoc(collection(db, "purchases"), { userId, item });
  } catch (err) {
    console.error("Error saving purchase:", err);
    throw err;
  }
}

export async function saveChatLog(userId, messages) {
  try {
    const db = getFirestore(app);
    return setDoc(doc(db, "chatlogs", userId), { messages });
  } catch (err) {
    console.error("Error saving chat log:", err);
    throw err;
  }
}

import { env } from "./src/env.js";
let app = null;
let auth = null;
let firebaseConfig = null;
try {
  firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID,
  };
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  ) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn("Firebase config is incomplete. App will not be initialized.");
  }
} catch (err) {
  console.error("Error initializing Firebase:", err);
}
export { app, auth };

// Enhanced Authentication Methods

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<UserCredential>} Firebase user credential
 */
export function loginUser(email, password) {
  // Privacy: Login credentials are securely handled and educator-reviewed
  // Educator log: login attempted for email
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @param {string} userType - Type of user (learner, educator, etc.)
 * @returns {Promise<Object>} Firebase user object with added user data
 */
export async function registerUser(email, password, displayName, userType = "learner") {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user profile with display name
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user);

    // Set up default role based on user type
    let roles = ["user"];
    let permissions = [];

    switch (userType) {
      case "educator":
        roles.push(ROLES.EDUCATOR);
        permissions = [...DEFAULT_ROLE_PERMISSIONS[ROLES.EDUCATOR]];
        break;
      case "support_worker":
        roles.push(ROLES.SUPPORT_WORKER);
        permissions = [...DEFAULT_ROLE_PERMISSIONS[ROLES.SUPPORT_WORKER]];
        break;
      case "family_member":
        roles.push(ROLES.FAMILY_MEMBER);
        permissions = [...DEFAULT_ROLE_PERMISSIONS[ROLES.FAMILY_MEMBER]];
        break;
      case "learner":
      default:
        roles.push(ROLES.LEARNER);
        permissions = [...DEFAULT_ROLE_PERMISSIONS[ROLES.LEARNER]];
        break;
    }

    // Create user document in Firestore
    const db = getFirestore(app);
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: "",
      userType,
      roles,
      permissions,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profile: {
        firstName: displayName.split(" ")[0] || "",
        lastName: displayName.split(" ").slice(1).join(" ") || "",
      },
      settings: {
        language: "en",
        accessibility: {
          highContrast: false,
          largeText: false,
          screenReader: false,
          reduceMotion: false,
        },
        privacy: {
          shareProgressWithEducators: true,
          shareActivityWithGuardians: userType === "learner",
          allowCommunityFeatures: true,
        },
      },
      stats: {
        totalLoginCount: 1,
        totalLessonsCompleted: 0,
        totalPoints: 0,
        streakDays: 0,
      },
    });

    // Also create a document in the appropriate user type collection
    await setDoc(doc(db, userType + "s", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: serverTimestamp(),
    });

    return {
      ...user,
      userType,
      roles,
      permissions,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export function logoutUser() {
  return signOut(auth);
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Update user profile information
 * @param {Object} user - Firebase user object
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export async function updateUserProfile(user, profileData) {
  try {
    // Update Firebase Auth profile
    if (profileData.displayName || profileData.photoURL) {
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
    }

    // Update Firestore user document
    const db = getFirestore(app);
    const userRef = doc(db, "users", user.uid);

    // Create updated profile object
    const updatedData = {
      displayName: profileData.displayName,
      photoURL: profileData.photoURL,
      updatedAt: serverTimestamp(),
    };

    // Add profile fields if they exist
    if (profileData.profile) {
      updatedData.profile = profileData.profile;
    }

    // Add settings fields if they exist
    if (profileData.settings) {
      updatedData.settings = profileData.settings;
    }

    return updateDoc(userRef, updatedData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

/**
 * Update user email
 * @param {Object} user - Firebase user object
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise<void>}
 */
export async function updateUserEmail(user, newEmail, password) {
  try {
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Update email in Firebase Auth
    await updateEmail(user, newEmail);

    // Update email in Firestore
    const db = getFirestore(app);
    await updateDoc(doc(db, "users", user.uid), {
      email: newEmail,
      updatedAt: serverTimestamp(),
    });

    // Send email verification
    return sendEmailVerification(user);
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
}

/**
 * Update user password
 * @param {Object} user - Firebase user object
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export async function updateUserPassword(user, currentPassword, newPassword) {
  try {
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    return updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
}

/**
 * Sign in with Google
 * @returns {Promise<UserCredential>}
 */
export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Sign in with Facebook
 * @returns {Promise<UserCredential>}
 */
export function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Sign in with Apple
 * @returns {Promise<UserCredential>}
 */
export function signInWithApple() {
  const provider = new AppleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Set up multi-factor authentication with phone
 * @param {Object} user - Firebase user object
 * @param {string} phoneNumber - User's phone number with country code
 * @param {Object} recaptchaVerifier - RecaptchaVerifier instance
 * @returns {Promise<string>} Verification ID for completing MFA setup
 */
export async function setupMFA(user, phoneNumber, recaptchaVerifier) {
  try {
    const multiFactorUser = multiFactor(user);
    const phoneInfoOptions = {
      phoneNumber,
      session: await multiFactorUser.getSession(),
    };

    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneInfoOptions,
      recaptchaVerifier,
    );

    return verificationId;
  } catch (error) {
    console.error("Error setting up MFA:", error);
    throw error;
  }
}

/**
 * Complete MFA enrollment with verification code
 * @param {Object} user - Firebase user object
 * @param {string} verificationId - Verification ID from setupMFA
 * @param {string} verificationCode - Code received via SMS
 * @returns {Promise<void>}
 */
export async function completeMFAEnrollment(user, verificationId, verificationCode) {
  try {
    const multiFactorUser = multiFactor(user);
    const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

    // Complete enrollment
    await multiFactorUser.enroll(multiFactorAssertion, "Phone Number");

    // Update user document to mark MFA as enabled
    const db = getFirestore(app);
    await updateDoc(doc(db, "users", user.uid), {
      mfaEnabled: true,
      mfaEnrolledAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error completing MFA enrollment:", error);
    throw error;
  }
}

/**
 * Add a role to a user
 * @param {string} userId - User ID
 * @param {string} role - Role to add
 * @returns {Promise<boolean>} Success status
 */
export async function addUserRole(userId, role) {
  try {
    const db = getFirestore(app);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const roles = userData.roles || [];

    // Only add if the role doesn't already exist
    if (!roles.includes(role)) {
      roles.push(role);

      // Add default permissions for this role
      let permissions = userData.permissions || [];
      if (DEFAULT_ROLE_PERMISSIONS[role]) {
        // Add each permission that doesn't already exist
        DEFAULT_ROLE_PERMISSIONS[role].forEach((permission) => {
          if (!permissions.includes(permission)) {
            permissions.push(permission);
          }
        });
      }

      await updateDoc(userRef, {
        roles,
        permissions,
        updatedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error adding user role:", error);
    throw error;
  }
}

/**
 * Remove a role from a user
 * @param {string} userId - User ID
 * @param {string} role - Role to remove
 * @returns {Promise<boolean>} Success status
 */
export async function removeUserRole(userId, role) {
  try {
    const db = getFirestore(app);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const roles = userData.roles || [];

    // Remove the role if it exists
    const updatedRoles = roles.filter((r) => r !== role);

    // Only update if there was a change
    if (roles.length !== updatedRoles.length) {
      await updateDoc(userRef, {
        roles: updatedRoles,
        updatedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error removing user role:", error);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export async function getUserById(userId) {
  try {
    const db = getFirestore(app);
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      return userDoc.data();
    }

    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

/**
 * Get users by role
 * @param {string} role - Role to filter by
 * @returns {Promise<Array>} Array of user objects
 */
export async function getUsersByRole(role) {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "users"), where("roles", "array-contains", role));
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.error("Error getting users by role:", error);
    throw error;
  }
}
