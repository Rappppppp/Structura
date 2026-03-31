import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import StatusBadge from '@/components/shared/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/queries/useClients';
import { useCreateClientMutation, useUpdateClientMutation, useDeleteClientMutation } from '@/hooks/mutations/useClientMutations';
import { useQueryClient } from '@tanstack/react-query';
import type { Client } from '@/types';
import { Building2, Plus, Search, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';

const Clients = () => {
  const ITEMS_PER_PAGE = 10;
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    location: '',
    contact_person: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all clients (large perPage to get everything)
  const { data: clientsData, isLoading, error } = useClients(1, 1000);
  const createClient = useCreateClientMutation();
  const updateClient = useUpdateClientMutation();
  const deleteClientMutation = useDeleteClientMutation();
  
  // Extract clients array
  let allClients: Client[] = [];
  if (Array.isArray(clientsData)) {
    allClients = clientsData;
  } else if (clientsData?.data && Array.isArray(clientsData.data)) {
    allClients = clientsData.data;
  }

  // Apply search filter
  const filtered = allClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.industry && c.industry.toLowerCase().includes(search.toLowerCase()))
  );

  // Calculate pagination on filtered results
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedClients = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateClient = async () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await createClient.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        industry: formData.industry || undefined,
        location: formData.location || undefined,
        contact_person: formData.contact_person || undefined,
      });

      setFormData({ name: '', email: '', phone: '', industry: '', location: '', contact_person: '' });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Success', description: 'Client created successfully' });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create client',
        variant: 'destructive' 
      });
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient || !formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await updateClient.mutateAsync({
        id: selectedClient.id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          industry: formData.industry || undefined,
          location: formData.location || undefined,
          contact_person: formData.contact_person || undefined,
        },
      });

      setFormData({ name: '', email: '', phone: '', industry: '', location: '', contact_person: '' });
      setIsEditOpen(false);
      setSelectedClient(null);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Success', description: 'Client updated successfully' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update client',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteClient) return;

    try {
      await deleteClientMutation.mutateAsync(deleteClient.id);
      setDeleteClient(null);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Success', description: 'Client deleted successfully' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      industry: client.industry || '',
      location: client.location || '',
      contact_person: client.contact_person || '',
    });
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading clients</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your client relationships and projects</p>
        </div>
        <Button onClick={() => {
          setFormData({ name: '', email: '', phone: '', industry: '', location: '', contact_person: '' });
          setIsCreateOpen(true);
        }}>
          <Plus className="h-4 w-4" /> New Client
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card animate-fade-in p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Industry</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map(client => (
                  <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.contact_person || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.industry || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.location || 'N/A'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(client)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteClient(client)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {paginatedClients.map(client => (
            <Card key={client.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.contact_person || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {client.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> {client.location || 'N/A'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedClient(client)}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(client)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteClient(client)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Client Details Dialog */}
      <Dialog open={!!selectedClient && !isEditOpen} onOpenChange={() => selectedClient && !isEditOpen && setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
            <DialogDescription>{selectedClient?.industry || 'Client Details'}</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />{selectedClient.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />{selectedClient.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />{selectedClient.location || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />{selectedClient.industry || 'N/A'}
                </div>
              </div>
              {selectedClient.contact_person && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Contact Person</h4>
                  <p className="text-sm text-muted-foreground">{selectedClient.contact_person}</p>
                </div>
              )}
              {selectedClient.active_projects !== undefined && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Active Projects</h4>
                  <p className="text-sm text-muted-foreground">{selectedClient.active_projects} projects</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Client Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
            <DialogDescription>Add a new client to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company Name *</label>
              <input
                placeholder="Acme Corp"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                placeholder="contact@acme.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                placeholder="+63 9XX XXXX XXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Industry</label>
              <input
                placeholder="e.g., Technology, Finance"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
              <input
                placeholder="City, Country"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Person</label>
              <input
                placeholder="John Doe"
                value={formData.contact_person}
                onChange={e => setFormData({...formData, contact_person: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateClient} disabled={createClient.isPending}>
              {createClient.isPending ? 'Creating...' : 'Create Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company Name *</label>
              <input
                placeholder="Acme Corp"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                placeholder="contact@acme.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                placeholder="+63 9XX XXXX XXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Industry</label>
              <input
                placeholder="e.g., Technology, Finance"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
              <input
                placeholder="City, Country"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Person</label>
              <input
                placeholder="John Doe"
                value={formData.contact_person}
                onChange={e => setFormData({...formData, contact_person: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateClient} disabled={updateClient.isPending}>
              {updateClient.isPending ? 'Updating...' : 'Update Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClient} onOpenChange={() => setDeleteClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteClient?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 rounded-md bg-muted p-3">
            <div className="text-sm">
              <span className="font-semibold">Email:</span> {deleteClient?.email}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Industry:</span> {deleteClient?.industry || 'N/A'}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              disabled={deleteClientMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteClientMutation.isPending ? 'Deleting...' : 'Delete Client'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Clients;

