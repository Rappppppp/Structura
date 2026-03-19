import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const JWT_TOKEN_KEY = 'jwt_token';
const AUTH_USER_KEY = 'auth_user';

/**
 * Get initial auth state from localStorage
 * Restores user session on page reload if token exists
 */
const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    
    if (token && userJson) {
      const user = JSON.parse(userJson);
      return {
        user,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to restore auth state:', error);
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialAuthState();

export const useAuthStore = create<AuthStore>((set) => ({
  user: initialState.user,
  isAuthenticated: initialState.isAuthenticated,
  isLoading: false,
  error: null,

  setUser: (user) => {
    // Persist user to localStorage
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to persist user:', error);
    }
    
    set({
      user,
      isAuthenticated: true,
      error: null,
    });
  },

  setAuthenticated: (authenticated) => {
    set({ isAuthenticated: authenticated });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  logout: () => {
    // Clear localStorage
    try {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
    
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    const state = getInitialAuthState();
    set({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    });
  },
}));

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.user?.role;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
