/**
 * Error Handling Middleware
 */

import { createResponse } from '../../shared/api.js';

// General error handler
export const errorHandler = (err, req, res, next) => {
  console.error("Server error:", err);

  // Default error
  let status = 500;
  let message = "Internal server error";

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = "Unauthorized";
  } else if (err.name === 'ForbiddenError') {
    status = 403;
    message = "Forbidden";
  } else if (err.name === 'NotFoundError') {
    status = 404;
    message = "Not found";
  }

  res.status(status).json(createResponse(
    false,
    null,
    null,
    process.env.NODE_ENV === 'development' ? err.message : message
  ));
};

// 404 handler for API routes
export const notFoundHandler = (req, res) => {
  res.status(404).json(createResponse(
    false,
    null,
    null,
    `API endpoint not found: ${req.originalUrl}`
  ));
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error classes
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
