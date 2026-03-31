/**
 * Invoices Mutation Hooks
 * Provides React Query hooks for invoice mutations
 */

import { useMutation } from '@tanstack/react-query';
import { invoiceService, CreateInvoiceRequest, UpdateInvoiceRequest } from '@/api/invoices.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to create a new invoice
 */
export const useCreateInvoiceMutation = () => {
  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => invoiceService.create(data),
    onSuccess: () => {
      // Invalidate invoices list and revenue data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'revenueData'] });
    },
  });
};

/**
 * Hook to update an existing invoice
 */
export const useUpdateInvoiceMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceRequest }) =>
      invoiceService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific invoice and list
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'revenueData'] });
    },
  });
};

/**
 * Hook to delete an invoice
 */
export const useDeleteInvoiceMutation = () => {
  return useMutation({
    mutationFn: (id: string) => invoiceService.delete(id),
    onSuccess: () => {
      // Invalidate invoices list and revenue data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'revenueData'] });
    },
  });
};

/**
 * Hook to send invoice to client
 */
export const useSendInvoiceMutation = () => {
  return useMutation({
    mutationFn: (id: string) => invoiceService.send(id),
    onSuccess: (_, variables) => {
      // Invalidate specific invoice
      queryClient.invalidateQueries({ queryKey: ['invoices', variables] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

/**
 * Hook to mark invoice as paid
 */
export const useMarkInvoicePaidMutation = () => {
  return useMutation({
    mutationFn: (id: string) => invoiceService.markPaid(id),
    onSuccess: (_, variables) => {
      // Invalidate specific invoice and revenue data
      queryClient.invalidateQueries({ queryKey: ['invoices', variables] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'revenueData'] });
    },
  });
};
