/**
 * Tasks Mutation Hooks
 * Provides React Query hooks for task mutations
 */

import { useMutation } from '@tanstack/react-query';
import { taskService, CreateTaskRequest, UpdateTaskRequest } from '@/api/tasks.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to create a new task
 */
export const useCreateTaskMutation = () => {
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.create(data),
    onSuccess: (_, variables) => {
      // Invalidate tasks list for this project
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId: variables.project_id }] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTaskMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      taskService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific task and all tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to update task status (kanban board movement)
 */
export const useUpdateTaskStatusMutation = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      taskService.updateStatus(id, status),
    onSuccess: () => {
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
