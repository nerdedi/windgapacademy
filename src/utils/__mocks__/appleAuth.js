/* global jest */
/**
 * Mock Apple Authentication Utility for Jest tests
 */

export const initializeAppleAuth = jest.fn(() => {
  // Mock implementation
  return Promise.resolve();
});

export const signInWithApple = jest.fn(() => {
  return Promise.resolve({
    user: {
      name: {
        firstName: "Test",
        lastName: "User",
      },
      email: "test@example.com",
    },
    token: "mock-apple-token",
  });
});

export default {
  initializeAppleAuth,
  signInWithApple,
};
