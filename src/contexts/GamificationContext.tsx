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

  const addXP = useCallback(
    async (amount: number) => {
      setState((s) => ({ ...s, xp: s.xp + amount }));
      try {
        const uid = (window as any).__CURRENT_USER_ID__;
        if (uid) await setUserDoc(uid, { gamification: { xp: (state.xp || 0) + amount } });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to persist XP", e);
      }
    },
    [state.xp],
  );

  const awardBadge = useCallback(
    async (badge: string) => {
      setState((s) => ({ ...s, badges: Array.from(new Set([...s.badges, badge])) }));
      try {
        const uid = (window as any).__CURRENT_USER_ID__;
        if (uid)
          await setUserDoc(uid, { gamification: { badges: [...(state.badges || []), badge] } });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to persist badge", e);
      }
    },
    [state.badges],
  );

  const unlockGame = useCallback((id: string) => {
    setState((s) => ({ ...s, unlockedGames: Array.from(new Set([...s.unlockedGames, id])) }));
  }, []);

  const reset = useCallback(() => setState(defaultState), []);

  return (
    <GamificationContext.Provider value={{ ...state, addXP, awardBadge, unlockGame, reset }}>
      {children}
    </GamificationContext.Provider>
  );
};
