/**
 * User Profile Database Schema
 *
 * This file defines the database schema for user profiles in Firestore.
 * It's used to ensure consistent data structure and for reference during development.
 */

// User Collection Schema (/users/{userId})
const userSchema = {
  // Basic User Information
  uid: "string", // User ID from Firebase Auth
  email: "string", // User's email address
  displayName: "string", // User's display name
  photoURL: "string", // URL to user's profile photo
  userType: "string", // "learner", "educator", "support_worker", "family_member"

  // Authentication & Security
  createdAt: "timestamp", // When the account was created
  lastLogin: "timestamp", // Last time the user logged in
  emailVerified: "boolean", // Whether the user's email is verified
  mfaEnabled: "boolean", // Whether multi-factor authentication is enabled
  mfaEnrolledAt: "timestamp", // When MFA was enabled

  // Role-Based Access Control
  roles: ["string"], // Array of roles (e.g. "user", "educator", "admin")
  permissions: ["string"], // Array of permission strings (e.g. "read:lessons", "write:curriculum")

  // User Profile Details
  profile: {
    firstName: "string",
    lastName: "string",
    dateOfBirth: "timestamp",
    gender: "string",
    location: "string",
    bio: "string",
    phone: "string",
    address: {
      street: "string",
      city: "string",
      state: "string",
      postalCode: "string",
      country: "string",
    },
  },

  // Learning Preferences
  learningPreferences: {
    learningStyle: "string", // "visual", "auditory", "reading", "kinesthetic"
    contentLevel: "string", // "beginner", "intermediate", "advanced"
    interactivityPreference: "string", // "high", "medium", "low"
    pacePreference: "string", // "slow", "moderate", "fast"
    themePrefernce: "string", // "light", "dark", "system"
    notificationPreferences: {
      email: "boolean",
      push: "boolean",
      sms: "boolean",
    },
  },

  // For Educators & Support Workers
  professionalProfile: {
    title: "string",
    organization: "string",
    qualifications: ["string"],
    certifications: ["string"],
    specializations: ["string"],
    yearsOfExperience: "number",
    bio: "string",
    availableHours: {
      monday: { start: "string", end: "string" },
      tuesday: { start: "string", end: "string" },
      wednesday: { start: "string", end: "string" },
      thursday: { start: "string", end: "string" },
      friday: { start: "string", end: "string" },
    },
  },

  // For Family Members & Guardians
  familyConnections: [
    {
      learnerUid: "string", // UID of connected learner
      relationship: "string", // e.g. "parent", "guardian", "sibling"
      accessLevel: "string", // "view", "participate", "manage"
      approved: "boolean", // Whether this connection is approved
      approvedAt: "timestamp", // When the connection was approved
    },
  ],

  // Activity & Progress Tracking
  stats: {
    totalLoginCount: "number",
    totalLessonsCompleted: "number",
    totalPoints: "number",
    lastActive: "timestamp",
    streakDays: "number",
    averageSessionTime: "number", // in minutes
  },

  // Settings & Preferences
  settings: {
    language: "string", // Preferred language
    accessibility: {
      highContrast: "boolean",
      largeText: "boolean",
      screenReader: "boolean",
      reduceMotion: "boolean",
      colorBlindMode: "string", // "none", "protanopia", "deuteranopia", "tritanopia"
    },
    privacy: {
      shareProgressWithEducators: "boolean",
      shareActivityWithGuardians: "boolean",
      allowCommunityFeatures: "boolean",
    },
  },
};

// Roles Collection Schema (/roles/{roleId})
const roleSchema = {
  name: "string", // Role name (e.g. "admin", "educator")
  description: "string", // Description of the role
  permissions: ["string"], // Array of permissions granted by this role
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

// Permissions Collection Schema (/permissions/{permissionId})
const permissionSchema = {
  name: "string", // Permission name (e.g. "read:lessons")
  description: "string", // Description of what this permission allows
  resource: "string", // The resource this permission applies to
  action: "string", // The action this permission allows (read, write, delete, etc.)
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

export { userSchema, roleSchema, permissionSchema };
