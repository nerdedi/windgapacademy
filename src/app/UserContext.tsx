import { onAuthStateChanged, signOut } from "firebase/auth";
import { Auth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

import { auth as importedAuth } from "../../firebase.js";
const typedAuth: Auth = importedAuth as Auth;

type User = {
  id: string;
  role?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fbAuth: Auth = typedAuth;
    if (!fbAuth) return;

    const db = getFirestore();
    const unsub = onAuthStateChanged(fbAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      const uid = firebaseUser.uid;
      // attempt to read role from Firestore users/{uid}
      try {
        const snap = await getDoc(doc(db, "users", uid));
        const data = snap.exists() ? snap.data() : null;
        // normalize legacy role strings if present (trainer->educator, student->learner)
        const normalizeRole = (r: any) => {
          if (!r) return undefined;
          const s = String(r).toLowerCase();
          if (s === "student") return "learner";
          if (s === "trainer") return "educator";
          // allow existing educator/learner values through
          if (s === "educator" || s === "learner") return s;
          return s; // unknown roles returned as-is
        };

        if (!data) {
          // create a minimal user doc with default role 'learner'
          await setDoc(doc(db, "users", uid), {
            role: "learner",
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
          });
          setUser({ id: uid, role: "learner" });
        } else {
          const role = normalizeRole(data.role) || "learner";
          setUser({ id: uid, role });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch or create user role", e);
        setUser({ id: uid });
      }
    });

    return () => unsub();
  }, []);

  const logout = () => {
    if (typedAuth) signOut(typedAuth).catch(() => {});
    setUser(null);
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}
