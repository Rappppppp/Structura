import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/queries/useUsers';
import { useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '@/hooks/mutations/useUserMutations';
import { useQueryClient } from '@tanstack/react-query';
import type { User, UserRole } from '@/types';
import { Plus, Search, Mail, Phone, Building2, Shield, Edit2, Trash2 } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/helper';

const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800',
  architect: 'bg-blue-100 text-blue-800',
  engineer: 'bg-green-100 text-green-800',
  project_manager: 'bg-purple-100 text-purple-800',
  client: 'bg-gray-100 text-gray-800',
};

const Users = () => {
  const ITEMS_PER_PAGE = 15;
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'project_manager' as UserRole,
    company: '',
    phone_number: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Fetch all users (large perPage to get everything)
  const { data: usersData, isLoading, error } = useUsers(1, 1000);
  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const usersResponse = usersData as any;
  const normalizedUsersData = usersResponse?.data && !Array.isArray(usersResponse?.data) ? usersResponse.data : usersResponse;
  const allUsers = Array.isArray(normalizedUsersData?.data) ? normalizedUsersData.data : [];

  // Apply search and role filtering
  const filtered = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Calculate pagination on filtered results
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const roleOptions: Array<{ value: UserRole | 'all'; label: string }> = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'architect', label: 'Architect' },
    { value: 'engineer', label: 'Engineer' },
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'client', label: 'Client' },
  ];

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    try {
      await createUser.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        confirm_password: formData.confirm_password || undefined,
        role: formData.role,
        company: formData.company || undefined,
        phone_number: formData.phone_number || undefined,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'project_manager',
        company: '',
        phone_number: '',
      });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Success', description: 'User created successfully' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          company: formData.company || undefined,
          phone_number: formData.phone_number || undefined,
        },
      });

      setFormData({
        name: '',
        email: '',
        password: '',        confirm_password: '',        role: 'project_manager',
        company: '',
        phone_number: '',
      });
      setIsEditOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Success', description: 'User updated successfully' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      await deleteUserMutation.mutateAsync(deleteUser.id);
      setDeleteUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Success', description: 'User deleted successfully' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirm_password: '',
      role: user.role,
      company: user.company || '',
      phone_number: user.phone_number || '',
    });
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading users...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-destructive">Error loading users</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={() => {
          setFormData({
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            role: 'project_manager',
            company: '',
            phone_number: '',
          });
          setIsCreateOpen(true);
        }}>
          <Plus className="h-4 w-4" /> New User
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card animate-fade-in p-6">
        <div className="mb-6 space-y-4 sm:flex sm:gap-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <select
            value={selectedRole}
            onChange={e => {
              setSelectedRole(e.target.value as UserRole | 'all');
              setCurrentPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {roleOptions.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${roleColors[user.role]}`}>
                        <Shield className="h-3 w-3" />
                        {capitalizeFirstLetter(user.role.replace('_', ' '))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.company}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.phone_number || 'N/A'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser && !isEditOpen} onOpenChange={() => selectedUser && !isEditOpen && setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <DialogDescription>{selectedUser?.role.replace('_', ' ')}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {selectedUser.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {selectedUser.phone_number || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {selectedUser.company}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  {selectedUser.role.replace('_', ' ')}
                </div>
              </div>
              {selectedUser.email_verified_at && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Email Verified</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.email_verified_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Joined</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name *</label>
              <input
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirm_password}
                onChange={e => setFormData({...formData, confirm_password: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role *</label>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {roleOptions.filter(r => r.value !== 'all').map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company</label>
              <input
                placeholder="Company name"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                placeholder="+1 (555) 000-0000"
                value={formData.phone_number}
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name *</label>
              <input
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role *</label>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {roleOptions.filter(r => r.value !== 'all').map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Company</label>
              <input
                placeholder="Company name"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                placeholder="+1 (555) 000-0000"
                value={formData.phone_number}
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser} disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteUser?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 rounded-md bg-muted p-3">
            <div className="text-sm">
              <span className="font-semibold">Email:</span> {deleteUser?.email}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Role:</span> {deleteUser?.role.replace('_', ' ')}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Users;
