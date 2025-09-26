import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        // Custom globals for Windgap Academy
        applyHeadingAnimation: "readonly",
        applyButtonAnimation: "readonly",
        setAriaAttributes: "readonly",
        updateProgress: "readonly",
        getAchievements: "readonly",
        i18n: "readonly",
        currentLang: "readonly",
        resetProgress: "readonly",
        startOnboarding: "readonly",
        resetOnboarding: "readonly",
        showOnboarding: "readonly",
        backupProgress: "readonly",
        syncProgress: "readonly",
        updateLeaderboard: "readonly",
        sendFeedback: "readonly",
        logEvent: "readonly",
        safeRun: "readonly",
        showSettings: "readonly",
        gsap: "readonly",
        container: "readonly",
        Tooltip: "readonly",
        BrowserRouter: "readonly",
        location: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
      "no-redeclare": "warn",
      "no-else-return": ["error", { allowElseIf: true }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.test.{js,jsx}", "**/__tests__/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
      "*.min.js",
      "public/**",
      "Logs/**",
      "unity-builds/**",
      "o3de/**",
      "playwright/**",
      "cypress/**",
      "tmp/**",
      "leetcodeanimation-mirror.git/**",
      "**/*.ts",
      "**/*.tsx",
      "**/*.d.ts",
      "src/types/**",
      "src/global.d.ts",
      "src/lib/firebaseClient.ts",
      "src/utils/curriculumLoader.ts",
    ],
  },
  prettier,
];
