/**
 * Authentication Middleware
 */

import { createResponse } from '../../shared/api.js';

// Helper function to extract user ID from token
const getUserIdFromToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  // Simple token parsing (in production, use proper JWT verification)
  return token.split('_')[1] || null;
};

// Helper function to extract admin ID from token
const getAdminIdFromToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  // Simple token parsing for admin tokens
  if (token.startsWith('admin_token_')) {
    return token.split('_')[2] || null;
  }
  return null;
};

// Middleware to require user authentication
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = getUserIdFromToken(authHeader);
    
    if (!userId) {
      return res.status(401).json(createResponse(false, null, null, "Authorization required"));
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json(createResponse(false, null, null, "Internal server error"));
  }
};

// Middleware to require admin authentication
export const requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const adminId = getAdminIdFromToken(authHeader);
    
    if (!adminId) {
      return res.status(401).json(createResponse(false, null, null, "Admin authorization required"));
    }

    req.adminId = adminId;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(500).json(createResponse(false, null, null, "Internal server error"));
  }
};

// Middleware to allow both user and admin authentication
export const requireAnyAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = getUserIdFromToken(authHeader);
    const adminId = getAdminIdFromToken(authHeader);
    
    if (!userId && !adminId) {
      return res.status(401).json(createResponse(false, null, null, "Authorization required"));
    }

    req.userId = userId;
    req.adminId = adminId;
    next();
  } catch (error) {
    console.error("Any auth middleware error:", error);
    return res.status(500).json(createResponse(false, null, null, "Internal server error"));
  }
};

// Middleware to extract auth info without requiring it (optional auth)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = getUserIdFromToken(authHeader);
    const adminId = getAdminIdFromToken(authHeader);
    
    req.userId = userId;
    req.adminId = adminId;
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue even if there's an error
  }
};

// Helper functions to be used in controllers
export const getUserId = (req) => req.userId;
export const getAdminId = (req) => req.adminId;
export const isAuthenticated = (req) => !!(req.userId || req.adminId);
export const isAdmin = (req) => !!req.adminId;
export const isUser = (req) => !!req.userId;
