// Small no-op stubs for legacy global helper functions used across the app.
// These reduce lint "no-undef" noise and let us incrementally replace real implementations.
export function applyHeadingAnimation() {
  // no-op stub
}

export function applyButtonAnimation() {
  // no-op stub
}

export function setAriaAttributes() {
  // no-op stub
}

export function updateProgress() {
  // no-op stub
}

export function getAchievements() {
  return [];
}

export const i18n = { en: { error: "An error occurred" } };
export const currentLang = "en";

export function resetProgress() {
  // no-op
}

export function startOnboarding() {
  // no-op
}

export function resetOnboarding() {
  // no-op
}

export function showOnboarding() {
  // no-op
}

export function backupProgress() {
  // no-op
}

export function syncProgress() {
  // no-op
}

export function updateLeaderboard() {
  // no-op
}

export function sendFeedback() {
  // no-op
}

export function logEvent() {
  // no-op
}

export function safeRun(fn) {
  try {
    return fn();
  } catch (e) {
    console.error(e);
  }
}

export function showSettings() {
  // no-op
}

// Expose a few commonly used globals to satisfy imports that expect them on window.
if (typeof window !== "undefined") {
  window.applyHeadingAnimation = applyHeadingAnimation;
  window.applyButtonAnimation = applyButtonAnimation;
  window.setAriaAttributes = setAriaAttributes;
  window.updateProgress = updateProgress;
  window.i18n = i18n;
  window.currentLang = currentLang;
}

export default {
  applyHeadingAnimation,
  applyButtonAnimation,
  setAriaAttributes,
  updateProgress,
  getAchievements,
  i18n,
  currentLang,
};
