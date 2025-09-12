// Simple mock Firebase client for build compatibility
export const app = null;
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Mock implementation
    callback(null);
    return () => {}; // unsubscribe function
  },
};

export function getFirestoreClient() {
  console.warn("Firestore not available in this environment");
  return null;
}
