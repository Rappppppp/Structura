/**
 * Axios HTTP Client with JWT Token Support
 * Handles JWT token storage and Authorization header management
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const JWT_TOKEN_KEY = 'jwt_token';

/**
 * Create an Axios instance with JWT token-based auth
 * JWT tokens are stored in localStorage and sent via Authorization header
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  /**
   * Request interceptor: Add JWT token to Authorization header
   */
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response interceptor: Handle authentication and authorization errors
   */
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        // Clear stored token
        localStorage.removeItem(JWT_TOKEN_KEY);
        
        // Dispatch logout event that AuthContext listens to
        const event = new CustomEvent('auth:logout', {
          detail: { reason: 'token_expired' },
        });
        window.dispatchEvent(event);
      }

      // Handle 403 Forbidden - insufficient permissions
      if (error.response?.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Store JWT token in localStorage
 * Call this after successful login
 */
export const setToken = (token: string): void => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
};

/**
 * Retrieve stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

/**
 * Clear JWT token from localStorage
 * Call this on logout
 */
export const clearToken = (): void => {
  localStorage.removeItem(JWT_TOKEN_KEY);
};

/**
 * Generic API request function with error handling
 */
export const apiRequest = {
  get: <T = any>(url: string, config = {}) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
