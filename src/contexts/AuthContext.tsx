import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useLoginMutation, useLogoutMutation } from '@/hooks/mutations/useAuthMutations';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { setToken, clearToken } from '@/lib/api.client';
import type { UserRole } from '@/types';

export type { UserRole };

interface AuthContextType {
  user: { email: string; name: string; role: UserRole; avatar?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: userProfile, isLoading: isLoadingUser } = useCurrentUser();

  /**
   * Check if user is already authenticated on mount
   * (JWT token persists in localStorage)
   */
  useEffect(() => {
    authStore.initializeAuth();
  }, []);

  /**
   * Sync user profile from query to store when available
   */
  useEffect(() => {
    if (userProfile?.data?.user && !authStore.user) {
      // Only update if we don't already have a user (first load after token restore)
      authStore.setUser(userProfile.data.user);
      authStore.setAuthenticated(true);
    }
  }, [userProfile?.data?.user, authStore.user]);

  /**
   * Listen for logout events (e.g., session expired)
   */
  useEffect(() => {
    const handleLogout = (event: Event) => {
      const customEvent = event as CustomEvent;
      const reason = customEvent.detail?.reason;

      if (reason === 'token_expired') {
        authStore.logout();
        authStore.setError('Your session has expired. Please log in again.');
      }
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  /**
   * Create wrapper function for login
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      authStore.setLoading(true);
      authStore.setError(null);
      const result = await loginMutation.mutateAsync({ email, password });
      const { user, token } = result.data;
      
      // Store JWT token
      setToken(token);
      
      // Update auth store
      authStore.setUser(user);
      authStore.setAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      authStore.setError(errorMessage);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * Create wrapper function for logout
   */
  const handleLogout = async () => {
    try {
      authStore.setLoading(true);
      clearToken();
      await logoutMutation.mutateAsync();
    } catch (err) {
      // Even if logout mutation fails, clear locally
      console.error('Logout error:', err);
    } finally {
      authStore.logout();
      authStore.setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authStore.user,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: authStore.isAuthenticated,
        isLoading: authStore.isLoading || loginMutation.isPending || logoutMutation.isPending || isLoadingUser,
        error: authStore.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
