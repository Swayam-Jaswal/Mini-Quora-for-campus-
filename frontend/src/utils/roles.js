// src/utils/roles.js

export const ROLE_ORDER = { user: 0, moderator: 1, admin: 2, superadmin: 3 };

export const isAtLeast = (role, requiredRole) => {
  return ROLE_ORDER[role] >= ROLE_ORDER[requiredRole];
};
