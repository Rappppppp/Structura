/**
 * Team Members Mutation Hooks
 * Provides React Query hooks for team member mutations
 */

import { useMutation } from '@tanstack/react-query';
import { teamService, CreateTeamMemberRequest, UpdateTeamMemberRequest } from '@/api/teams.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to add a team member
 */
export const useCreateTeamMemberMutation = () => {
  return useMutation({
    mutationFn: (data: CreateTeamMemberRequest) => teamService.create(data),
    onSuccess: () => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

/**
 * Hook to update a team member
 */
export const useUpdateTeamMemberMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamMemberRequest }) =>
      teamService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific team member and list
      queryClient.invalidateQueries({ queryKey: ['teamMembers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

/**
 * Hook to remove a team member
 */
export const useDeleteTeamMemberMutation = () => {
  return useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};
