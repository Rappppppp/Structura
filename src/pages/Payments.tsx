import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useInvoiceStore } from '@/stores/invoice.store';
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
  const { toast } = useToast();

  const invoices = useInvoiceStore((s) => s.invoices);

  const handleGenerateInvoice = () => {
    setInvoiceOpen(false);
    toast({
      title: 'Invoice Generated',
      description: 'New invoice has been created successfully.',
    });
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
            Payments & Contracts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage invoices, billing progress, and variation orders
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setVariationOpen(true)}>
            <ClipboardList className="h-4 w-4" />
            Variation / Change Order
          </Button>

          <Button onClick={() => setInvoiceOpen(true)}>
            <Plus className="h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Table */}
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
                    'Progress',
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
                {invoices.map((inv) => {
                  const total = inv.contractValue ?? 500000;
                  const billed = inv.amount ?? 0;
                  const percent = Math.min(
                    100,
                    Math.round((billed / total) * 100)
                  );

                  return (
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

                      {/* Progress Column */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium text-foreground">
                            ₱{(billed / 1000).toFixed(0)}K /
                            ₱{(total / 1000).toFixed(0)}K
                          </div>

                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <span className="text-xs text-muted-foreground">
                            {percent}% completed
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {inv.dueDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
                Project
              </label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Skyline Tower</option>
                <option>Harbor Bridge Redesign</option>
                <option>Green Campus Hub</option>
                <option>Metro Station Complex</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Billing Amount (₱)
              </label>
              <input
                type="number"
                placeholder="150000"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Due Date
              </label>
              <input
                type="date"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateInvoice}>
              Generate
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
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Skyline Tower</option>
                <option>Harbor Bridge Redesign</option>
                <option>Green Campus Hub</option>
                <option>Metro Station Complex</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the change in scope..."
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