/**
 * Clients Mutation Hooks
 * Provides React Query hooks for client mutations
 */

import { useMutation } from '@tanstack/react-query';
import { clientService, CreateClientRequest, UpdateClientRequest } from '@/api/clients.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to create a new client
 */
export const useCreateClientMutation = () => {
  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientService.create(data),
    onSuccess: () => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook to update an existing client
 */
export const useUpdateClientMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific client and list
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook to delete a client
 */
export const useDeleteClientMutation = () => {
  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
