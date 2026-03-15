/**
 * Authentication Mutation Hooks
 * Provides React Query hooks for authentication mutations (Sanctum Cookie-Based)
 */

import { useMutation } from '@tanstack/react-query';
import { authService, LoginRequest } from '@/api/auth.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to login with email and password
 * Sanctum automatically handles httpOnly cookie storage
 * No need to manually store tokens
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data || error.message);
    },
  });
};

/**
 * Hook to logout
 * Clears all queries and invalidates auth state
 */
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    onError: (error) => {
      // Even if logout fails on server, clear all queries locally
      queryClient.clear();
      console.error('Logout error:', error);
    },
  });
};

/**
 * Hook to verify current session
 * Useful for checking if user is still authenticated
 */
export const useVerifySessionMutation = () => {
  return useMutation({
    mutationFn: () => authService.getCurrentUser(),
    onError: () => {
      // Session is invalid
      queryClient.clear();
    },
  });
};
