/**
 * Clients Query Hooks
 * Provides React Query hooks for fetching client data
 */

import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/api/clients.service';

/**
 * Hook to fetch all clients with pagination
 */
export const useClients = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['clients', { page, perPage }],
    queryFn: () => clientService.list({ page, perPage }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single client by ID
 */
export const useClient = (clientId: string | undefined | null) => {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => clientService.getById(clientId!),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};
