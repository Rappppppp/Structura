import { User } from './auth';

export type BaseRole = 'admin' | 'member' | 'viewer';
export type SpecialtyRole = 'architect' | 'engineer' | 'pm' | 'bim' | string;

/**
 * ProjectTeamMember represents a user assigned to a project with specific roles
 * base_role: Controls access level (admin|member|viewer)
 * specialty_role: Represents professional role/specialization (architect|engineer|pm|bim)
 */
export interface ProjectTeamMember {
  id: string;
  user: User;
  base_role: BaseRole;
  specialty_role?: SpecialtyRole;
  created_at?: string;
  updated_at?: string;
}

