import api from './api';

/**
 * Sign in with email and password
 */
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Rotate refresh session and obtain a new access token
 */
export const refreshApi = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

/**
 * Revoke session and clear HTTP-only refresh cookie
 */
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Get current authenticated user profile and workspace
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
