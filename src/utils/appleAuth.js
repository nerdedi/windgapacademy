/**
 * Apple Authentication Utility
 * Handles Apple Sign In authentication flow for Windgap Academy
 */

/**
 * Initialize Apple Sign In
 * This should be called when the application starts
 */
export const initializeAppleAuth = () => {
  // Add Apple's Sign In script to the document
  const script = document.createElement("script");
  script.src =
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
  script.async = true;
  script.id = "apple-sign-in-script";
  document.body.appendChild(script);

  // Wait for script to load, then initialize
  script.onload = () => {
    // Initialize Apple Sign In if AppleID is available
    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID || process.env.VITE_APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: `${window.location.origin}/auth/apple/callback`,
        usePopup: true,
      });
    }
  };
};

/**
 * Sign in with Apple
 * @returns {Promise} Promise that resolves with the authentication data
 */
export const signInWithApple = () => {
  return new Promise((resolve, reject) => {
    if (!window.AppleID) {
      reject(new Error("Apple Sign In is not initialized"));
      return;
    }

    try {
      window.AppleID.auth.signIn().then(
        (response) => {
          console.log("Apple Sign In successful", response);

          // The authorization object contains:
          // - authorization.code: The authorization code
          // - authorization.id_token: The ID token
          // - authorization.state: The state parameter

          // We need to send this to our backend to complete authentication
          resolve({
            provider: "apple",
            token: response.authorization.id_token,
            authorizationCode: response.authorization.code,
            user: response.user || {},
          });
        },
        (error) => {
          console.error("Apple Sign In failed", error);
          reject(error);
        },
      );
    } catch (error) {
      console.error("Apple Sign In error", error);
      reject(error);
    }
  });
};

/**
 * Create backend authentication URL for Apple
 * @param {Object} authData Data from Apple Sign In
 * @returns {string} URL for backend authentication
 */
export const createAuthUrl = (authData) => {
  const params = new URLSearchParams({
    token: authData.token,
    code: authData.authorizationCode,
    // Include user data if available
    ...(authData.user?.name?.firstName && { firstName: authData.user.name.firstName }),
    ...(authData.user?.name?.lastName && { lastName: authData.user.name.lastName }),
    ...(authData.user?.email && { email: authData.user.email }),
  });

  return `/api/auth/apple/callback?${params.toString()}`;
};

export default {
  initializeAppleAuth,
  signInWithApple,
  createAuthUrl,
};
