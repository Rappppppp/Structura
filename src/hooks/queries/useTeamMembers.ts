/**
 * Team Members Query Hooks
 * Provides React Query hooks for fetching team member data
 */

import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/api/teams.service';

/**
 * Hook to fetch all team members
 */
export const useTeamMembers = (projectId?: string) => {
  return useQuery({
    queryKey: ['teamMembers', { projectId }],
    queryFn: () => teamService.list({ project_id: projectId }),
    staleTime: 5 * 60 * 1000, // 5 minutes - team composition doesn't change frequently
  });
};

/**
 * Hook to fetch a single team member by ID
 */
export const useTeamMember = (memberId: string | undefined | null) => {
  return useQuery({
    queryKey: ['teamMembers', memberId],
    queryFn: () => teamService.getById(memberId!),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
  });
};
