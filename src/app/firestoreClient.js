// Simple mock Firestore client for build compatibility
export function getDb() {
  console.warn("Firestore not available in this environment");
  return null;
}

export async function getUserDoc(uid) {
  console.warn("getUserDoc not available - using mock");
  return null;
}

export async function setUserDoc(uid, data) {
  console.warn("setUserDoc not available - using mock");
  return Promise.resolve();
}
