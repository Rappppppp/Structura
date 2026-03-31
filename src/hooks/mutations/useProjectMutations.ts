/**
 * Projects Mutation Hooks
 * Provides React Query hooks for project mutations
 */

import { useMutation } from '@tanstack/react-query';
import { projectService, CreateProjectRequest, UpdateProjectRequest } from '@/api/projects.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to create a new project
 */
export const useCreateProjectMutation = () => {
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.create(data),
    onSuccess: () => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

/**
 * Hook to update an existing project
 */
export const useUpdateProjectMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific project and list
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProjectMutation = () => {
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
