/**
 * @jest-environment jsdom
 */
import { createAuthUrl, initializeAppleAuth, signInWithApple } from "../../src/utils/appleAuth";

// Mock the global window object
delete window.location;
window.location = {
  origin: "https://windgapacademy.org",
};

describe("Apple Authentication Utility", () => {
  // Mock document.createElement and appendChild
  const mockScript = {
    src: "",
    async: false,
    id: "",
    onload: null,
  };

  beforeEach(() => {
    // Reset the mock script
    mockScript.src = "";
    mockScript.async = false;
    mockScript.id = "";
    mockScript.onload = null;

    // Mock document.createElement
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === "script") {
        return mockScript;
      }
      return {};
    });

    // Mock document.body.appendChild
    document.body.appendChild = jest.fn().mockImplementation((element) => {
      if (element === mockScript && typeof element.onload === "function") {
        // Simulate script load
        setTimeout(() => element.onload(), 0);
      }
      return element;
    });

    // Mock window.AppleID
    window.AppleID = {
      auth: {
        init: jest.fn(),
        signIn: jest.fn().mockResolvedValue({
          authorization: {
            code: "test-auth-code",
            id_token: "test-id-token",
            state: "test-state",
          },
          user: {
            name: {
              firstName: "John",
              lastName: "Doe",
            },
            email: "john.doe@example.com",
          },
        }),
      },
    };
  });

  describe("initializeAppleAuth", () => {
    it("should add the Apple Sign In script to the document", () => {
      initializeAppleAuth();

      expect(document.createElement).toHaveBeenCalledWith("script");
      expect(mockScript.src).toBe(
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
      );
      expect(mockScript.async).toBe(true);
      expect(mockScript.id).toBe("apple-sign-in-script");
      expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    });

    it("should initialize Apple Sign In when script loads", (done) => {
      initializeAppleAuth();

      // Allow the script onload callback to execute
      setTimeout(() => {
        expect(window.AppleID.auth.init).toHaveBeenCalledWith({
          clientId: "test-client-id",
          scope: "name email",
          redirectURI: "http://localhost/auth/apple/callback",
          usePopup: true,
        });
        done();
      }, 10);
    });
  });

  describe("signInWithApple", () => {
    it("should resolve with authentication data when sign in is successful", async () => {
      const result = await signInWithApple();

      expect(window.AppleID.auth.signIn).toHaveBeenCalled();
      expect(result).toEqual({
        provider: "apple",
        token: "test-id-token",
        authorizationCode: "test-auth-code",
        user: {
          name: {
            firstName: "John",
            lastName: "Doe",
          },
          email: "john.doe@example.com",
        },
      });
    });

    it("should reject if AppleID is not initialized", async () => {
      window.AppleID = undefined;

      await expect(signInWithApple()).rejects.toThrow("Apple Sign In is not initialized");
    });

    it("should reject if sign in fails", async () => {
      const error = new Error("Sign in failed");
      window.AppleID.auth.signIn = jest.fn().mockRejectedValue(error);

      await expect(signInWithApple()).rejects.toEqual(error);
    });
  });

  describe("createAuthUrl", () => {
    it("should create a valid authentication URL with all parameters", () => {
      const authData = {
        token: "test-token",
        authorizationCode: "test-code",
        user: {
          name: {
            firstName: "John",
            lastName: "Doe",
          },
          email: "john.doe@example.com",
        },
      };

      const url = createAuthUrl(authData);

      expect(url).toBe(
        "/api/auth/apple/callback?token=test-token&code=test-code&firstName=John&lastName=Doe&email=john.doe%40example.com",
      );
    });

    it("should create a valid authentication URL with minimal parameters", () => {
      const authData = {
        token: "test-token",
        authorizationCode: "test-code",
      };

      const url = createAuthUrl(authData);

      expect(url).toBe("/api/auth/apple/callback?token=test-token&code=test-code");
    });
  });
});
