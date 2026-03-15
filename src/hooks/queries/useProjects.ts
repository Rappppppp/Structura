/**
 * Projects Query Hooks
 * Provides React Query hooks for fetching project data
 */

import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/api/projects.service';
import { ProjectStatus } from '@/types/project';

/**
 * Hook to fetch all projects
 */
export const useProjects = (status?: ProjectStatus, page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['projects', { status, page, perPage }],
    queryFn: () => projectService.list({ status, page, perPage }),
    staleTime: 0, // Fresh data always
  });
};

/**
 * Hook to fetch a single project by ID
 */
export const useProject = (projectId: string | undefined | null) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectService.getById(projectId!),
    enabled: !!projectId,
    staleTime: 0,
  });
};

/**
 * Hook to fetch project status analytics
 */
export const useProjectStatusData = () => {
  return useQuery({
    queryKey: ['projects', 'statusData'],
    queryFn: () => projectService.getStatusData(),
    staleTime: 5 * 60 * 1000, // 5 minutes - analytics data doesn't change as frequently
  });
};
