/**
 * Admin Routes
 */

import express from 'express';
import { 
  loginAdmin, 
  getAdminProfile, 
  getDepartments, 
  getDepartmentById, 
  getAdminsByDepartment 
} from '../controllers/adminController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { validateAdminLogin, validateIdParameter } from '../middleware/validation.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', validateAdminLogin, loginAdmin);

// GET /api/admin/profile
router.get('/profile', requireAdminAuth, getAdminProfile);

// GET /api/admin/departments
router.get('/departments', getDepartments);

// GET /api/admin/departments/:id
router.get('/departments/:id', validateIdParameter, getDepartmentById);

// GET /api/admin/departments/:department/admins
router.get('/departments/:department/admins', getAdminsByDepartment);

export default router;
