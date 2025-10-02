import { writable } from 'svelte/store';

export interface AccessibilitySettings {
  theme: 'default' | 'high-contrast' | 'dark';
  tileSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reduceMotion: boolean;
  enableKeyboardNav: boolean;
  enableSwitchAccess: boolean;
  focusHighlight: boolean;
  screenReaderOptimized: boolean;
  dwellTime: number; // milliseconds for switch access
  clickDelay: number; // prevent accidental double clicks
}

const defaultSettings: AccessibilitySettings = {
  theme: 'default',
  tileSize: 'medium',
  fontSize: 'medium',
  reduceMotion: false,
  enableKeyboardNav: true,
  enableSwitchAccess: false,
  focusHighlight: true,
  screenReaderOptimized: false,
  dwellTime: 1000,
  clickDelay: 300
};

function createAccessibilityStore() {
  const { subscribe, set, update } = writable<AccessibilitySettings>(defaultSettings);

  return {
    subscribe,
    set,
    update,
    loadSettings: (userId: string) => {
      const saved = localStorage.getItem(`accessibility_${userId}`);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          set({ ...defaultSettings, ...settings });
        } catch (e) {
          console.error('Failed to load accessibility settings:', e);
        }
      }
    },
    saveSettings: (userId: string, settings: AccessibilitySettings) => {
      localStorage.setItem(`accessibility_${userId}`, JSON.stringify(settings));
      set(settings);
    }
  };
}

export const accessibilitySettings = createAccessibilityStore();
