import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { InvoiceActionMenu } from '@/components/InvoiceActionMenu';
import { useInvoices } from '@/hooks/queries/useInvoices';
import { useProjects } from '@/hooks/queries/useProjects';
import { useCreateInvoiceMutation } from '@/hooks/mutations/useInvoiceMutations';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, FileText, ClipboardList } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/components/TablePagination';
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const ITEMS_PER_PAGE = 10;
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceForm, setInvoiceForm] = useState({ project_id: '', amount: '', due_date: '' });
  const [variationForm, setVariationForm] = useState({ project_id: '', description: '', amount: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all invoices (large perPage to get everything)
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(1, 1000);
  const { data: projectsData } = useProjects(undefined, 1, 100);
  const createInvoice = useCreateInvoiceMutation();

  const invoicesResponse = invoicesData as any;
  const invoices = invoicesResponse?.data || [];
  const totalInvoices = invoices.length;
  const totalPages = Math.ceil(totalInvoices / ITEMS_PER_PAGE);
  
  // Paginate invoices
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  let projects = [];
  if (Array.isArray(projectsData)) {
    projects = projectsData;
  } else if (projectsData?.data && Array.isArray(projectsData.data)) {
    projects = projectsData.data;
  }

  const handleGenerateInvoice = async () => {
    if (!invoiceForm.project_id || !invoiceForm.amount || !invoiceForm.due_date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      await createInvoice.mutateAsync({
        project_id: invoiceForm.project_id,
        amount: parseFloat(invoiceForm.amount),
        due_date: invoiceForm.due_date
      });

      setInvoiceForm({ project_id: '', amount: '', due_date: '' });
      setInvoiceOpen(false);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: 'Success', description: 'Invoice generated successfully' });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create invoice',
        variant: 'destructive' 
      });
    }
  };

  const handleCreateVariation = () => {
    setVariationOpen(false);
    toast({
      title: 'Variation Order Created',
      description: 'Change order has been submitted for approval.',
    });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Payments & Invoices
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage invoices and billing progress
          </p>
        </div>

        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30" onClick={() => setInvoiceOpen(true)}>
            <Plus className="h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {invoicesLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
      )}

      {!invoicesLoading && (
        <div className="grid grid-cols-1 gap-6">
          <div className="animate-fade-in rounded-xl border border-border/50 bg-card shadow-md overflow-hidden">
            <div className="border-b border-border/50 px-6 py-4 bg-gradient-to-r from-card/50 to-card/30">
              <h3 className="text-lg font-semibold text-card-foreground">
                Invoices
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    {[
                      'Invoice ID',
                      'Project',
                      'Amount',
                      'Status',
                      'Due Date',
                      'Paid Date',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {inv.id}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {inv.project}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold">
                        ₱{(inv.amount / 1000).toFixed(0)}K
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inv.dueDate}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inv.paidAt || '—'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <InvoiceActionMenu 
                          invoice={inv} 
                          onActionComplete={() => {
                            queryClient.invalidateQueries({ queryKey: ['invoices'] });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border/50 px-6 py-4">
              <TablePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalInvoices}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>

            {invoices.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No invoices yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Invoice Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="border border-border/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Generate Invoice</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new billing request for a project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Project *
              </label>
              <select 
                value={invoiceForm.project_id}
                onChange={e => setInvoiceForm({...invoiceForm, project_id: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Billing Amount (₱) *
              </label>
              <input
                type="number"
                placeholder="150000"
                value={invoiceForm.amount}
                onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Due Date *
              </label>
              <input
                type="date"
                value={invoiceForm.due_date}
                onChange={e => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleGenerateInvoice} disabled={createInvoice.isPending}>
              {createInvoice.isPending ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variation / Change Order Dialog */}
      <Dialog open={variationOpen} onOpenChange={setVariationOpen}>
        <DialogContent className="border border-border/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Variation / Change Order</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Submit a project scope change or additional work request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Project
              </label>
              <select 
                value={variationForm.project_id}
                onChange={e => setVariationForm({...variationForm, project_id: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the change in scope..."
                value={variationForm.description}
                onChange={e => setVariationForm({...variationForm, description: e.target.value})}
                className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Additional Amount (₱)
              </label>
              <input
                type="number"
                placeholder="50000"
                value={variationForm.amount}
                onChange={e => setVariationForm({...variationForm, amount: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setVariationOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleCreateVariation}>
              Submit Change Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;