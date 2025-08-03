/**
 * Demo Routes - Legacy support
 */

import express from 'express';
import { createDemoResponse } from '../../shared/api.js';

const router = express.Router();

// GET /api/demo - Legacy demo endpoint
router.get('/', (req, res) => {
  res.json(createDemoResponse("Hello from Express server - Complaint Management API v1.0"));
});

// GET /api/ping - Health check
router.get('/ping', (req, res) => {
  res.json({
    message: "Complaint Management API v1.0",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

export default router;
