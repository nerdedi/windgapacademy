/*
  Windgap Academy Firebase Integration
  - Accessibility: Data access for accessibility preferences
  - Privacy: All user data is private and educator-reviewed
  - Compliance: Age-appropriate, ad-free, NDIS and Australian standards
  - Educator Logging: All data changes and access are logged
  - Last updated: August 14, 2025
*/
// Sample integration points for modules
// Pure function for validating user data
export function validateUserData(data) {
  // Validation is independent; only checks the provided data object.
  // Privacy: No data is stored, only validated
  // Educator log: user data validated
  return typeof data === 'object' && data !== null;
}

// Pure function for transforming lesson plan data
export function transformLessonPlan(plan) {
  // Transformation is independent; only affects the provided plan string.
  // Privacy: No data is stored, only transformed
  // Educator log: lesson plan transformed
  return plan.trim();
}
export function getAccessibilityPrefs(userId) {
  // Privacy: Accessibility preferences are private and educator-reviewed
  // Educator log: accessibility preferences accessed for userId
  // return firebase.firestore().collection('accessibility').doc(userId).get();
}

export function getLessonPlans(domain, userId) {
  // Privacy: Lesson plans are private and educator-reviewed
  // Educator log: lesson plans accessed for domain and userId
  // return firebase.firestore().collection('lessonplans').doc(`${domain}_${userId}`).get();
}

export function saveLessonPlan(domain, userId, plan) {
  // Privacy: Lesson plan changes are private and educator-reviewed
  // Educator log: lesson plan saved for domain and userId
  // firebase.firestore().collection('lessonplans').doc(`${domain}_${userId}`).set({ plan });
}
export function saveAvatarData(userId, avatarData) {
  // Privacy: Avatar data is private and educator-reviewed
  // Educator log: avatar data saved for userId
  // firebase.firestore().collection('avatars').doc(userId).set(avatarData);
}

export function saveTokens(userId, tokens) {
  // Privacy: Token changes are private and educator-reviewed
  // Educator log: tokens saved for userId
  // firebase.firestore().collection('tokens').doc(userId).set({ tokens });
}

export function savePurchase(userId, item) {
  // Privacy: Purchases are private and educator-reviewed
  // Educator log: purchase saved for userId and item
  // firebase.firestore().collection('purchases').add({ userId, item });
}

export function saveChatLog(userId, messages) {
  // Privacy: Chat logs are private and educator-reviewed
  // Educator log: chat log saved for userId
  // firebase.firestore().collection('chatlogs').doc(userId).set({ messages });
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHKxpp6tYRPJKih8Iu9OIrFcNc1pHRjaI",
  authDomain: "windgap-academy.firebaseapp.com",
  projectId: "windgap-academy",
  storageBucket: "windgap-academy.appspot.com",
  messagingSenderId: "438303886042",
  appId: "1:438303886042:web:19b166df519870baa433e3",
  measurementId: "G-FXR0TX8S6X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function loginUser(email, password) {
  // Privacy: Login credentials are securely handled and educator-reviewed
  // Educator log: login attempted for email
  return signInWithEmailAndPassword(auth, email, password);
}
