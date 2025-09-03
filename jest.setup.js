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
