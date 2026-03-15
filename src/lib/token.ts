/**
 * Token Management Utilities
 * Handles localStorage operations for authentication tokens
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const tokenStorage = {
  /**
   * Get the stored authentication token
   */
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Save the authentication token
   */
  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  /**
   * Clear the authentication token
   */
  clearToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return !!tokenStorage.getToken();
  },

  /**
   * Get the stored user data
   */
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save user data
   */
  setUser: (user: unknown): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  },

  /**
   * Clear user data
   */
  clearUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  },

  /**
   * Clear all auth data
   */
  clearAll: (): void => {
    tokenStorage.clearToken();
    tokenStorage.clearUser();
  },
};
