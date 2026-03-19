import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useInvoices } from '@/hooks/queries/useInvoices';
import { useProjects } from '@/hooks/queries/useProjects';
import { useClients } from '@/hooks/queries/useClients';
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
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ project_id: '', client_id: '', amount: '', due_date: '' });
  const [variationForm, setVariationForm] = useState({ project_id: '', description: '', amount: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices();
  const { data: projectsData } = useProjects(undefined, 1, 100);
  const { data: clientsData } = useClients(1, 100);
  const createInvoice = useCreateInvoiceMutation();

  const invoices = invoicesData?.data || [];

  let projects = [];
  if (Array.isArray(projectsData)) {
    projects = projectsData;
  } else if (projectsData?.data && Array.isArray(projectsData.data)) {
    projects = projectsData.data;
  }

  let clients = [];
  if (Array.isArray(clientsData)) {
    clients = clientsData;
  } else if (clientsData?.data && Array.isArray(clientsData.data)) {
    clients = clientsData.data;
  }

  const handleGenerateInvoice = async () => {
    if (!invoiceForm.project_id || !invoiceForm.client_id || !invoiceForm.amount || !invoiceForm.due_date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      await createInvoice.mutateAsync({
        project_id: invoiceForm.project_id,
        client_id: invoiceForm.client_id,
        amount: parseFloat(invoiceForm.amount),
        due_date: invoiceForm.due_date
      });

      setInvoiceForm({ project_id: '', client_id: '', amount: '', due_date: '' });
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Payments & Invoices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage invoices and billing progress
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setInvoiceOpen(true)}>
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
          <div className="animate-fade-in rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-card-foreground">
                Invoices
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    {[
                      'Invoice ID',
                      'Project',
                      'Client',
                      'Amount',
                      'Status',
                      'Due Date',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                        {inv.id}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {inv.project}
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {inv.client}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium">
                        ₱{(inv.amount / 1000).toFixed(0)}K
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {inv.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {invoices.length === 0 && (
              <div className="px-4 py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No invoices yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Invoice Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create a new billing request for a project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Project *
              </label>
              <select 
                value={invoiceForm.project_id}
                onChange={e => setInvoiceForm({...invoiceForm, project_id: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client *
              </label>
              <select
                value={invoiceForm.client_id}
                onChange={e => setInvoiceForm({...invoiceForm, client_id: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Billing Amount (₱) *
              </label>
              <input
                type="number"
                placeholder="150000"
                value={invoiceForm.amount}
                onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Due Date *
              </label>
              <input
                type="date"
                value={invoiceForm.due_date}
                onChange={e => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateInvoice} disabled={createInvoice.isPending}>
              {createInvoice.isPending ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variation / Change Order Dialog */}
      <Dialog open={variationOpen} onOpenChange={setVariationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Variation / Change Order</DialogTitle>
            <DialogDescription>
              Submit a project scope change or additional work request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Project
              </label>
              <select 
                value={variationForm.project_id}
                onChange={e => setVariationForm({...variationForm, project_id: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the change in scope..."
                value={variationForm.description}
                onChange={e => setVariationForm({...variationForm, description: e.target.value})}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Additional Amount (₱)
              </label>
              <input
                type="number"
                placeholder="50000"
                value={variationForm.amount}
                onChange={e => setVariationForm({...variationForm, amount: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVariationOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateVariation}>
              Submit Change Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;