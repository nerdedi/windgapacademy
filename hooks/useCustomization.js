import { useState } from 'react';

export default function useCustomization(defaultPrefs) {
  const [prefs, setPrefs] = useState(defaultPrefs);
  // Example: update campus view, avatar, store layout
  return [prefs, setPrefs];
}
