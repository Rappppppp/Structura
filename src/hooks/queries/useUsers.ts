/**
 * Users Query Hooks
 * Provides React Query hooks for fetching user data
 */

import { useQuery } from '@tanstack/react-query';
import { adminUserService } from '@/api/admin.service';

/**
 * Hook to fetch all users with pagination
 */
export const useUsers = (page = 1, perPage = 15, role?: string, search?: string) => {
  return useQuery({
    queryKey: ['users', { page, perPage, role, search }],
    queryFn: () => adminUserService.list({ page, perPage, role, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single user by ID
 */
export const useUser = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => adminUserService.getById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};
