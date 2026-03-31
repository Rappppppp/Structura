import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { projectFilesService } from '@/api/project-files.service';

export const useUploadProjectFileMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (file: File) => projectFilesService.upload(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectFiles', projectId] });
    },
  });
};

export const useDeleteProjectFileMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (fileId: string) => projectFilesService.remove(projectId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectFiles', projectId] });
    },
  });
};
