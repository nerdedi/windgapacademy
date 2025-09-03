import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase.js";

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
  const fbAuth: any = auth;
  if (!fbAuth) return undefined;
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
        if (!data) {
          // create a minimal user doc with default role 'learner'
          await setDoc(doc(db, "users", uid), {
            role: "learner",
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
          });
          setUser({ id: uid, role: "learner" });
        } else {
          setUser({ id: uid, role: data.role });
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
    const fbAuth: any = auth;
    if (fbAuth) signOut(fbAuth).catch(() => {});
    setUser(null);
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}
