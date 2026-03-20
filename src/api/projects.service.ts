/**
 * Projects API Service
 * Handles CRUD operations for projects
 */

import { apiRequest } from '@/lib/api.client';
import { Project, ProjectStatus, ProjectStatusData } from '@/types/project';
import { Client } from '@/types/client';

interface BackendProject {
  id: string;
  name: string;
  description?: string;
  clients?: Client[];
  budget: number;
  progress: number;
  status: ProjectStatus;
  deadline_at?: string;
  pending_tasks?: number;
  team_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  client_ids: string[];
  deadline_at: string;
  budget: number;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  client_ids?: string[];
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
  description: project.description,
  clients: project.clients || [],
  status: project.status,
  progress: Number(project.progress ?? 0),
  deadline: project.deadline_at ? new Date(project.deadline_at).toLocaleDateString() : 'N/A',
  budget: Number(project.budget ?? 0),
  pending_tasks: project.pending_tasks,
  team_count: project.team_count,
  created_at: project.created_at,
  updated_at: project.updated_at,
});

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
  create: (data: CreateProjectRequest): Promise<ProjectDetailResponse> =>
    apiRequest.post('/projects', {
      name: data.name,
      description: data.description,
      client_ids: data.client_ids,
      deadline_at: data.deadline_at,
      budget: data.budget,
      status: data.status,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapProject(response.data) : response?.data,
    })),

  /**
   * Update existing project
   */
  update: (id: string, data: UpdateProjectRequest): Promise<ProjectDetailResponse> =>
    apiRequest.put(`/projects/${id}`, {
      name: data.name,
      description: data.description,
      client_ids: data.client_ids,
      deadline_at: data.deadline_at,
      budget: data.budget,
      status: data.status,
      progress: data.progress,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapProject(response.data) : response?.data,
    })),

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
