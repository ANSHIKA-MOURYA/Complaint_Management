/**
 * Upload Routes
 */

import express from 'express';
import { uploadFile, getUploadConfig, deleteFile } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateFileUpload, validateIdParameter } from '../middleware/validation.js';

const router = express.Router();

// GET /api/upload/config - Get upload configuration
router.get('/config', getUploadConfig);

// POST /api/upload - Upload file
router.post('/', requireAuth, validateFileUpload, uploadFile);

// DELETE /api/upload/:filename - Delete file
router.delete('/:filename', requireAuth, validateIdParameter, deleteFile);

export default router;
