import {
  onAuthStateChanged,
  signInAnonymously,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

import { auth, app } from "../src/lib/firebaseClient.js";

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
  signInAnon: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      setRole(null);
      if (u && app) {
        try {
          const db = getFirestore(app);
          const docRef = doc(db, "roles", u.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role || null);
          }
        } catch (e) {
          // ignore role fetch errors for now
          // logger could be added if desired
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInAnon = async () => {
    if (!auth) throw new Error("Firebase not initialized");
    await signInAnonymously(auth);
  };

  const signInWithEmail = async (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signOut = async () => {
    if (!auth) return;
    await fbSignOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signInAnon, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
