/**
 * User Mutations Hooks
 * Provides React Query mutation hooks for user operations
 */

import { useMutation } from '@tanstack/react-query';
import { adminUserService } from '@/api/admin.service';
import { CreateUserRequest, UpdateUserRequest } from '@/types/user';

/**
 * Hook to create a new user
 */
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminUserService.create(data),
  });
};

/**
 * Hook to update an existing user
 */
export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      adminUserService.update(id, data),
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (id: string) => adminUserService.delete(id),
  });
};
