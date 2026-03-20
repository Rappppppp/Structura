/**
 * Project Team Mutation Hooks
 */

import { useMutation } from '@tanstack/react-query';
import { projectTeamService, AddProjectTeamMemberRequest } from '@/api/project-team.service';
import { queryClient } from '@/lib/queryClient';

export const useAddProjectTeamMemberMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (data: AddProjectTeamMemberRequest) => projectTeamService.add(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] });
    },
  });
};

export const useRemoveProjectTeamMemberMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (userId: string) => projectTeamService.remove(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] });
    },
  });
};
