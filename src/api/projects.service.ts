/**
 * Projects API Service
 * Handles CRUD operations for projects
 */

import { apiRequest } from '@/lib/api.client';
import { Project, ProjectStatus, ProjectStatusData } from '@/types/project';

export interface CreateProjectRequest {
  name: string;
  client: string;
  deadline: string;
  budget: number;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  client?: string;
  deadline?: string;
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

export const projectService = {
  /**
   * Get all projects with optional pagination and filters
   */
  list: (params?: { page?: number; perPage?: number; status?: ProjectStatus }): Promise<ProjectsListResponse> =>
    apiRequest.get('/projects', { params }),

  /**
   * Get single project by ID
   */
  getById: (id: string): Promise<ProjectDetailResponse> =>
    apiRequest.get(`/projects/${id}`),

  /**
   * Create a new project
   */
  create: (data: CreateProjectRequest): Promise<ProjectDetailResponse> =>
    apiRequest.post('/projects', data),

  /**
   * Update existing project
   */
  update: (id: string, data: UpdateProjectRequest): Promise<ProjectDetailResponse> =>
    apiRequest.put(`/projects/${id}`, data),

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
