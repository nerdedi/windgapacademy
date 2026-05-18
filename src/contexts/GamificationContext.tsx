import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { getUserDoc, setUserDoc } from "../app/firestoreClient.js";
import { useUser } from "../app/UserContext";

type GamificationState = {
  xp: number;
  badges: string[];
  unlockedGames: string[];
  streak: number;
};

type GamificationContextType = GamificationState & {
  addXP: (amount: number) => void;
  awardBadge: (badge: string) => void;
  unlockGame: (id: string) => void;
  reset: () => void;
};

const defaultState: GamificationState = { xp: 0, badges: [], unlockedGames: [], streak: 0 };

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GamificationState>(defaultState);
  const { user } = useUser();
  const uid = user?.id ?? null;
  // Ref so persist helpers always have the latest uid without stale closures
  const uidRef = useRef<string | null>(uid);
  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);

  // Load gamification data from Firestore whenever the logged-in user changes
  useEffect(() => {
    if (!uid) {
      setState(defaultState);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getUserDoc(uid);
        if (!cancelled && data?.gamification) {
          setState((s) => ({ ...s, ...data.gamification }));
        }
      } catch {
        // Firestore unavailable — silently keep local state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const persist = useCallback(async (patch: Partial<GamificationState>) => {
    if (!uidRef.current) return;
    try {
      await setUserDoc(uidRef.current, { gamification: patch });
    } catch {
      // eslint-disable-next-line no-console
      console.warn("Failed to persist gamification data to Firestore");
    }
  }, []);

  const addXP = useCallback(
    (amount: number) => {
      setState((s) => {
        const newXp = s.xp + amount;
        persist({ xp: newXp });
        return { ...s, xp: newXp };
      });
    },
    [persist],
  );

  const awardBadge = useCallback(
    (badge: string) => {
      setState((s) => {
        const newBadges = Array.from(new Set([...s.badges, badge]));
        persist({ badges: newBadges });
        return { ...s, badges: newBadges };
      });
    },
    [persist],
  );

  const unlockGame = useCallback(
    (id: string) => {
      if (!id) return;
      setState((s) => {
        const newUnlocked = Array.from(new Set([...s.unlockedGames, id]));
        persist({ unlockedGames: newUnlocked });
        return { ...s, unlockedGames: newUnlocked };
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setState(defaultState);
    persist(defaultState);
  }, [persist]);

  return (
    <GamificationContext.Provider value={{ ...state, addXP, awardBadge, unlockGame, reset }}>
      {children}
    </GamificationContext.Provider>
  );
};
