/**
 * Shared API types and utilities between client and server
 */

// Department configuration
export const DEPARTMENTS = [
  { id: 'water', name: 'Water Management', email: 'admin@water.gov' },
  { id: 'roads', name: 'Road & Safety', email: 'admin@roads.gov' },
  { id: 'health', name: 'Public Health', email: 'admin@health.gov' },
  { id: 'electricity', name: 'Electricity Board', email: 'admin@power.gov' },
  { id: 'sanitation', name: 'Sanitation', email: 'admin@sanitation.gov' },
  { id: 'general', name: 'General Administration', email: 'admin@general.gov' }
];

// Admin users configuration
export const ADMIN_USERS = [
  {
    id: 'water',
    name: 'Water Department Admin',
    email: 'admin@water.gov',
    password: 'water123',
    department: 'Water Management',
    departmentId: 'water'
  },
  {
    id: 'roads',
    name: 'Road & Safety Admin',
    email: 'admin@roads.gov',
    password: 'roads123',
    department: 'Road & Safety',
    departmentId: 'roads'
  },
  {
    id: 'health',
    name: 'Health Department Admin',
    email: 'admin@health.gov',
    password: 'health123',
    department: 'Public Health',
    departmentId: 'health'
  },
  {
    id: 'electricity',
    name: 'Electricity Admin',
    email: 'admin@power.gov',
    password: 'power123',
    department: 'Electricity Board',
    departmentId: 'electricity'
  },
  {
    id: 'sanitation',
    name: 'Sanitation Admin',
    email: 'admin@sanitation.gov',
    password: 'clean123',
    department: 'Sanitation',
    departmentId: 'sanitation'
  },
  {
    id: 'general',
    name: 'General Admin',
    email: 'admin@general.gov',
    password: 'admin123',
    department: 'General Administration',
    departmentId: 'general'
  }
];

// Status and sentiment options
export const COMPLAINT_STATUS = ['Pending', 'In Progress', 'Resolved'];
export const COMPLAINT_SENTIMENT = ['High', 'Medium', 'Low'];

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Response utilities
export const createResponse = (success, data = null, message = null, error = null) => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  };
};

export const createAuthResponse = (success, user = null, admin = null, token = null, message = null, error = null) => {
  return {
    success,
    ...(user && { user }),
    ...(admin && { admin }),
    ...(token && { token }),
    ...(message && { message }),
    ...(error && { error })
  };
};

export const createComplaintResponse = (success, complaint = null, complaints = null, message = null, error = null) => {
  return {
    success,
    ...(complaint && { complaint }),
    ...(complaints && { complaints }),
    ...(message && { message }),
    ...(error && { error })
  };
};

// Demo response (legacy)
export const createDemoResponse = (message) => {
  return { message };
};
