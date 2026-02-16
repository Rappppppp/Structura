export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  project: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}
