/**
 * Complaint Routes
 */

import express from 'express';
import { 
  getComplaints, 
  getComplaint, 
  createComplaint, 
  updateComplaint, 
  deleteComplaint,
  getComplaintStats,
  getUserComplaints,
  getDepartmentComplaints
} from '../controllers/complaintController.js';
import { requireAuth, requireAdminAuth, requireAnyAuth } from '../middleware/auth.js';
import { 
  validateComplaintCreation, 
  validateComplaintUpdate, 
  validateComplaintQuery,
  validateIdParameter 
} from '../middleware/validation.js';

const router = express.Router();

// GET /api/complaints - Get all complaints (filtered by user/admin)
router.get('/', requireAnyAuth, validateComplaintQuery, getComplaints);

// GET /api/complaints/stats - Get complaint statistics
router.get('/stats', requireAnyAuth, getComplaintStats);

// GET /api/complaints/my - Get user's complaints
router.get('/my', requireAuth, validateComplaintQuery, getUserComplaints);

// GET /api/complaints/department - Get department complaints (admin only)
router.get('/department', requireAdminAuth, validateComplaintQuery, getDepartmentComplaints);

// GET /api/complaints/:id - Get specific complaint
router.get('/:id', requireAnyAuth, validateIdParameter, getComplaint);

// POST /api/complaints - Create new complaint (user only)
router.post('/', requireAuth, validateComplaintCreation, createComplaint);

// PUT /api/complaints/:id - Update complaint status (admin only)
router.put('/:id', requireAdminAuth, validateIdParameter, validateComplaintUpdate, updateComplaint);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', requireAnyAuth, validateIdParameter, deleteComplaint);

export default router;
