import { useEffect, useState } from "react";

/**
 * useCustomization
 * - prefsKey: localStorage key
 * - defaultPrefs: object
 *
 * Returns [prefs, setPrefs]
 */
export default function useCustomization(prefsKey = "wg_prefs", defaultPrefs = {}) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(prefsKey);
      return raw ? JSON.parse(raw) : defaultPrefs;
    } catch (e) {
      return defaultPrefs;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefsKey, JSON.stringify(prefs));
    } catch (e) {
      // ignore storage errors
    }
  }, [prefsKey, prefs]);

  return [prefs, setPrefs];
}
