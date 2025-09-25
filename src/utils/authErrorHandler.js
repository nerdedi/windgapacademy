/**
 * Utility functions for handling Firebase authentication errors
 */

/**
 * Get user-friendly error message from Firebase auth error code
 * @param {string} errorCode - The Firebase error code
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    // Email/Password Authentication Errors
    "auth/email-already-in-use":
      "An account already exists with this email address. Please use a different email or try signing in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled. Please contact support for assistance.",
    "auth/user-not-found":
      "No account exists with this email. Please check your email or create a new account.",
    "auth/wrong-password": "Incorrect password. Please try again or reset your password.",
    "auth/too-many-requests":
      "Too many unsuccessful login attempts. Please try again later or reset your password.",
    "auth/operation-not-allowed": "This sign-in method is not enabled. Please contact support.",
    "auth/weak-password":
      "Your password is too weak. Please use a stronger password with at least 8 characters.",

    // Social Authentication Errors
    "auth/account-exists-with-different-credential":
      "An account already exists with the same email address but different sign-in credentials. Please sign in using your original method.",
    "auth/cancelled-popup-request":
      "The sign-in popup was closed before authentication was completed.",
    "auth/popup-blocked":
      "The sign-in popup was blocked by your browser. Please allow popups for this website.",
    "auth/popup-closed-by-user":
      "The sign-in popup was closed before authentication was completed.",
    "auth/unauthorized-domain":
      "This domain is not authorized for OAuth operations. Please contact support.",

    // Email Actions Errors
    "auth/expired-action-code": "This action code has expired. Please request a new one.",
    "auth/invalid-action-code":
      "The action code is invalid. This can happen if the code is malformed or has already been used.",
    "auth/missing-android-pkg-name": "Missing Android package name.",
    "auth/missing-continue-uri": "Missing continue URL.",
    "auth/missing-ios-bundle-id": "Missing iOS bundle ID.",
    "auth/invalid-continue-uri": "The continue URL is invalid.",
    "auth/unauthorized-continue-uri": "The domain of the continue URL is not whitelisted.",

    // Multi-factor Authentication Errors
    "auth/second-factor-already-enrolled":
      "This second factor is already enrolled for this account.",
    "auth/maximum-second-factor-count-exceeded":
      "The maximum number of second factors for this account has been exceeded.",
    "auth/missing-second-factor-identifier": "Missing second factor identifier.",

    // General Errors
    "auth/internal-error": "An internal authentication error has occurred. Please try again later.",
    "auth/network-request-failed":
      "A network error occurred. Please check your internet connection and try again.",
    "auth/timeout": "The operation has timed out. Please try again.",
    "auth/credential-already-in-use":
      "This credential is already associated with a different user account.",
  };

  return (
    errorMessages[errorCode] || "An unexpected authentication error occurred. Please try again."
  );
};

/**
 * Parse Firebase error object to extract code and message
 * @param {Error} error - Firebase error object
 * @returns {Object} Object containing error code, message, and user-friendly message
 */
export const parseFirebaseError = (error) => {
  // Extract code from Firebase error if available
  const errorCode = error.code || "";
  const errorMessage = error.message || "Unknown error occurred";

  // Get user-friendly message
  const userMessage = getAuthErrorMessage(errorCode);

  return {
    code: errorCode,
    message: errorMessage,
    userMessage,
  };
};

/**
 * Log authentication errors for analytics/debugging
 * @param {string} action - The action being performed (e.g., "sign-in", "sign-up")
 * @param {Error} error - The error object
 */
export const logAuthError = (action, error) => {
  const { code, message } = parseFirebaseError(error);

  console.error(`Auth error during ${action}:`, {
    code,
    message,
    timestamp: new Date().toISOString(),
  });

  // Here you could also send the error to a logging service
  // Example: sendToErrorLogging(action, code, message);
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid and reasons
 */
export const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid =
    validations.length &&
    validations.lowercase + validations.uppercase + validations.number + validations.special >= 3;

  const reasons = [];
  if (!validations.length) reasons.push("be at least 8 characters long");
  if (!validations.lowercase) reasons.push("include a lowercase letter");
  if (!validations.uppercase) reasons.push("include an uppercase letter");
  if (!validations.number) reasons.push("include a number");
  if (!validations.special) reasons.push("include a special character");

  return {
    isValid,
    reasons,
    validations,
  };
};

export default {
  getAuthErrorMessage,
  parseFirebaseError,
  logAuthError,
  validatePassword,
};
