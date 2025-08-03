/**
 * Validation Middleware
 */

import { validateEmail, validatePassword, createResponse } from '../../shared/api.js';

// User registration validation
export const validateUserRegistration = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check required fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json(createResponse(false, null, null, "All fields are required"));
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json(createResponse(false, null, null, "Invalid email format"));
  }

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json(createResponse(false, null, null, "Password must be at least 6 characters long"));
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    return res.status(400).json(createResponse(false, null, null, "Passwords do not match"));
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();

  next();
};

// User login validation
export const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json(createResponse(false, null, null, "Email and password are required"));
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json(createResponse(false, null, null, "Invalid email format"));
  }

  // Sanitize inputs
  req.body.email = email.toLowerCase().trim();

  next();
};

// Admin login validation
export const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json(createResponse(false, null, null, "Email and password are required"));
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json(createResponse(false, null, null, "Invalid email format"));
  }

  // Sanitize inputs
  req.body.email = email.toLowerCase().trim();

  next();
};

// Complaint creation validation
export const validateComplaintCreation = (req, res, next) => {
  const { text, category, department, departmentEmail } = req.body;

  // Check required fields
  if (!text || !category || !department || !departmentEmail) {
    return res.status(400).json(createResponse(false, null, null, "All fields are required"));
  }

  // Validate text length
  if (text.trim().length < 10) {
    return res.status(400).json(createResponse(false, null, null, "Complaint description must be at least 10 characters long"));
  }

  // Validate department email
  if (!validateEmail(departmentEmail)) {
    return res.status(400).json(createResponse(false, null, null, "Invalid department email format"));
  }

  // Sanitize inputs
  req.body.text = text.trim();
  req.body.category = category.trim();
  req.body.department = department.trim();
  req.body.departmentEmail = departmentEmail.toLowerCase().trim();

  next();
};

// Complaint update validation
export const validateComplaintUpdate = (req, res, next) => {
  const { status } = req.body;

  // Check required fields
  if (!status) {
    return res.status(400).json(createResponse(false, null, null, "Status is required"));
  }

  // Validate status value
  const validStatuses = ['Pending', 'In Progress', 'Resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json(createResponse(false, null, null, "Invalid status value"));
  }

  next();
};

// Query parameter validation for complaints
export const validateComplaintQuery = (req, res, next) => {
  const { limit, offset } = req.query;

  // Validate limit
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json(createResponse(false, null, null, "Limit must be a number between 1 and 100"));
  }

  // Validate offset
  if (offset && (isNaN(offset) || parseInt(offset) < 0)) {
    return res.status(400).json(createResponse(false, null, null, "Offset must be a non-negative number"));
  }

  next();
};

// General parameter validation
export const validateIdParameter = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return res.status(400).json(createResponse(false, null, null, "Valid ID is required"));
  }

  next();
};

// File upload validation
export const validateFileUpload = (req, res, next) => {
  // In production, add actual file validation
  // Check file type, size, etc.
  next();
};
