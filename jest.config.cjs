/** @type {import('jest').Config} */
const config = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: ["./jest.setup.js"],
  // setupFiles are executed before the test framework is installed and are good for
  // early polyfills that must be available before any module loads.
  setupFiles: ["./jest.polyfills.js"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).[jt]s?(x)"],
  testEnvironment: "jsdom",
  // Ignore Playwright tests and vite config test files (including o3de subfolder)
  testPathIgnorePatterns: [
    "<rootDir>/playwright/",
    "<rootDir>/o3de/playwright/",
    "<rootDir>/vite.config.test.js",
    "<rootDir>/o3de/vite.config.test.js",
    "<rootDir>/node_modules/",
  ],
};

module.exports = config;
