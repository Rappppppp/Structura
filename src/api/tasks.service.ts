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
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
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

const mapTask = (task: any): KanbanTask => ({
  id: Number(task.id),
  title: task.title,
  status: task.status,
  priority: task.priority || 'low',
  assignee: task.assignee?.name || 'A',
});

export const taskService = {
  /**
   * Get all tasks, optionally filtered by project
   */
  list: (params?: { project_id?: string }): Promise<TasksListResponse> =>
    apiRequest.get('/tasks', {
      params: {
        project_id: params?.project_id,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapTask) : [],
    })),

  /**
   * Get single task by ID
   */
  getById: (id: string): Promise<TaskDetailResponse> =>
    apiRequest.get(`/tasks/${id}`).then((response: any) => ({
      ...response,
      data: response?.data ? mapTask(response.data) : response?.data,
    })),

  /**
   * Create a new task
   */
  create: (data: CreateTaskRequest): Promise<TaskDetailResponse> =>
    apiRequest.post('/tasks', data).then((response: any) => ({
      ...response,
      data: response?.data ? mapTask(response.data) : response?.data,
    })),

  /**
   * Update task
   */
  update: (id: string, data: UpdateTaskRequest): Promise<TaskDetailResponse> =>
    apiRequest.put(`/tasks/${id}`, data).then((response: any) => ({
      ...response,
      data: response?.data ? mapTask(response.data) : response?.data,
    })),

  /**
   * Delete task
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/tasks/${id}`),

  /**
   * Move task to different status (kanban board)
   */
  updateStatus: (id: string, status: 'todo' | 'in-progress' | 'done'): Promise<TaskDetailResponse> =>
    apiRequest.patch(`/tasks/${id}`, { status }).then((response: any) => ({
      ...response,
      data: response?.data ? mapTask(response.data) : response?.data,
    })),
};
