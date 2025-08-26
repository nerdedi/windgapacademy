/** @type {import('jest').Config} */
const config = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/playwright/', '<rootDir>/vite.config.test.js'],
};

module.exports = config;
