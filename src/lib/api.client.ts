/**
 * Axios HTTP Client with JWT Token Support
 * Handles JWT token storage and Authorization header management
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import { tokenStorage } from './token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
      const token = tokenStorage.getToken();
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log all requests for debugging
      console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data ? (typeof config.data === 'string' ? `${config.data.substring(0, 100)}...` : config.data) : null,
      });

      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor: Handle authentication and authorization errors
   */
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
      });
      return response;
    },
    (error: AxiosError) => {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        // Clear stored token
        tokenStorage.clearToken();
        
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
  tokenStorage.setToken(token);
};

/**
 * Retrieve stored JWT token
 */
export const getToken = (): string | null => {
  return tokenStorage.getToken();
};

/**
 * Clear JWT token from localStorage
 * Call this on logout
 */
export const clearToken = (): void => {
  tokenStorage.clearToken();
};

/**
 * Generic API request function with error handling
 */
export const apiRequest = {
  get: <T = unknown>(url: string, config = {}) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config = {}) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config = {}) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config = {}) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
