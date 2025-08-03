/**
 * Upload Controller
 */

import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Handle file upload
export const uploadFile = asyncHandler(async (req, res) => {
  // In production, you would:
  // 1. Use multer middleware to handle file uploads
  // 2. Validate file type and size
  // 3. Upload to cloud storage (AWS S3, Google Cloud, etc.)
  // 4. Return the public URL

  // For demo purposes, simulate successful upload
  const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop&crop=center`;
  const filename = `complaint_image_${Date.now()}.jpg`;

  const uploadResult = {
    url: mockImageUrl,
    filename,
    uploadedAt: new Date().toISOString()
  };

  return sendSuccess(res, uploadResult, "File uploaded successfully");
});

// Get upload configuration
export const getUploadConfig = asyncHandler(async (req, res) => {
  const config = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    uploadEndpoint: '/api/upload'
  };

  return sendSuccess(res, config, "Upload configuration retrieved");
});

// Delete uploaded file
export const deleteFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // In production, delete from cloud storage
  // For demo, just return success
  
  return sendSuccess(res, null, `File ${filename} deleted successfully`);
});
