/**
 * Token utilities
 */

// Simple token generation (in production, use JWT)
export const generateUserToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

export const generateAdminToken = (adminId) => {
  return `admin_token_${adminId}_${Date.now()}`;
};

// Token parsing (in production, use JWT verification)
export const parseUserToken = (token) => {
  if (!token.startsWith('token_')) return null;
  const parts = token.split('_');
  return parts[1] || null;
};

export const parseAdminToken = (token) => {
  if (!token.startsWith('admin_token_')) return null;
  const parts = token.split('_');
  return parts[2] || null;
};

// Token validation (simplified)
export const isValidToken = (token) => {
  if (!token) return false;
  
  const parts = token.split('_');
  
  // User token format: token_userId_timestamp
  if (token.startsWith('token_') && parts.length === 3) {
    return true;
  }
  
  // Admin token format: admin_token_adminId_timestamp
  if (token.startsWith('admin_token_') && parts.length === 4) {
    return true;
  }
  
  return false;
};

// Extract token from authorization header
export const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
