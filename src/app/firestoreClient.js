// Centralized Firestore helpers using ES module syntax.
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../firebase.js";

let _db;
function getDb() {
  if (_db) return _db;
  try {
    _db = app ? getFirestore(app) : getFirestore();
    return _db;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Firestore not available in this environment", e);
    return null;
  }
}

export async function getUserDoc(uid) {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function setUserDoc(uid, data) {
  const db = getDb();
  if (!db) throw new Error("Firestore not available");
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

export { getDb };
