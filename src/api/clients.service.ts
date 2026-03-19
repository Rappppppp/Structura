/**
 * Clients API Service
 * Handles client management
 */

import { apiRequest } from '@/lib/api.client';
import { Client } from '@/types/client';

interface BackendClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  location?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
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

const mapClient = (client: BackendClient): Client => ({
  id: client.id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.industry,
  address: client.location,
});

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
    apiRequest.get(`/clients/${id}`).then((response: any) => ({
      ...response,
      data: response?.data ? mapClient(response.data) : response?.data,
    })),

  /**
   * Create new client
   */
  create: (data: CreateClientRequest): Promise<ClientDetailResponse> =>
    apiRequest.post('/clients', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.company,
      location: data.address,
      contact_person: data.name,
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
      industry: data.company,
      location: data.address,
      contact_person: data.name,
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
