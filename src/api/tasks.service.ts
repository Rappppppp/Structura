/**
 * Tasks API Service
 * Handles CRUD operations for tasks and kanban board management
 */

import { apiRequest } from '@/lib/api.client';
import { KanbanTask } from '@/types/task';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  project_id: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
}

export interface TasksListResponse {
  data: KanbanTask[];
}

export interface TaskDetailResponse {
  data: KanbanTask;
}

export const taskService = {
  /**
   * Get all tasks, optionally filtered by project
   */
  list: (params?: { project_id?: string }): Promise<TasksListResponse> =>
    apiRequest.get('/tasks', { params }),

  /**
   * Get single task by ID
   */
  getById: (id: string): Promise<TaskDetailResponse> =>
    apiRequest.get(`/tasks/${id}`),

  /**
   * Create a new task
   */
  create: (data: CreateTaskRequest): Promise<TaskDetailResponse> =>
    apiRequest.post('/tasks', data),

  /**
   * Update task
   */
  update: (id: string, data: UpdateTaskRequest): Promise<TaskDetailResponse> =>
    apiRequest.put(`/tasks/${id}`, data),

  /**
   * Delete task
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/tasks/${id}`),

  /**
   * Move task to different status (kanban board)
   */
  updateStatus: (id: string, status: string): Promise<TaskDetailResponse> =>
    apiRequest.patch(`/tasks/${id}`, { status }),
};
