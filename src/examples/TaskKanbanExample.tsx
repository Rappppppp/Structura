/**
 * Example: Task Kanban Board - Using React Query
 * Demonstrates managing complex state with mutations and queries
 */

import React from 'react';
import { useTasks } from '@/hooks/queries/useTasks';
import { useUpdateTaskStatusMutation, useCreateTaskMutation } from '@/hooks/mutations/useTaskMutations';
import { useToast } from '@/hooks/use-toast';

export const TaskKanbanExample = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();

  /**
   * Fetch all tasks for the project
   * The component will automatically refetch when stale
   */
  const { data: tasksData, isLoading } = useTasks(projectId);

  /**
   * Mutations for task operations
   */
  const updateStatusMutation = useUpdateTaskStatusMutation();
  const createTaskMutation = useCreateTaskMutation();

  /**
   * Handle task status change (e.g., drag-drop on kanban board)
   * - Immediately shows optimistic update (with optimistic updates feature)
   * - Automatically refetches if server returns different data
   * - Shows error toast if mutation fails
   */
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: taskId,
        status: newStatus,
      });

      toast({
        title: 'Success',
        description: 'Task updated',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  /**
   * Group tasks by status for kanban columns
   */
  const tasksByStatus = {
    todo: tasksData?.data.filter((t) => t.status === 'todo') || [],
    in_progress: tasksData?.data.filter((t) => t.status === 'in_progress') || [],
    review: tasksData?.data.filter((t) => t.status === 'review') || [],
    completed: tasksData?.data.filter((t) => t.status === 'completed') || [],
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(tasksByStatus).map(([status, tasks]) => (
        <div key={status} className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-4 capitalize">{status.replace('_', ' ')}</h3>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragEnd={() => handleTaskStatusChange(task.id, status)}
                className="p-3 bg-white rounded shadow cursor-move hover:shadow-lg"
              >
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>

                {/* Show loading state for this specific task */}
                {updateStatusMutation.isPending && (
                  <p className="text-xs text-blue-500 mt-2">Updating...</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Key patterns demonstrated:
 * 1. Grouping and filtering data from API response
 * 2. Handling mutations with loading states
 * 3. Error handling with user feedback
 * 4. Automatic cache invalidation after mutations
 * 5. Optimistic UI updates (can be enhanced further)
 */
