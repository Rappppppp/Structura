/**
 * Admin Users API Service
 * Handles CRUD operations for users (admin only)
 */

import { apiRequest } from '@/lib/api.client';
import { User, UsersListResponse, CreateUserRequest, UpdateUserRequest } from '@/types/user';

export interface UserDetailResponse {
  data: User;
}

export const adminUserService = {
  /**
   * Get all users with pagination
   */
  list: (params?: { page?: number; perPage?: number; role?: string; search?: string }): Promise<UsersListResponse> =>
    apiRequest.get('/admin/users', {
      params: {
        page: params?.page,
        per_page: params?.perPage,
        role: params?.role,
        search: params?.search,
      },
    }),

  /**
   * Get single user by ID
   */
  getById: (id: string): Promise<UserDetailResponse> =>
    apiRequest.get(`/admin/users/${id}`),

  /**
   * Create a new user
   */
  create: (data: CreateUserRequest): Promise<UserDetailResponse> =>
    apiRequest.post('/admin/users', data),

  /**
   * Update existing user
   */
  update: (id: string, data: UpdateUserRequest): Promise<UserDetailResponse> =>
    apiRequest.put(`/admin/users/${id}`, data),

  /**
   * Delete a user
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/admin/users/${id}`),
};
