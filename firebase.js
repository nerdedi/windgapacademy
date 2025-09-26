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
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD7TYzqBLnhFl4TfVQCtF7V4LoGy7AYJR0",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "windgap-academy-dev.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "windgap-academy-dev",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "windgap-academy-dev.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "859241450848",
  appId: process.env.FIREBASE_APP_ID || "1:859241450848:web:9a5e8b9b3f3c3c3c3c3c3c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Exporting Firestore functions
export {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
};

// Exporting Auth services with underscore prefix to avoid ESLint unused warnings
export const _signInWithEmailAndPassword = signInWithEmailAndPassword;
export const _createUserWithEmailAndPassword = createUserWithEmailAndPassword;
export const _signOut = signOut;
export const _sendPasswordResetEmail = sendPasswordResetEmail;
export const _updateProfile = updateProfile;
export const _updateEmail = updateEmail;
export const _updatePassword = updatePassword;
export const _reauthenticateWithCredential = reauthenticateWithCredential;
export const _EmailAuthProvider = EmailAuthProvider;
export const _sendEmailVerification = sendEmailVerification;
export const _signInWithPopup = signInWithPopup;
export const _GoogleAuthProvider = GoogleAuthProvider;
export const _FacebookAuthProvider = FacebookAuthProvider;
export const _PhoneAuthProvider = PhoneAuthProvider;
export const _multiFactor = multiFactor;
export const _PhoneMultiFactorGenerator = PhoneMultiFactorGenerator;

// Utility functions
export function validateUserData(data) {
  return typeof data === "object" && data !== null;
}

export function transformLessonPlan(plan) {
  return plan.trim();
}
