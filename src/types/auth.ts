export type UserRole = 'admin' | 'architect' | 'engineer' | 'client';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
