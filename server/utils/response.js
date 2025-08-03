/**
 * Response utilities
 */

// Standard API response format
export const sendResponse = (res, status, success, data = null, message = null, error = null) => {
  const response = {
    success,
    ...(data !== null && { data }),
    ...(message && { message }),
    ...(error && { error })
  };
  
  return res.status(status).json(response);
};

// Success responses
export const sendSuccess = (res, data = null, message = null, status = 200) => {
  return sendResponse(res, status, true, data, message, null);
};

export const sendCreated = (res, data = null, message = null) => {
  return sendResponse(res, 201, true, data, message, null);
};

// Error responses
export const sendError = (res, error, status = 500) => {
  return sendResponse(res, status, false, null, null, error);
};

export const sendBadRequest = (res, error = "Bad request") => {
  return sendError(res, error, 400);
};

export const sendUnauthorized = (res, error = "Unauthorized") => {
  return sendError(res, error, 401);
};

export const sendForbidden = (res, error = "Forbidden") => {
  return sendError(res, error, 403);
};

export const sendNotFound = (res, error = "Not found") => {
  return sendError(res, error, 404);
};

export const sendConflict = (res, error = "Conflict") => {
  return sendError(res, error, 409);
};

// Auth responses
export const sendAuthSuccess = (res, user = null, admin = null, token = null, message = null) => {
  const data = {
    ...(user && { user }),
    ...(admin && { admin }),
    ...(token && { token })
  };
  return sendSuccess(res, data, message);
};

// Complaint responses
export const sendComplaintSuccess = (res, complaint = null, complaints = null, message = null) => {
  const data = {
    ...(complaint && { complaint }),
    ...(complaints && { complaints })
  };
  return sendSuccess(res, data, message);
};

// Stats responses
export const sendStatsSuccess = (res, stats, message = null) => {
  return sendSuccess(res, { stats }, message);
};
