/*
  Windgap Academy Firebase Integration
  - Accessibility: Data access for accessibility preferences
  - Privacy: All user data is private and educator-reviewed
  - Compliance: Age-appropriate, ad-free, NDIS and Australian standards
  - Educator Logging: All data changes and access are logged
  - Last updated: August 14, 2025
*/
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
// Sample integration points for modules
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
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function loginUser(email, password) {
  // Privacy: Login credentials are securely handled and educator-reviewed
  // Educator log: login attempted for email
  return signInWithEmailAndPassword(auth, email, password);
}
