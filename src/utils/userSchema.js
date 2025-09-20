/**
 * User Schema Definitions
 *
 * This module defines the schema for user-related data structures in the application.
 * It includes type definitions, validation functions, and default values.
 */

import { ROLES, PERMISSIONS } from "./rbac";

/**
 * User profile schema definition
 * @typedef {Object} UserProfile
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [bio] - User's biography (optional)
 * @property {string} [pronouns] - User's pronouns (optional)
 * @property {string} [avatar] - User's avatar image URL (optional)
 * @property {string} [phoneNumber] - User's phone number (optional)
 * @property {string} [address] - User's address (optional)
 * @property {string} [city] - User's city (optional)
 * @property {string} [state] - User's state/province (optional)
 * @property {string} [postalCode] - User's postal/zip code (optional)
 * @property {string} [country] - User's country (optional)
 */

/**
 * User accessibility preferences schema definition
 * @typedef {Object} AccessibilityPreferences
 * @property {boolean} highContrast - Enable high contrast mode
 * @property {boolean} largeText - Enable large text mode
 * @property {boolean} screenReader - Optimize for screen readers
 * @property {boolean} reduceMotion - Reduce motion in animations
 * @property {string} [textToSpeechVoice] - Preferred text-to-speech voice (optional)
 * @property {number} [textToSpeechRate] - Text-to-speech rate (optional)
 * @property {string} [colorScheme] - Color scheme preference (optional)
 */

/**
 * User privacy settings schema definition
 * @typedef {Object} PrivacySettings
 * @property {boolean} shareProgressWithEducators - Allow educators to view progress
 * @property {boolean} shareActivityWithGuardians - Allow guardians to view activity
 * @property {boolean} allowCommunityFeatures - Enable community features
 * @property {boolean} [allowAnalytics] - Allow analytics tracking (optional)
 * @property {boolean} [allowNotifications] - Allow notifications (optional)
 */

/**
 * User statistics schema definition
 * @typedef {Object} UserStats
 * @property {number} totalLoginCount - Total number of logins
 * @property {number} totalLessonsCompleted - Total completed lessons
 * @property {number} totalPoints - Total points earned
 * @property {number} streakDays - Consecutive days of activity
 * @property {Date} [lastActiveAt] - Last activity timestamp (optional)
 * @property {Object} [lessonProgress] - Progress by lesson ID (optional)
 * @property {Object} [skillLevels] - Skill levels by category (optional)
 */

/**
 * Complete user document schema definition
 * @typedef {Object} UserDocument
 * @property {string} uid - User's unique identifier
 * @property {string} email - User's email address
 * @property {string} displayName - User's display name
 * @property {string} [photoURL] - User's profile photo URL (optional)
 * @property {boolean} emailVerified - Whether email is verified
 * @property {string[]} roles - User's roles
 * @property {string[]} permissions - User's permissions
 * @property {string} userType - Type of user (learner, educator, etc.)
 * @property {boolean} [mfaEnabled] - Whether MFA is enabled (optional)
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} lastLogin - Last login timestamp
 * @property {Date} [mfaEnrolledAt] - MFA enrollment timestamp (optional)
 * @property {UserProfile} profile - User profile information
 * @property {Object} settings - User settings
 * @property {string} settings.language - Preferred language
 * @property {AccessibilityPreferences} settings.accessibility - Accessibility preferences
 * @property {PrivacySettings} settings.privacy - Privacy settings
 * @property {UserStats} stats - User statistics
 */

/**
 * Default values for a new user
 * @param {string} uid - User's unique identifier
 * @param {string} email - User's email address
 * @param {string} displayName - User's display name
 * @param {string} userType - Type of user (default: 'learner')
 * @returns {UserDocument} Default user document
 */
export function createDefaultUserDocument(uid, email, displayName, userType = "learner") {
  // Determine default roles and permissions based on user type
  const roles = ["user"];
  let permissions = [];

  switch (userType) {
    case "admin":
      roles.push(ROLES.ADMIN);
      break;
    case "educator":
      roles.push(ROLES.EDUCATOR);
      break;
    case "support_worker":
      roles.push(ROLES.SUPPORT_WORKER);
      break;
    case "family_member":
      roles.push(ROLES.FAMILY_MEMBER);
      break;
    case "learner":
    default:
      roles.push(ROLES.LEARNER);
      break;
  }

  // Extract first and last name from display name
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    uid,
    email,
    displayName,
    photoURL: "",
    emailVerified: false,
    roles,
    permissions,
    userType,
    mfaEnabled: false,
    createdAt: new Date(),
    lastLogin: new Date(),
    profile: {
      firstName,
      lastName,
      bio: "",
      pronouns: "",
    },
    settings: {
      language: "en",
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        reduceMotion: false,
      },
      privacy: {
        shareProgressWithEducators: true,
        shareActivityWithGuardians: userType === "learner",
        allowCommunityFeatures: true,
      },
    },
    stats: {
      totalLoginCount: 1,
      totalLessonsCompleted: 0,
      totalPoints: 0,
      streakDays: 0,
    },
  };
}

/**
 * Validate user profile data
 * @param {UserProfile} profile - Profile data to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateUserProfile(profile) {
  const errors = [];

  if (!profile.firstName) {
    errors.push("First name is required");
  }

  if (!profile.lastName) {
    errors.push("Last name is required");
  }

  if (profile.bio && profile.bio.length > 500) {
    errors.push("Bio must be 500 characters or less");
  }

  if (profile.phoneNumber && !/^\+?[0-9]{10,15}$/.test(profile.phoneNumber)) {
    errors.push("Phone number format is invalid");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate accessibility preferences
 * @param {AccessibilityPreferences} preferences - Accessibility preferences to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateAccessibilityPreferences(preferences) {
  const errors = [];

  if (
    preferences.textToSpeechRate &&
    (preferences.textToSpeechRate < 0.5 || preferences.textToSpeechRate > 2)
  ) {
    errors.push("Text-to-speech rate must be between 0.5 and 2");
  }

  if (
    preferences.colorScheme &&
    !["default", "light", "dark", "high-contrast"].includes(preferences.colorScheme)
  ) {
    errors.push("Invalid color scheme");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get display name for a user type
 * @param {string} userType - User type identifier
 * @returns {string} User-friendly display name
 */
export function getUserTypeDisplayName(userType) {
  switch (userType) {
    case "admin":
      return "Administrator";
    case "educator":
      return "Educator";
    case "support_worker":
      return "Support Worker";
    case "family_member":
      return "Family Member";
    case "learner":
      return "Learner";
    default:
      return "User";
  }
}

/**
 * Format user name for display
 * @param {UserProfile} profile - User profile
 * @returns {string} Formatted name
 */
export function formatUserName(profile) {
  if (!profile) return "";

  if (profile.firstName && profile.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  } else if (profile.firstName) {
    return profile.firstName;
  } else if (profile.lastName) {
    return profile.lastName;
  }

  return "";
}

/**
 * Get initials from user name
 * @param {string} displayName - User's display name
 * @returns {string} User's initials (up to 2 characters)
 */
export function getUserInitials(displayName) {
  if (!displayName) return "";

  const parts = displayName.split(" ").filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
