/**
 * Example: Entity Details Page with Related Data
 * Demonstrates fetching and managing related data
 */

import React from 'react';
import { useProject } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useTeamMembers } from '@/hooks/queries/useTeamMembers';
import { useUpdateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useToast } from '@/hooks/use-toast';

export const ProjectDetailPageExample = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();

  /**
   * Fetch project details
   * - enabled: false until projectId is available
   * - Only refetches when projectId changes
   */
  const { data: projectData, isLoading: isLoadingProject } = useProject(projectId);

  /**
   * Fetch related tasks
   * These three queries run in parallel automatically
   * React Query handles all the complexity
   */
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks(projectId);
  const { data: teamData, isLoading: isLoadingTeam } = useTeamMembers(projectId);

  const updateProjectMutation = useUpdateProjectMutation();

  const handleUpdateProject = async (updatedData: any) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        data: updatedData,
      });

      toast({
        title: 'Success',
        description: 'Project updated',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update',
        variant: 'destructive',
      });
    }
  };

  const isLoading = isLoadingProject || isLoadingTasks || isLoadingTeam;

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (!projectData) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">{projectData.data.name}</h1>
        <p className="text-gray-600">{projectData.data.client}</p>
        <p className="text-sm text-gray-500">Budget: ${projectData.data.budget}</p>
      </div>

      {/* Project Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-2">
          {tasksData?.data.map((task) => (
            <div key={task.id} className="p-3 bg-gray-50 rounded">
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-600">{task.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <div className="grid grid-cols-2 gap-3">
          {teamData?.data.map((member) => (
            <div key={member.id} className="p-3 bg-gray-50 rounded">
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={() => handleUpdateProject({ status: 'completed' })}
        disabled={updateProjectMutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {updateProjectMutation.isPending ? 'Updating...' : 'Mark Complete'}
      </button>
    </div>
  );
};

/**
 * Key advantages:
 * 1. Multiple queries run in parallel automatically
 * 2. Loading states for individual queries
 * 3. Automatic cache management
 * 4. Refetch-on-focus for fresh data
 * 5. Type-safe data access
 * 6. Simplified state management
 * 7. Built-in error boundaries
 */
