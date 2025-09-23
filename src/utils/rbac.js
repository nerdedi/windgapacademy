/**
 * Role-Based Access Control (RBAC) utilities
 *
 * This file provides utility functions for handling role and permission-based access control.
 */

/**
 * Check if a user has a specific role
 *
 * @param {Object} user - The user object with roles property
 * @param {string|string[]} role - Role(s) to check
 * @param {boolean} requireAll - If true, user must have all roles, otherwise any matching role is sufficient
 * @returns {boolean} Whether the user has the required role(s)
 */
export function hasRole(user, role, requireAll = false) {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  if (Array.isArray(role)) {
    if (requireAll) {
      return role.every((r) => user.roles.includes(r));
    }
    return role.some((r) => user.roles.includes(r));
  }

  return user.roles.includes(role);
}

/**
 * Check if a user has a specific permission
 *
 * @param {Object} user - The user object with permissions property
 * @param {string|string[]} permission - Permission(s) to check
 * @param {boolean} requireAll - If true, user must have all permissions, otherwise any matching permission is sufficient
 * @returns {boolean} Whether the user has the required permission(s)
 */
export function hasPermission(user, permission, requireAll = false) {
  if (!user || !user.permissions || user.permissions.length === 0) {
    return false;
  }

  if (Array.isArray(permission)) {
    if (requireAll) {
      return permission.every((p) => user.permissions.includes(p));
    }
    return permission.some((p) => user.permissions.includes(p));
  }

  return user.permissions.includes(permission);
}

/**
 * Get a list of permissions for a given resource and action
 *
 * @param {string} resource - The resource (e.g., 'lessons', 'users')
 * @param {string} action - The action (e.g., 'read', 'write', 'delete')
 * @returns {string} The permission string
 */
export function getPermission(resource, action) {
  return `${action}:${resource}`;
}

/**
 * Standard permissions structure
 */
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
};

/**
 * Standard resources
 */
export const RESOURCES = {
  USERS: "users",
  LESSONS: "lessons",
  CURRICULUM: "curriculum",
  ASSESSMENTS: "assessments",
  PROGRESS: "progress",
  REPORTS: "reports",
  SETTINGS: "settings",
  OWN_PROFILE: "own_profile",
};

/**
 * Common roles with associated permissions
 */
export const ROLES = {
  ADMIN: "admin",
  EDUCATOR: "educator",
  SUPPORT_WORKER: "support_worker",
  LEARNER: "learner",
  FAMILY_MEMBER: "family_member",
  GUEST: "guest",
};

/**
 * Default permissions for different roles
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    getPermission(RESOURCES.USERS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.LESSONS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.CURRICULUM, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.ASSESSMENTS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.PROGRESS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.REPORTS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.SETTINGS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.MANAGE),
  ],
  [ROLES.EDUCATOR]: [
    getPermission(RESOURCES.LESSONS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.CURRICULUM, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.ASSESSMENTS, PERMISSIONS.MANAGE),
    getPermission(RESOURCES.PROGRESS, PERMISSIONS.READ),
    getPermission(RESOURCES.REPORTS, PERMISSIONS.READ),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.MANAGE),
  ],
  [ROLES.SUPPORT_WORKER]: [
    getPermission(RESOURCES.LESSONS, PERMISSIONS.READ),
    getPermission(RESOURCES.CURRICULUM, PERMISSIONS.READ),
    getPermission(RESOURCES.ASSESSMENTS, PERMISSIONS.READ),
    getPermission(RESOURCES.PROGRESS, PERMISSIONS.READ),
    getPermission(RESOURCES.REPORTS, PERMISSIONS.READ),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.MANAGE),
  ],
  [ROLES.LEARNER]: [
    getPermission(RESOURCES.LESSONS, PERMISSIONS.READ),
    getPermission(RESOURCES.ASSESSMENTS, PERMISSIONS.READ),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.MANAGE),
  ],
  [ROLES.FAMILY_MEMBER]: [
    getPermission(RESOURCES.PROGRESS, PERMISSIONS.READ),
    getPermission(RESOURCES.REPORTS, PERMISSIONS.READ),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.MANAGE),
  ],
  [ROLES.GUEST]: [
    getPermission(RESOURCES.LESSONS, PERMISSIONS.READ),
    getPermission(RESOURCES.OWN_PROFILE, PERMISSIONS.READ),
  ],
};
