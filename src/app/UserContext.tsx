import { onAuthStateChanged } from "firebase/auth";
import { Auth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

// Use the runtime JS helpers to centralize firebase usage.
import { auth as importedAuth } from "../../firebase.js";
const typedAuth: Auth = importedAuth as Auth;

const typedAuth: Auth = importedAuth as Auth;
import { signOutUser } from "./auth.js";
import { getUserDoc, setUserDoc } from "./firestoreClient.js";

// Small Role type to document expected values in the app.
export type Role = "educator" | "learner" | string;

type User = {
  id: string;
  role?: Role;
};

type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
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
import { normalizeRole } from "./normalizeRole.js";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fbAuth: Auth = typedAuth;
    if (!fbAuth) return;

    const unsub = onAuthStateChanged(fbAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      const uid = firebaseUser.uid;
      // attempt to read role from Firestore users/{uid} using centralized client
      try {
        const data = await getUserDoc(uid);
        // normalize legacy role strings if present (trainer->educator, student->learner)
        // (uses top-level `normalizeRole` helper)

        if (!data) {
          // create a minimal user doc with default role 'learner'
          await setUserDoc(uid, {
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
    // Use centralized signOut helper which logs failures safely
    signOutUser().catch(() => {});
    setUser(null);
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}
