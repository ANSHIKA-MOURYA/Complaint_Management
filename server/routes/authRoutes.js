/**
 * Authentication Routes
 */

import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateUserLogin, validateUserRegistration } from '../middleware/validation.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateUserLogin, loginUser);

// POST /api/auth/register
router.post('/register', validateUserRegistration, registerUser);

// GET /api/auth/profile
router.get('/profile', requireAuth, getUserProfile);

// PUT /api/auth/profile
router.put('/profile', requireAuth, updateUserProfile);

export default router;
