// Simple mock Firestore client for build compatibility
export function getDb() {
  console.warn("Firestore not available in this environment");
  return null;
}

// eslint-disable-next-line no-unused-vars
export async function getUserDoc(uid) {
  console.warn("getUserDoc not available - using mock");
  return null;
}

// eslint-disable-next-line no-unused-vars
export async function setUserDoc(uid, data) {
  console.warn("setUserDoc not available - using mock");
  return Promise.resolve();
}
