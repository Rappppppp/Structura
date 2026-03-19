export type ClientStatus = 'active' | 'review' | 'completed' | 'on-hold';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}
