/**
 * Complaint Controller
 */

import { ComplaintModel } from '../models/Complaint.js';
import { UserModel } from '../models/User.js';
import { AdminModel } from '../models/Admin.js';
import { sendComplaintSuccess, sendNotFound, sendForbidden, sendStatsSuccess, sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all complaints with filtering
export const getComplaints = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const adminId = req.adminId;
  const { department, status, sentiment, search, limit, offset } = req.query;

  const filters = {
    limit,
    offset,
    status,
    sentiment,
    search
  };

  // Filter by user for regular users
  if (userId && !adminId) {
    filters.userId = userId;
  }

  // Filter by department for admin users
  if (adminId && department) {
    filters.department = department;
  } else if (adminId) {
    // Get admin's department
    const admin = await AdminModel.findById(adminId);
    if (admin) {
      filters.department = admin.department;
    }
  }

  const complaints = await ComplaintModel.findAll(filters);
  
  return sendComplaintSuccess(res, null, complaints, `Found ${complaints.length} complaints`);
});

// Get specific complaint by ID
export const getComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const adminId = req.adminId;

  const complaint = await ComplaintModel.findById(id);
  
  if (!complaint) {
    return sendNotFound(res, "Complaint not found");
  }

  // Check access permissions
  if (userId && complaint.userId !== userId) {
    return sendForbidden(res, "Access denied");
  }

  // Admin can only see complaints from their department
  if (adminId) {
    const admin = await AdminModel.findById(adminId);
    if (admin && complaint.department !== admin.department) {
      return sendForbidden(res, "Access denied");
    }
  }

  return sendComplaintSuccess(res, complaint, null, null);
});

// Create new complaint
export const createComplaint = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { text, category, department, departmentEmail, image } = req.body;

  // Get user info for submittedBy field
  const user = await UserModel.findById(userId);
  const submittedBy = user ? user.name : `User ${userId}`;

  const complaintData = {
    text,
    category,
    department,
    departmentEmail,
    userId,
    submittedBy,
    ...(image && { image })
  };

  const complaint = await ComplaintModel.create(complaintData);

  return sendComplaintSuccess(res, complaint, null, "Complaint submitted successfully");
});

// Update complaint status (admin only)
export const updateComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.adminId;
  const { status } = req.body;

  const complaint = await ComplaintModel.findById(id);
  
  if (!complaint) {
    return sendNotFound(res, "Complaint not found");
  }

  // Check if admin can update this complaint (same department)
  const admin = await AdminModel.findById(adminId);
  if (!admin || complaint.department !== admin.department) {
    return sendForbidden(res, "You can only update complaints from your department");
  }

  const updatedComplaint = await ComplaintModel.updateById(id, { status });

  return sendComplaintSuccess(res, updatedComplaint, null, "Complaint status updated successfully");
});

// Delete complaint
export const deleteComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const adminId = req.adminId;

  const complaint = await ComplaintModel.findById(id);
  
  if (!complaint) {
    return sendNotFound(res, "Complaint not found");
  }

  // Check permissions
  if (userId && complaint.userId !== userId) {
    return sendForbidden(res, "You can only delete your own complaints");
  }

  if (adminId) {
    const admin = await AdminModel.findById(adminId);
    if (!admin || complaint.department !== admin.department) {
      return sendForbidden(res, "You can only delete complaints from your department");
    }
  }

  await ComplaintModel.deleteById(id);

  return sendSuccess(res, null, "Complaint deleted successfully");
});

// Get complaint statistics
export const getComplaintStats = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const adminId = req.adminId;
  const { department } = req.query;

  const filters = {};

  // Filter by user for regular users
  if (userId && !adminId) {
    filters.userId = userId;
  }

  // Filter by department for admin users
  if (adminId && department) {
    filters.department = department;
  } else if (adminId) {
    // Get admin's department
    const admin = await AdminModel.findById(adminId);
    if (admin) {
      filters.department = admin.department;
    }
  }

  const stats = await ComplaintModel.getStats(filters);

  return sendStatsSuccess(res, stats, null);
});

// Get user's complaints
export const getUserComplaints = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { status, sentiment, search, limit, offset } = req.query;

  const filters = {
    userId,
    status,
    sentiment,
    search,
    limit,
    offset
  };

  const complaints = await ComplaintModel.findAll(filters);

  return sendComplaintSuccess(res, null, complaints, `Found ${complaints.length} of your complaints`);
});

// Get department complaints (admin only)
export const getDepartmentComplaints = asyncHandler(async (req, res) => {
  const adminId = req.adminId;
  const { status, sentiment, search, limit, offset } = req.query;

  // Get admin's department
  const admin = await AdminModel.findById(adminId);
  if (!admin) {
    return sendNotFound(res, "Admin not found");
  }

  const filters = {
    department: admin.department,
    status,
    sentiment,
    search,
    limit,
    offset
  };

  const complaints = await ComplaintModel.findAll(filters);

  return sendComplaintSuccess(res, null, complaints, `Found ${complaints.length} complaints for ${admin.department}`);
});
