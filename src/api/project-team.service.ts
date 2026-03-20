/**
 * Project Team API Service
 * Manages team members assigned to a specific project
 */

import { apiRequest } from '@/lib/api.client';
import { ProjectTeamMember, BaseRole, SpecialtyRole } from '@/types/team';
import { User } from '@/types/auth';

export interface ProjectTeamMemberResponse {
  id: string;
  user: User;
  base_role: BaseRole;
  specialty_role?: SpecialtyRole;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTeamListResponse {
  data: ProjectTeamMember[];
}

export interface AddProjectTeamMemberRequest {
  user_id: string;
  base_role: BaseRole;
  specialty_role?: SpecialtyRole;
}

const mapProjectTeamMember = (member: ProjectTeamMemberResponse): ProjectTeamMember => ({
  id: member.id,
  user: member.user,
  base_role: member.base_role,
  specialty_role: member.specialty_role,
  created_at: member.created_at,
  updated_at: member.updated_at,
});

export const projectTeamService = {
  /**
   * Get all team members of a project
   */
  list: (projectId: string): Promise<ProjectTeamListResponse> =>
    apiRequest.get(`/projects/${projectId}/team`).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapProjectTeamMember) : [],
    })),

  /**
   * Add a user to the project team
   */
  add: (projectId: string, data: AddProjectTeamMemberRequest): Promise<{ data: ProjectTeamMember }> =>
    apiRequest.post(`/projects/${projectId}/team`, data).then((response: any) => ({
      ...response,
      data: response?.data ? mapProjectTeamMember(response.data) : response?.data,
    })),

  /**
   * Remove a user from the project team
   */
  remove: (projectId: string, userId: string): Promise<{ message: string }> =>
    apiRequest.delete(`/projects/${projectId}/team/${userId}`),
};
