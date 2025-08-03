/**
 * Admin Controller
 */

import { AdminModel } from '../models/Admin.js';
import { generateAdminToken } from '../utils/token.js';
import { sendAuthSuccess, sendUnauthorized, sendNotFound, sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate credentials
  const admin = await AdminModel.validateCredentials(email, password);
  
  if (!admin) {
    return sendUnauthorized(res, "Invalid credentials");
  }

  // Generate token
  const token = generateAdminToken(admin.id);

  return sendAuthSuccess(res, null, admin, token, "Admin login successful");
});

// Get current admin profile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const adminId = req.adminId;

  const admin = await AdminModel.findById(adminId);
  
  if (!admin) {
    return sendNotFound(res, "Admin not found");
  }

  return sendAuthSuccess(res, null, admin, null, null);
});

// Get all departments
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await AdminModel.getDepartments();
  return sendSuccess(res, { departments }, null);
});

// Get department by ID
export const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const admin = await AdminModel.findById(id);
  if (!admin) {
    return sendNotFound(res, "Department not found");
  }

  const department = {
    id: admin.departmentId,
    name: admin.department,
    email: admin.email,
    description: `${admin.department} - Government Department`
  };

  return sendSuccess(res, { department }, null);
});

// Get admins by department
export const getAdminsByDepartment = asyncHandler(async (req, res) => {
  const { department } = req.params;
  
  const admins = await AdminModel.findByDepartment(department);
  return sendSuccess(res, { admins }, null);
});
