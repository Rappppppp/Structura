/**
 * Invoices Query Hooks
 * Provides React Query hooks for fetching invoice data
 */

import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '@/api/invoices.service';

/**
 * Hook to fetch all invoices with optional filters
 */
export const useInvoices = (page = 1, perPage = 10, status?: string) => {
  return useQuery({
    queryKey: ['invoices', { page, perPage, status }],
    queryFn: () => invoiceService.list({ page, perPage, status }),
    staleTime: 0, // Fresh data always for financial data
  });
};

/**
 * Hook to fetch a single invoice by ID
 */
export const useInvoice = (invoiceId: string | undefined | null) => {
  return useQuery({
    queryKey: ['invoices', invoiceId],
    queryFn: () => invoiceService.getById(invoiceId!),
    enabled: !!invoiceId,
    staleTime: 0,
  });
};

/**
 * Hook to fetch revenue analytics data
 */
export const useRevenueData = () => {
  return useQuery({
    queryKey: ['invoices', 'revenueData'],
    queryFn: () => invoiceService.getRevenueData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
