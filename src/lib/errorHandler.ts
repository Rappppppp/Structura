/**
 * API Error Handler
 * Centralizes error handling and parsing for API responses
 */

import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  originalError: AxiosError;
}

/**
 * Parse Axios error into a structured format
 * Handles Laravel validation errors and standard HTTP errors
 */
export const parseApiError = (error: unknown): ApiError => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      status: 500,
      originalError: error as AxiosError,
    };
  }

  const axiosError = error as AxiosError<any>;

  // Handle Laravel validation errors (422)
  if (axiosError.response?.status === 422) {
    const errors = axiosError.response.data?.errors || {};
    const firstError = Object.values(errors)[0];
    const message =
      Array.isArray(firstError) && firstError.length > 0
        ? firstError[0]
        : 'Validation failed';

    return {
      message,
      status: 422,
      errors,
      originalError: axiosError,
    };
  }

  // Handle unauthorized errors
  if (axiosError.response?.status === 401) {
    return {
      message: 'Your session has expired. Please log in again.',
      status: 401,
      originalError: axiosError,
    };
  }

  // Handle forbidden errors
  if (axiosError.response?.status === 403) {
    return {
      message: 'You do not have permission to perform this action.',
      status: 403,
      originalError: axiosError,
    };
  }

  // Handle not found errors
  if (axiosError.response?.status === 404) {
    return {
      message: 'The requested resource was not found.',
      status: 404,
      originalError: axiosError,
    };
  }

  // Handle server errors
  if (axiosError.response?.status && axiosError.response.status >= 500) {
    return {
      message: 'An error occurred on the server. Please try again later.',
      status: axiosError.response.status,
      originalError: axiosError,
    };
  }

  // Handle network errors
  if (!axiosError.response) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      originalError: axiosError,
    };
  }

  // Generic error
  const message =
    axiosError.response?.data?.message ||
    axiosError.response?.statusText ||
    'An error occurred';

  return {
    message,
    status: axiosError.response?.status || 500,
    originalError: axiosError,
  };
};

/**
 * Log structured error for debugging
 */
export const logApiError = (error: ApiError, context?: string) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    status: error.status,
    message: error.message,
    errors: error.errors,
  };

  console.error('[API Error]', logEntry);

  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
};

/**
 * Get user-friendly error message
 */
export const getUserErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const apiError = parseApiError(error);
  return apiError.message;
};
