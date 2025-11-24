/** @type {import('jest').Config} */
const config = {
  verbose: true,
  bail: false,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js',
    '<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testEnvironment: 'jsdom',
  // Force React to development mode for testing
  globals: {
    'process.env.NODE_ENV': 'development',
  },
  testRunner: 'jest-circus/runner',
  testPathIgnorePatterns: [
    '<rootDir>/playwright/',
    '<rootDir>/o3de/',
    '<rootDir>/vite.config.test.js',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^firebase$': '<rootDir>/__mocks__/firebase.js',
    '^firebase/app$': '<rootDir>/__mocks__/firebase.js',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase.js',
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      plugins: [
        ['babel-plugin-transform-define', {
          'import.meta.env': {
            VITE_APPLE_CLIENT_ID: 'test-client-id',
            VITE_FIREBASE_API_KEY: 'test-api-key',
            VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
            VITE_FIREBASE_PROJECT_ID: 'test-project-id',
            VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
            VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
            VITE_FIREBASE_APP_ID: 'test-app-id',
            DEV: true,
            MODE: 'development'
          }
        }]
      ]
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(three|@react-three|framer-motion)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};

module.exports = config;
