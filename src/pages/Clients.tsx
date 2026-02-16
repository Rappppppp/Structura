import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { useClientStore } from '@/stores/client.store';
import type { Client } from '@/types';
import { Building2, Plus, Search, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

const Clients = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const clients = useClientStore((s) => s.clients);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your client relationships and projects</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      <div className="hidden md:block rounded-lg border border-border bg-card animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(client => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.industry}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{client.contactPerson}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </TableCell>
                <TableCell className="text-sm">{client.activeProjects} active</TableCell>
                <TableCell className="text-sm font-medium">₱{(client.totalValue / 1000000).toFixed(1)}M</TableCell>
                <TableCell><StatusBadge status={client.status} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(client => (
          <Card key={client.id} className="animate-fade-in" onClick={() => setSelectedClient(client)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
                <StatusBadge status={client.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>{client.activeProjects} active projects</span>
                <span className="text-right font-medium text-foreground">₱{(client.totalValue / 1000000).toFixed(1)}M</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-3" />
          <p className="text-sm font-medium">No clients found</p>
        </div>
      )}

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
            <DialogDescription>{selectedClient?.industry}</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{selectedClient.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{selectedClient.phone}</div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{selectedClient.location}</div>
                <div className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-muted-foreground" />₱{(selectedClient.totalValue / 1000000).toFixed(1)}M total value</div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Associated Projects</h4>
                <div className="space-y-2">
                  {selectedClient.projects.map(p => (
                    <div key={p} className="rounded-md border border-border px-3 py-2 text-sm text-foreground">{p}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Contact Person</h4>
                <p className="text-sm text-muted-foreground">{selectedClient.contactPerson}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Register a new client organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company Name</label>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Person</label>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="Jane Smith" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input type="email" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="contact@acme.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Industry</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Real Estate Development</option>
                <option>Government</option>
                <option>Education</option>
                <option>Technology</option>
                <option>Healthcare</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast({ title: 'Client Added', description: 'New client has been registered successfully.' }); }}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;
