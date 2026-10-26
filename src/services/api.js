import axios from 'axios';

// In-memory access token storage (protects against XSS token harvesting)
let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};

// Create a centralized Axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HTTP-only cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request interceptor: attach Bearer access token if available
api.interceptors.request.use(
  (reqConfig) => {
    if (inMemoryAccessToken && !reqConfig.headers.Authorization) {
      reqConfig.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// 2. Response interceptor: handle 401 and attempt automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh loop on auth endpoints themselves
    const isAuthRoute =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Attempt to obtain a fresh access token using the HTTP-only refresh cookie
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is expired or revoked
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default api;
