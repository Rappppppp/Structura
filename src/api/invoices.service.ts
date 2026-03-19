/**
 * Invoices API Service
 * Handles invoice management and payment processing
 */

import { apiRequest } from '@/lib/api.client';
import { Invoice, RevenueData } from '@/types/invoice';

interface BackendInvoice {
  id: string;
  invoice_id?: string;
  project?: {
    id: string;
    name: string;
  } | null;
  client?: {
    id: string;
    name: string;
  } | null;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date?: string;
  contract_value?: number;
  created_at?: string;
}

export interface CreateInvoiceRequest {
  invoice_id?: string;
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
  invoice_id?: string;
  project_id?: string;
  client_id?: string;
  amount?: number;
  due_date?: string;
  status?: 'pending' | 'paid' | 'overdue';
  paid_at?: string;
  contract_value?: number;
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
  data: RevenueData[];
}

const mapInvoice = (invoice: BackendInvoice): Invoice => ({
  id: invoice.invoice_id || invoice.id,
  project: invoice.project?.name || 'N/A',
  client: invoice.client?.name || 'N/A',
  amount: Number(invoice.amount ?? 0),
  status: invoice.status,
  dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A',
  contractValue: invoice.contract_value ? Number(invoice.contract_value) : undefined,
});

const buildInvoiceId = (): string => {
  return `INV-${Date.now()}`;
};

export const invoiceService = {
  /**
   * Get all invoices with optional filters
   */
  list: (params?: { page?: number; perPage?: number; status?: string }): Promise<InvoicesListResponse> =>
    apiRequest.get('/invoices', {
      params: {
        page: params?.page,
        per_page: params?.perPage,
        status: params?.status,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data) ? response.data.map(mapInvoice) : [],
    })),

  /**
   * Get single invoice by ID
   */
  getById: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.get(`/invoices/${id}`).then((response: any) => ({
      ...response,
      data: response?.data ? mapInvoice(response.data) : response?.data,
    })),

  /**
   * Create new invoice
   */
  create: (data: CreateInvoiceRequest): Promise<InvoiceDetailResponse> =>
    apiRequest.post('/invoices', {
      invoice_id: data.invoice_id || buildInvoiceId(),
      project_id: data.project_id,
      client_id: data.client_id,
      amount: data.amount,
      due_date: data.due_date,
      status: 'pending',
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapInvoice(response.data) : response?.data,
    })),

  /**
   * Update invoice
   */
  update: (id: string, data: UpdateInvoiceRequest): Promise<InvoiceDetailResponse> =>
    apiRequest.put(`/invoices/${id}`, data).then((response: any) => ({
      ...response,
      data: response?.data ? mapInvoice(response.data) : response?.data,
    })),

  /**
   * Delete invoice
   */
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest.delete(`/invoices/${id}`),

  /**
   * Get revenue analytics
   */
  getRevenueData: (): Promise<RevenueDataResponse> =>
    apiRequest.get('/invoices', { params: { per_page: 100 } }).then((response: any) => {
      const invoices: BackendInvoice[] = Array.isArray(response?.data) ? response.data : [];
      const monthTotals = new Map<string, RevenueData>();

      invoices.forEach((invoice) => {
        const monthKey = invoice.created_at
          ? new Date(invoice.created_at).toLocaleString('en-US', { month: 'short' })
          : 'N/A';

        const current = monthTotals.get(monthKey) || { month: monthKey, revenue: 0, expenses: 0 };
        current.revenue += Number(invoice.amount || 0);
        monthTotals.set(monthKey, current);
      });

      return {
        data: Array.from(monthTotals.values()).slice(-12),
      };
    }),

  /**
   * Send invoice to client
   */
  send: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.put(`/invoices/${id}`, { status: 'pending' }).then((response: any) => ({
      ...response,
      data: response?.data ? mapInvoice(response.data) : response?.data,
    })),

  /**
   * Mark invoice as paid
   */
  markPaid: (id: string): Promise<InvoiceDetailResponse> =>
    apiRequest.put(`/invoices/${id}`, {
      status: 'paid',
      paid_at: new Date().toISOString(),
    }).then((response: any) => ({
      ...response,
      data: response?.data ? mapInvoice(response.data) : response?.data,
    })),
};
