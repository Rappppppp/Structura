/**
 * Example: Projects Page - Using React Query
 * This demonstrates how to refactor existing pages to use React Query
 *
 * Before: Data from hardcoded mockData and Zustand store
 * After: Real API calls with React Query hooks
 */

import React from 'react';
import { useProjects } from '@/hooks/queries/useProjects';
import { useCreateProjectMutation, useDeleteProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ProjectsPageExample = () => {
  const [page, setPage] = React.useState(1);
  const { toast } = useToast();

  /**
   * Fetch projects with React Query
   * - Automatically handles loading, error, and caching
   * - Refetches when component mounts or window gains focus
   * - Uses stale-time: 0 for fresh data always
   */
  const { data: projectsData, isLoading, error } = useProjects(undefined, page, 10);

  /**
   * Create project mutation
   * - Returns mutate and mutateAsync functions
   * - Automatically invalidates projects query on success
   * - isPending indicates loading state
   */
  const createMutation = useCreateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();

  const handleCreateProject = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'New Project',
        client: 'Client Name',
        deadline: '2024-12-31',
        budget: 10000,
      });

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteMutation.mutateAsync(projectId);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  // Handle errors
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Failed to load projects</p>
      </div>
    );
  }

  // Handle loading
  if (isLoading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateProject} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Project'}
      </Button>

      <div className="space-y-2">
        {projectsData?.data.map((project) => (
          <div key={project.id} className="p-4 border rounded">
            <h3>{project.name}</h3>
            <p>{project.client}</p>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProject(project.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Key improvements:
 * 1. No more hardcoded mockData
 * 2. Real API calls with automatic request/response handling
 * 3. Built-in caching and invalidation
 * 4. Proper loading and error states
 * 5. Type-safe responses
 * 6. Automatic refetching on focus/remount
 * 7. Simplified state management
 */
