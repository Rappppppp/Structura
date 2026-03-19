export type UserRole = 'admin' | 'architect' | 'engineer' | 'project_manager' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phone_number?: string;
  avatar?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}
