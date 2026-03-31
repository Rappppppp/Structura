import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { imageGenerationService } from '@/api/imageGeneration.service';

export const useGenerateImage = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      imageData: string;
      prompt: string;
      model?: string;
      quality?: string;
    }) => {
      return imageGenerationService.generateAndSave(
        projectId,
        data.imageData,
        data.prompt,
        data.model,
        data.quality
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectImages', projectId] });
    },
  });
};

export const useProjectImages = (projectId: string, page = 1) => {
  return useQuery({
    queryKey: ['projectImages', projectId, page],
    queryFn: () => imageGenerationService.getProjectImages(projectId, page),
    enabled: !!projectId,
  });
};

export const useDeleteImage = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      imageGenerationService.deleteImage(projectId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectImages', projectId] });
    },
  });
};
