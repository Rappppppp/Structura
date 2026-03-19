import type { User, UserRole } from './auth';

export type { User, UserRole };

export interface UsersListResponse {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  confirm_password?: string;
  role: UserRole;
  company?: string;
  phone_number?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  company?: string;
  phone_number?: string;
}

