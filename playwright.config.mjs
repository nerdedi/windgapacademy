// Playwright config to only run .mjs test files
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  testMatch: /.*\.spec\.mjs$/,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
