require("@testing-library/jest-dom");

// Polyfill TextEncoder for Node.js tests (some deps rely on it)
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}

// Provide a harmless window.alert implementation for jsdom tests
if (typeof window !== "undefined" && typeof window.alert !== "function") {
  window.alert = (msg) => {
    // no-op to keep tests from throwing when components call alert
    // eslint-disable-next-line no-console
    console.info("window.alert called during test:", msg);
  };
}

// Ensure JWT_SECRET is available during tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-secret-for-jest";
}

// Provide harmless global helper stubs used by legacy UI code.
const noop = () => {};
const noopSafeRun = (fn) => {
  try {
    return typeof fn === "function" ? fn() : undefined;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

if (typeof global !== "undefined") {
  global.backupProgress = global.backupProgress || noop;
  global.syncProgress = global.syncProgress || noop;
  global.updateLeaderboard = global.updateLeaderboard || noop;
  global.sendFeedback = global.sendFeedback || noop;
  global.logEvent = global.logEvent || noop;
  global.safeRun = global.safeRun || noopSafeRun;
  global.showOnboarding = global.showOnboarding || noop;
  global.showSettings = global.showSettings || noop;
}
if (typeof window !== "undefined") {
  window.backupProgress = window.backupProgress || noop;
  window.syncProgress = window.syncProgress || noop;
  window.updateLeaderboard = window.updateLeaderboard || noop;
  window.sendFeedback = window.sendFeedback || noop;
  window.logEvent = window.logEvent || noop;
  window.safeRun = window.safeRun || noopSafeRun;
  window.showOnboarding = window.showOnboarding || noop;
  window.showSettings = window.showSettings || noop;
}
