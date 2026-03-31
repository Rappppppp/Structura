import { useQuery } from '@tanstack/react-query';
import { projectFilesService } from '@/api/project-files.service';

export const useProjectFiles = (projectId: string | undefined | null) => {
  return useQuery({
    queryKey: ['projectFiles', projectId],
    queryFn: () => projectFilesService.list(projectId!),
    enabled: !!projectId,
    staleTime: 0,
  });
};
