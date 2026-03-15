/**
 * Clients API Service
 * Handles client management
 */

import { apiRequest } from '@/lib/api.client';
import { Client } from '@/types/client';

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

export const clientService = {
  /**
   * Get all clients with optional pagination
   */
  list: (params?: { page?: number; perPage?: number }): Promise<ClientsListResponse> =>
    apiRequest.get('/clients', { params }),

  /**
   * Get single client by ID
   */
  getById: (id: string): Promise<ClientDetailResponse> =>
    apiRequest.get(`/clients/${id}`),

  /**
   * Create new client
   */
  create: (data: CreateClientRequest): Promise<ClientDetailResponse> =>
    apiRequest.post('/clients', data),

  /**
   * Update client
   */
  update: (id: string, data: UpdateClientRequest): Promise<ClientDetailResponse> =>
    apiRequest.put(`/clients/${id}`, data),

  /**
   * Delete client
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/clients/${id}`),
};
