export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  project: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  contractValue?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}
