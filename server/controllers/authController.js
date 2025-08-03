/**
 * Authentication Controller
 */

import { UserModel } from '../models/User.js';
import { generateUserToken } from '../utils/token.js';
import { sendAuthSuccess, sendBadRequest, sendUnauthorized, sendConflict, sendNotFound } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// User login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate credentials
  const user = await UserModel.validateCredentials(email, password);
  
  if (!user) {
    return sendUnauthorized(res, "Invalid email or password");
  }

  // Generate token
  const token = generateUserToken(user.id);

  return sendAuthSuccess(res, user, null, token, "Login successful");
});

// User registration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  if (await UserModel.emailExists(email)) {
    return sendConflict(res, "User with this email already exists");
  }

  // Create new user
  const user = await UserModel.create({ name, email, password });

  // Generate token
  const token = generateUserToken(user.id);

  return sendAuthSuccess(res, user, null, token, "Registration successful");
});

// Get current user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  
  if (!user) {
    return sendNotFound(res, "User not found");
  }

  return sendAuthSuccess(res, user, null, null, null);
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  // Validate email if provided
  if (email && email !== (await UserModel.findById(userId))?.email) {
    if (await UserModel.emailExists(email)) {
      return sendConflict(res, "Email already in use");
    }
  }

  const updates = {};
  if (name) updates.name = name.trim();
  if (email) updates.email = email.toLowerCase().trim();

  const user = await UserModel.updateById(userId, updates);
  
  if (!user) {
    return sendNotFound(res, "User not found");
  }

  return sendAuthSuccess(res, user, null, null, "Profile updated successfully");
});
