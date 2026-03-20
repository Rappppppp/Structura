import { User } from './auth';

export type ClientStatus = 'active' | 'inactive' | 'archived';

export interface Project {
  id: string;
  name: string;
  status?: string;
  budget?: number;
}

export interface Client {
  id: string;
  name: string;
  industry?: string;
  contact_person?: string;
  email: string;
  phone?: string;
  location?: string;
  active_projects?: number;
  total_value?: number;
  status: ClientStatus;
  account_owner?: User;
  account_owner_id?: string;
  projects?: Project[];
  created_at?: string;
  updated_at?: string;
}
