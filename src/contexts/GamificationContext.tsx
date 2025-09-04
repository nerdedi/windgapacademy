import React, { createContext, useContext, useState, useCallback } from "react";

import { setUserDoc } from "../app/firestoreClient.js";

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

  const addXP = useCallback(async (amount: number) => {
    // use functional updater to avoid stale state
    setState((s) => {
      const newXp = s.xp + amount;
      // persist in background
      (async () => {
        try {
          const uid = (window as any).__CURRENT_USER_ID__;
          if (uid) await setUserDoc(uid, { gamification: { xp: newXp } });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Failed to persist XP", e);
        }
      })();
      return { ...s, xp: newXp };
    });
  }, []);

  const awardBadge = useCallback(async (badge: string) => {
    setState((s) => {
      const newBadges = Array.from(new Set([...s.badges, badge]));
      (async () => {
        try {
          const uid = (window as any).__CURRENT_USER_ID__;
          if (uid) await setUserDoc(uid, { gamification: { badges: newBadges } });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Failed to persist badge", e);
        }
      })();
      return { ...s, badges: newBadges };
    });
  }, []);

  const unlockGame = useCallback((id: string) => {
    if (!id) return;
    setState((s) => {
      const newUnlocked = Array.from(new Set([...s.unlockedGames, id]));
      (async () => {
        try {
          const uid = (window as any).__CURRENT_USER_ID__;
          if (uid) await setUserDoc(uid, { gamification: { unlockedGames: newUnlocked } });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Failed to persist unlocked game", e);
        }
      })();
      return { ...s, unlockedGames: newUnlocked };
    });
  }, []);

  const reset = useCallback(() => setState(defaultState), []);

  return (
    <GamificationContext.Provider value={{ ...state, addXP, awardBadge, unlockGame, reset }}>
      {children}
    </GamificationContext.Provider>
  );
};
