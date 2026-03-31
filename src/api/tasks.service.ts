/**
 * Tasks API Service
 * Handles CRUD operations for tasks and kanban board management
 */

import { apiRequest } from '@/lib/api.client';
import { KanbanTask, Task, TaskComment } from '@/types/task';

import { TaskCategory, TaskSubCategory, TaskFinishingType } from '@/types/task';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  project_id: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_at?: string;
  work_percentage?: number;
  category?: TaskCategory;
  subCategory?: TaskSubCategory;
  finishingType?: TaskFinishingType;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_at?: string;
  work_percentage?: number;
  category?: TaskCategory;
  subCategory?: TaskSubCategory;
  finishingType?: TaskFinishingType;
}

export interface TasksListResponse {
  data: KanbanTask[];
}

export interface TaskDetailResponse {
  data: KanbanTask;
}

const mapTask = (task: any): KanbanTask => ({
  id: String(task.id),
  title: task.title,
  description: task.description || '',
  status: task.status,
  priority: task.priority || 'low',
  assignee: task.assignee?.name || 'Unassigned',
  assigneeId: task.assigned_to || task.assignee?.id,
  workPercentage: task.work_percentage || 0,
  dueAt: task.due_at || undefined,
  createdAt: task.created_at || undefined,
  category: task.category || undefined,
  subCategory: task.subCategory || undefined,
  finishingType: task.finishingType || undefined,
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

  /**
   * Get all comments for a task
   */
  getComments: (taskId: string): Promise<{ data: TaskComment[] }> =>
    apiRequest.get(`/tasks/${taskId}/comments`),

  /**
   * Add a comment to a task
   */
  addComment: (taskId: string, content: string): Promise<{ data: TaskComment }> =>
    apiRequest.post(`/tasks/${taskId}/comments`, { content }),

  /**
   * Delete a comment from a task
   */
  deleteComment: (taskId: string, commentId: string): Promise<{ message: string }> =>
    apiRequest.delete(`/tasks/${taskId}/comments/${commentId}`),
};
