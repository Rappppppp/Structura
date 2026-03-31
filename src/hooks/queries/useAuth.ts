/**
 * Authentication Query Hooks
 * Provides React Query hooks for authentication operations
 */

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/api/auth.service';
import { getToken } from '@/lib/api.client';

/**
 * Hook to fetch current user profile
 * Uses the auth token from localStorage
 */
export const useCurrentUser = () => {
  const token = getToken();

  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to check if user is authenticated
 * (simple check if token exists in localStorage)
 */
export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ['auth', 'isAuthenticated'],
    queryFn: async () => {
      // Try to fetch current user to verify token is valid
      try {
        await authService.getCurrentUser();
        return true;
      } catch {
        return false;
      }
    },
    staleTime: Infinity, // Only refetch on explicit invalidation
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
