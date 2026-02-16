import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useInvoiceStore } from '@/stores/invoice.store';
import { Plus, Upload, Brain, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const { toast } = useToast();
  const invoices = useInvoiceStore((s) => s.invoices);

  const handleGenerateInvoice = () => {
    setInvoiceOpen(false);
    toast({ title: 'Invoice Generated', description: 'Invoice INV-006 has been created successfully.' });
  };

  const handleUploadContract = () => {
    setContractOpen(false);
    toast({ title: 'Contract Uploaded', description: 'Your contract has been uploaded for review.' });
  };

  const handleAnalyzeContract = () => {
    setAnalyzeOpen(false);
    toast({ title: 'Analysis Started', description: 'AI is analyzing your contract. Results will appear shortly.' });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments & Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage invoices and contract documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setContractOpen(true)}>
            <Upload className="h-4 w-4" /> Upload Contract
          </Button>
          <Button onClick={() => setInvoiceOpen(true)}>
            <Plus className="h-4 w-4" /> Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card lg:col-span-2 animate-fade-in">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-card-foreground">Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  {['Invoice ID', 'Project', 'Client', 'Amount', 'Status', 'Due Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{inv.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{inv.project}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{inv.client}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">₱{(inv.amount / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{inv.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">AI Contract Analysis</h3>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
            <FileText className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-muted-foreground text-center">Upload a contract for AI-powered analysis</p>
            <Button className="mt-4" onClick={() => setAnalyzeOpen(true)}>
              Analyze Contract
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>Create a new invoice for a project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Project</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Skyline Tower</option>
                <option>Harbor Bridge Redesign</option>
                <option>Green Campus Hub</option>
                <option>Metro Station Complex</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Amount (₱)</label>
              <input type="number" placeholder="150000" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Due Date</label>
              <input type="date" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateInvoice}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contractOpen} onOpenChange={setContractOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Contract</DialogTitle>
            <DialogDescription>Upload a contract document for a project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Project</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Skyline Tower</option>
                <option>Harbor Bridge Redesign</option>
                <option>Green Campus Hub</option>
                <option>Metro Station Complex</option>
              </select>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/40 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadContract}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={analyzeOpen} onOpenChange={setAnalyzeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Contract Analysis</DialogTitle>
            <DialogDescription>Upload a contract to analyze it for risks, compliance issues, and key terms.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/40 transition-colors">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Select a contract to analyze</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyzeOpen(false)}>Cancel</Button>
            <Button onClick={handleAnalyzeContract}>
              <Brain className="h-4 w-4" /> Start Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
