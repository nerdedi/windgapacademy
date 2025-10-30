/*
  Windgap Academy Firebase Integration
  - Firebase Authentication and Firestore
  - Fixed exports for Vite compatibility
*/
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  multiFactor,
  OAuthProvider,
  onAuthStateChanged,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC9vm4XXrKPByzwVtaDmvaWL2IsZ5my8xw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "windgap-academy-e2c48.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "windgap-academy-e2c48",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "windgap-academy-e2c48.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "444841255811",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:444841255811:web:24f12f01c19e51d4f7ccb6",
  // measurementId removed - using Vercel Analytics instead to avoid CORS issues
};

const app = initializeApp(firebaseConfig);
export { app }; // Export the app instance
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Exporting Firestore functions
export {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
};

// Export auth functions with consistent naming - use proper function name
export {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  multiFactor,
  OAuthProvider,
  onAuthStateChanged,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
};

// Utility functions
export function validateUserData(data) {
  return typeof data === "object" && data !== null;
}

export function transformLessonPlan(plan) {
  return plan.trim();
}
