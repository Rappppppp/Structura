/**
 * Clients API Service
 * Handles client management
 */

import { apiRequest } from '@/lib/api.client';
import { Client } from '@/types/client';
import { User } from '@/types/auth';

interface BackendClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  contact_person?: string;
  location?: string;
  active_projects?: number;
  total_value?: number;
  status?: string;
  account_owner?: User;
  account_owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  contact_person?: string;
  industry?: string;
  phone?: string;
  location?: string;
  status?: string;
  account_owner_id?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  contact_person?: string;
  industry?: string;
  phone?: string;
  location?: string;
  status?: string;
  account_owner_id?: string;
}

export interface ClientsListResponse {
  data: Client[];
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

export interface ClientDetailResponse {
  data: Client;
}

const mapClient = (client: any): Client => {
  console.log('Mapping client:', client);
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone || client.phone_number,
    industry: client.industry || client.company,
    contact_person: client.contact_person,
    location: client.location || client.address || '',
    active_projects: client.active_projects,
    total_value: client.total_value,
    status: (client.status as any) || 'active',
    account_owner: client.account_owner,
    account_owner_id: client.account_owner_id,
    created_at: client.created_at,
    updated_at: client.updated_at,
  };
};

export const clientService = {
  /**
   * Get all clients with optional pagination
   */
  list: (params?: { page?: number; perPage?: number }): Promise<ClientsListResponse> =>
    apiRequest.get('/clients', {
      params: {
        page: params?.page,
        per_page: params?.perPage,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapClient) : [],
    })),

  /**
   * Get single client by ID
   */
  getById: (id: string): Promise<ClientDetailResponse> =>
    apiRequest.get(`/clients/${id}`).then((response: any) => {
      console.log('Raw API response:', response);
      return {
        data: response?.data ? mapClient(response.data) : null,
      };
    }),

  /**
   * Create new client
   */
  create: (data: CreateClientRequest): Promise<ClientDetailResponse> =>
    apiRequest.post('/clients', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      location: data.location,
      contact_person: data.contact_person,
      status: data.status || 'active',
      account_owner_id: data.account_owner_id,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapClient(response.data) : response?.data,
    })),

  /**
   * Update client
   */
  update: (id: string, data: UpdateClientRequest): Promise<ClientDetailResponse> =>
    apiRequest.put(`/clients/${id}`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      location: data.location,
      contact_person: data.contact_person,
      status: data.status,
      account_owner_id: data.account_owner_id,
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapClient(response.data) : response?.data,
    })),

  /**
   * Delete client
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/clients/${id}`),
};
