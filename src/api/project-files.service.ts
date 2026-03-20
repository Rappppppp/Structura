import { apiClient, apiRequest } from '@/lib/api.client';

export interface ProjectFileItem {
  id: string;
  name: string;
  mime_type?: string;
  size_bytes: number;
  url: string;
  uploaded_by?: string;
  created_at?: string;
}

export interface ProjectFilesResponse {
  data: ProjectFileItem[];
}

export const projectFilesService = {
  list: (projectId: string): Promise<ProjectFilesResponse> =>
    apiRequest.get(`/projects/${projectId}/files`).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data : [],
    })),

  upload: async (projectId: string, file: File): Promise<{ data: ProjectFileItem }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/projects/${projectId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  remove: (projectId: string, fileId: string): Promise<{ message: string }> =>
    apiRequest.delete(`/projects/${projectId}/files/${fileId}`),
};
