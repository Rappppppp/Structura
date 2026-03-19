/**
 * Team Members API Service
 * Handles team member management
 */

import { apiRequest } from '@/lib/api.client';
import { TeamMember, TeamMemberDetailed } from '@/types/team';

export interface CreateTeamMemberRequest {
  user_id?: string;
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

const mapTeamMember = (member: any): TeamMember => ({
  id: Number(member.id),
  name: member.user?.name || 'Unknown',
  role: member.role,
  avatar: member.avatar,
  email: member.user?.email,
  phone: member.user?.phone_number,
  projects: Number(member.projects_count || 0),
});

const mapDetailedTeamMember = (member: any): TeamMemberDetailed => ({
  ...mapTeamMember(member),
  avatar: member.avatar || '',
  email: member.user?.email || '',
  phone: member.user?.phone_number || '',
  projects: Number(member.projects_count || 0),
  assignedProjects: [],
});

const createUserForTeamMember = async (data: CreateTeamMemberRequest): Promise<string> => {
  const generatedPassword = `Tmp@${Date.now()}!`;
  const response = await apiRequest.post<any>('/admin/users', {
    name: data.name,
    email: data.email,
    password: generatedPassword,
    role: 'architect',
  });

  return response?.data?.id;
};

export const teamService = {
  /**
   * Get all team members
   */
  list: (params?: { project_id?: string }): Promise<TeamMembersListResponse> =>
    apiRequest.get('/teams', {
      params: {
        project_id: params?.project_id,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapTeamMember) : [],
    })),

  /**
   * Get single team member details
   */
  getById: (id: string): Promise<TeamMemberDetailResponse> =>
    apiRequest.get(`/teams/${id}`).then((response: any) => ({
      ...response,
      data: response?.data ? mapDetailedTeamMember(response.data) : response?.data,
    })),

  /**
   * Add team member
   */
  create: async (data: CreateTeamMemberRequest): Promise<TeamMemberDetailResponse> => {
    let userId = data.user_id;

    if (!userId) {
      userId = await createUserForTeamMember(data);
    }

    return apiRequest.post('/admin/team-members', {
      user_id: userId,
      role: data.role,
      avatar: data.avatar,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapDetailedTeamMember(response.data) : response?.data,
    }));
  },

  /**
   * Update team member
   */
  update: (id: string, data: UpdateTeamMemberRequest): Promise<TeamMemberDetailResponse> =>
    apiRequest.put(`/admin/team-members/${id}`, {
      role: data.role,
      avatar: data.avatar,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapDetailedTeamMember(response.data) : response?.data,
    })),

  /**
   * Remove team member
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/admin/team-members/${id}`),
};
