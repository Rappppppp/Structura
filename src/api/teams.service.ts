/**
 * Users API Service  
 * Handles user management (replacement for old team members which were just users)
 * 
 * Note: Global team members have been removed. Users are now assigned per-project.
 * Use projectTeamService for project-specific team assignment.
 */

import { apiRequest } from '@/lib/api.client';
import { User } from '@/types/auth';

export interface UsersListResponse {
  data: User[];
}

export interface UserDetailResponse {
  data: User;
}

export const teamService = {
  /**
   * Get all users in the system (for assignment to projects)
   */
  list: (params?: { page?: number; perPage?: number }): Promise<UsersListResponse> =>
    apiRequest.get('/users', {
      params: {
        page: params?.page,
        per_page: params?.perPage,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data : [],
    })),

  /**
   * Get single user by ID
   */
  getById: (id: string): Promise<UserDetailResponse> =>
    apiRequest.get(`/users/${id}`).then((response: any) => ({
      ...response,
      data: response?.data,
    })),
};
