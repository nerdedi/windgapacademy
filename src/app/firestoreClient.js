// Centralized Firestore helpers. Uses lazy requires to avoid breaking test envs.
let _db;
function getDb() {
  if (_db) return _db;
  try {
    // eslint-disable-next-line global-require
    const { getFirestore } = require("firebase/firestore");
    _db = getFirestore();
    return _db;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Firestore not available in this environment", e);
    return null;
  }
}

async function getUserDoc(uid) {
  const db = getDb();
  if (!db) return null;
  // eslint-disable-next-line global-require
  const { doc, getDoc } = require("firebase/firestore");
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

async function setUserDoc(uid, data) {
  const db = getDb();
  if (!db) throw new Error("Firestore not available");
  // eslint-disable-next-line global-require
  const { doc, setDoc } = require("firebase/firestore");
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

module.exports = { getDb, getUserDoc, setUserDoc };
