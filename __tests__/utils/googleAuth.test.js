/**
 * @jest-environment jsdom
 */
import { initializeGoogleAuth, signInWithGoogle, createAuthUrl } from "../../src/utils/googleAuth";

// Mock the global window object if needed
global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    origin: "https://windgapacademy.org",
  },
  writable: true,
});

describe("Google Authentication Utility", () => {
  beforeEach(() => {
    // Add your mocks here
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe("initializeGoogleAuth", () => {
    it("should initialize Google auth", () => {
      initializeGoogleAuth();
      expect(console.log).toHaveBeenCalledWith("Google auth initialized");
    });
  });

  describe("signInWithGoogle", () => {
    it("should resolve with authentication data when sign in is successful", async () => {
      const result = await signInWithGoogle();

      expect(result).toEqual({
        provider: "google",
        token: "example-token",
        user: {
          name: "Google User",
          email: "user@example.com",
        },
      });
    });

    // Add more tests as needed
  });

  describe("createAuthUrl", () => {
    it("should create a valid authentication URL with all parameters", () => {
      const authData = {
        token: "test-token",
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      };

      const url = createAuthUrl(authData);

      expect(url).toBe(
        "/api/auth/google/callback?token=test-token&name=Test+User&email=test%40example.com",
      );
    });

    it("should create a valid authentication URL with minimal parameters", () => {
      const authData = {
        token: "test-token",
      };

      const url = createAuthUrl(authData);

      expect(url).toBe("/api/auth/google/callback?token=test-token");
    });
  });
});
