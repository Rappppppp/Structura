/**
 * React Query Configuration
 * Sets up global defaults for queries and mutations
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Fresh data always - no stale time
      staleTime: 0,
      // Keep data in cache for 5 minutes before garbage collection
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once before showing error
      retry: 1,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Refetch when component remounts
      refetchOnReconnect: true,
      // Refetch when mounting a stale query
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
