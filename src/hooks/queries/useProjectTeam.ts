/**
 * Project Team Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { projectTeamService } from '@/api/project-team.service';
import { usersService } from '@/api/users.service';

export const useProjectTeam = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projectTeam', projectId],
    queryFn: () => projectTeamService.list(projectId!),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUsersDropdown = () => {
  return useQuery({
    queryKey: ['usersDropdown'],
    queryFn: () => usersService.list(),
    staleTime: 5 * 60 * 1000,
  });
};
