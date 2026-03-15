/**
 * Invoices API Service
 * Handles invoice management and payment processing
 */

import { apiRequest } from '@/lib/api.client';
import { Invoice, RevenueData } from '@/types/invoice';

export interface CreateInvoiceRequest {
  project_id: string;
  client_id: string;
  amount: number;
  due_date: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface UpdateInvoiceRequest {
  amount?: number;
  due_date?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoicesListResponse {
  data: Invoice[];
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

export interface InvoiceDetailResponse {
  data: Invoice;
}

export interface RevenueDataResponse {
  data: RevenueData;
}

export const invoiceService = {
  /**
   * Get all invoices with optional filters
   */
  list: (params?: { page?: number; perPage?: number; status?: string }): Promise<InvoicesListResponse> =>
    apiRequest.get('/invoices', { params }),

  /**
   * Get single invoice by ID
   */
  getById: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.get(`/invoices/${id}`),

  /**
   * Create new invoice
   */
  create: (data: CreateInvoiceRequest): Promise<InvoiceDetailResponse> =>
    apiRequest.post('/invoices', data),

  /**
   * Update invoice
   */
  update: (id: string, data: UpdateInvoiceRequest): Promise<InvoiceDetailResponse> =>
    apiRequest.put(`/invoices/${id}`, data),

  /**
   * Delete invoice
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/invoices/${id}`),

  /**
   * Get revenue analytics
   */
  getRevenueData: (): Promise<RevenueDataResponse> =>
    apiRequest.get('/invoices/analytics/revenue'),

  /**
   * Send invoice to client
   */
  send: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.post(`/invoices/${id}/send`),

  /**
   * Mark invoice as paid
   */
  markPaid: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.post(`/invoices/${id}/mark-paid`),
};
