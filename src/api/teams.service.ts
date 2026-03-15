/**
 * Team Members API Service
 * Handles team member management
 */

import { apiRequest } from '@/lib/api.client';
import { TeamMember, TeamMemberDetailed } from '@/types/team';

export interface CreateTeamMemberRequest {
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export interface UpdateTeamMemberRequest {
  name?: string;
  role?: string;
  email?: string;
  avatar?: string;
}

export interface TeamMembersListResponse {
  data: TeamMember[];
}

export interface TeamMemberDetailResponse {
  data: TeamMemberDetailed;
}

export const teamService = {
  /**
   * Get all team members
   */
  list: (params?: { project_id?: string }): Promise<TeamMembersListResponse> =>
    apiRequest.get('/team-members', { params }),

  /**
   * Get single team member details
   */
  getById: (id: string): Promise<TeamMemberDetailResponse> =>
    apiRequest.get(`/team-members/${id}`),

  /**
   * Add team member
   */
  create: (data: CreateTeamMemberRequest): Promise<TeamMemberDetailResponse> =>
    apiRequest.post('/team-members', data),

  /**
   * Update team member
   */
  update: (id: string, data: UpdateTeamMemberRequest): Promise<TeamMemberDetailResponse> =>
    apiRequest.put(`/team-members/${id}`, data),

  /**
   * Remove team member
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/team-members/${id}`),
};
