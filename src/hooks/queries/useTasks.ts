/**
 * Tasks Query Hooks
 * Provides React Query hooks for fetching task data
 */

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/api/tasks.service';

/**
 * Hook to fetch all tasks, optionally filtered by project
 */
export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ['tasks', { projectId }],
    queryFn: () => taskService.list({ project_id: projectId }),
    staleTime: 0, // Fresh data always
  });
};

/**
 * Hook to fetch a single task by ID
 */
export const useTask = (taskId: string | undefined | null) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => taskService.getById(taskId!),
    enabled: !!taskId,
    staleTime: 0,
  });
};

/**
 * Hook to fetch comments for a task
 */
export const useTaskComments = (taskId: string | undefined | null) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => taskService.getComments(taskId!),
    enabled: !!taskId,
    staleTime: 0,
  });
};
