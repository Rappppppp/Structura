/**
 * Authentication Guard Utilities
 * Provides utilities for checking authentication status and protecting routes
 */

import { tokenStorage } from './token';

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return tokenStorage.hasToken();
};

/**
 * Get the current authentication token
 */
export const getAuthToken = (): string | null => {
  return tokenStorage.getToken();
};

/**
 * Get the stored user information
 */
export const getStoredUser = () => {
  return tokenStorage.getUser();
};

/**
 * Clear authentication (logout)
 */
export const clearAuth = (): void => {
  tokenStorage.clearAll();
};

/**
 * Check if a token is likely expired (basic client-side check)
 * This is a simple implementation - ideally validate on server
 */
export const isTokenExpired = (): boolean => {
  const token = tokenStorage.getToken();
  if (!token) return true;

  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration and if it's expired
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    }

    return false;
  } catch {
    // If we can't decode the token, consider it invalid
    return true;
  }
};

/**
 * Get the time until token expiration in milliseconds
 * Returns null if token has no expiration or is invalid
 */
export const getTimeUntilExpiration = (): number | null => {
  const token = tokenStorage.getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp) {
      const expirationTime = payload.exp * 1000;
      const timeUntilExpiration = expirationTime - Date.now();
      return Math.max(0, timeUntilExpiration);
    }

    return null;
  } catch {
    return null;
  }
};
