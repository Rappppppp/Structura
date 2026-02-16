export type ClientStatus = 'active' | 'review' | 'completed' | 'on-hold';

export interface Client {
  id: number;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeProjects: number;
  totalValue: number;
  status: ClientStatus;
  projects: string[];
}
