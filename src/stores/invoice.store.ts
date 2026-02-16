import { create } from 'zustand';
import type { Invoice, RevenueData } from '@/types';
import { invoices as mockInvoices, revenueData as mockRevenueData } from '@/data/mockData';

interface InvoiceState {
  invoices: Invoice[];
  revenueData: RevenueData[];
  isLoading: boolean;
  error: string | null;
}

interface InvoiceActions {
  fetchInvoices: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type InvoiceStore = InvoiceState & InvoiceActions;

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: mockInvoices,
  revenueData: mockRevenueData,
  isLoading: false,
  error: null,

  fetchInvoices: () => {
    set({ isLoading: true, error: null });
    set({ invoices: mockInvoices, revenueData: mockRevenueData, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectInvoices = (state: InvoiceStore) => state.invoices;
export const selectPendingInvoices = (state: InvoiceStore) =>
  state.invoices.filter((i) => i.status === 'pending');
