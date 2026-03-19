/**
 * Projects API Service
 * Handles CRUD operations for projects
 */

import { apiRequest } from '@/lib/api.client';
import { Project, ProjectStatus, ProjectStatusData } from '@/types/project';

interface BackendProject {
  id: string;
  name: string;
  client?: {
    id: string;
    name: string;
  } | null;
  budget: number;
  progress: number;
  status: ProjectStatus;
  deadline_at?: string;
}

interface BackendClientSearchResponse {
  data?: Array<{
    id: string;
    name: string;
  }>;
}

export interface CreateProjectRequest {
  name: string;
  client?: string;
  client_id?: string;
  deadline_at: string;
  budget: number;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  client?: string;
  client_id?: string;
  deadline?: string;
  deadline_at?: string;
  budget?: number;
  status?: ProjectStatus;
  progress?: number;
}

export interface ProjectsListResponse {
  data: Project[];
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

export interface ProjectDetailResponse {
  data: Project;
}

const mapProject = (project: BackendProject): Project => ({
  id: project.id,
  name: project.name,
  client: project.client?.name || 'N/A',
  status: project.status,
  progress: Number(project.progress ?? 0),
  deadline: project.deadline_at ? new Date(project.deadline_at).toLocaleDateString() : 'N/A',
  budget: Number(project.budget ?? 0),
});

const resolveClientId = async (clientId?: string, clientName?: string): Promise<string | undefined> => {
  if (clientId) {
    return clientId;
  }

  if (!clientName) {
    return undefined;
  }

  if (/^\d+$/.test(clientName)) {
    return clientName;
  }

  const response = await apiRequest.get<BackendClientSearchResponse>('/clients', {
    params: { search: clientName, per_page: 100 },
  });

  const exactMatch = response?.data?.find((client) => client.name.toLowerCase() === clientName.toLowerCase());
  return exactMatch?.id || response?.data?.[0]?.id;
};

export const projectService = {
  /**
   * Get all projects with optional pagination and filters
   */
  list: (params?: { page?: number; perPage?: number; status?: ProjectStatus }): Promise<ProjectsListResponse> =>
    apiRequest.get('/projects', {
      params: {
        page: params?.page,
        per_page: params?.perPage,
        status: params?.status,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapProject) : [],
    })),

  /**
   * Get single project by ID
   */
  getById: (id: string): Promise<ProjectDetailResponse> =>
    apiRequest.get(`/projects/${id}`).then((response: any) => ({
      ...response,
      data: response?.data ? mapProject(response.data) : response?.data,
    })),

  /**
   * Create a new project
   */
  create: async (data: CreateProjectRequest): Promise<ProjectDetailResponse> => {
    const clientId = await resolveClientId(data.client_id, data.client);

    return apiRequest.post('/projects', {
      name: data.name,
      client_id: clientId,
      deadline_at: data.deadline_at,
      budget: data.budget,
      status: data.status,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapProject(response.data) : response?.data,
    }));
  },

  /**
   * Update existing project
   */
  update: async (id: string, data: UpdateProjectRequest): Promise<ProjectDetailResponse> => {
    const clientId = await resolveClientId(data.client_id, data.client);

    return apiRequest.put(`/projects/${id}`, {
      name: data.name,
      client_id: clientId,
      deadline_at: data.deadline_at || data.deadline,
      budget: data.budget,
      status: data.status,
      progress: data.progress,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapProject(response.data) : response?.data,
    }));
  },

  /**
   * Delete a project
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/projects/${id}`),

  /**
   * Get project status analytics
   */
  getStatusData: (): Promise<{ data: ProjectStatusData }> =>
    apiRequest.get('/projects/analytics/status'),
};
