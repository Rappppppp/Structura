import { User } from './auth';
import { Client } from './client';

export type ProjectStatus = 'active' | 'review' | 'completed' | 'on-hold';
export type BaseRole = 'admin' | 'member' | 'viewer';
export type SpecialtyRole = 'architect' | 'engineer' | 'pm' | 'bim' | string;

export interface ProjectTeamMember {
  id: string;
  user: User;
  base_role: BaseRole;
  specialty_role?: SpecialtyRole;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clients: Client[];
  team_members?: ProjectTeamMember[];
  status: ProjectStatus;
  progress: number;
  deadline: string;
  budget: number;
  pending_tasks?: number;
  team_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectStatusData {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
}
