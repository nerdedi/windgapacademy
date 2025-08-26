export default {
  babelConfig: "./babel.config.cjs",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/components"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};
