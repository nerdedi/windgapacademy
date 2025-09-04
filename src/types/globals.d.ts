// Type declarations for a small firebaseClient wrapper and commonly used legacy globals.
declare module "../lib/firebaseClient" {
  import type { FirebaseApp } from "firebase/app";
  import type { Auth } from "firebase/auth";
  export const app: FirebaseApp | null;
  export const auth: Auth | null;
}

declare const applyHeadingAnimation: (...args: any[]) => void;
declare const applyButtonAnimation: (...args: any[]) => void;
declare const setAriaAttributes: (...args: any[]) => void;
declare const updateProgress: (...args: any[]) => void;
declare const i18n: any;
declare const currentLang: string;
declare const backupProgress: (...args: any[]) => void;
declare const syncProgress: (...args: any[]) => void;
declare const updateLeaderboard: (...args: any[]) => void;
declare const sendFeedback: (...args: any[]) => void;
declare const logEvent: (...args: any[]) => void;
declare const safeRun: (fn: Function) => any;
declare const showSettings: (...args: any[]) => void;

export {};
