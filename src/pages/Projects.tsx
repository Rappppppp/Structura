import { useState } from 'react';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { useClients } from '@/hooks/queries/useClients';
import { useCreateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useUsersDropdown } from '@/hooks/queries/useProjectTeam';
import { projectTeamService } from '@/api/project-team.service';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Eye, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BaseRole } from '@/types/team';
import { TablePagination } from '@/components/TablePagination';
import { useToast } from '@/hooks/use-toast';

const Projects = () => {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState('');
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.data?.user;
  const [currentPage, setCurrentPage] = useState(1);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client_ids: [] as string[],
    budget: '',
    deadline_at: ''
  });
  const [teamAssignments, setTeamAssignments] = useState<
    Array<{ user_id: string; base_role: BaseRole; specialty_role?: string }>
  >([]);
  const [newAssignment, setNewAssignment] = useState({
    user_id: '',
    base_role: 'member' as BaseRole,
    specialty_role: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: projectsData } = useProjects(undefined, 1, 1000);
  const { data: clientsData } = useClients(1, 100);
  const { data: usersData } = useUsersDropdown();
  const createProject = useCreateProjectMutation();

  // Extract arrays
  const allProjects = Array.isArray(projectsData?.data) ? projectsData.data : [];
  const clients = Array.isArray(clientsData?.data) ? clientsData.data : [];
  const users = usersData?.data || [];

  // Filter projects
  const filtered = allProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients && p.clients.some((c) => c.name.toLowerCase().includes(search.toLowerCase())))
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProjects = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateProject = async () => {
    if (!formData.name || !formData.budget || !formData.deadline_at || formData.client_ids.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and select at least one client',
        variant: 'destructive'
      });
      return;
    }

    try {
      const created = await createProject.mutateAsync({
        name: formData.name,
        client_ids: formData.client_ids,
        budget: parseFloat(formData.budget),
        deadline_at: formData.deadline_at,
        status: 'active'
      });

      const projectId = created?.data?.id;
      if (!projectId) throw new Error('Project ID not returned');

      if (teamAssignments.length > 0) {
        await Promise.all(
          teamAssignments.map((assignment) =>
            projectTeamService.add(String(projectId), {
              user_id: assignment.user_id,
              base_role: assignment.base_role,
              specialty_role: assignment.specialty_role
            })
          )
        );
      }

      toast({ title: 'Success', description: 'Project created successfully' });
      setNewProjectOpen(false);
      queryClient.invalidateQueries(['projects'] as unknown as any);
      setFormData({ name: '', client_ids: [], budget: '', deadline_at: '' });
      setTeamAssignments([]);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create project', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your architecture projects</p>
        </div>
        {currentUser?.role !== 'client' && (
          <Button onClick={() => setNewProjectOpen(true)}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project ID</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deadline</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{p.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.clients?.map((c) => c.name).join(', ')}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{p.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(p.deadline)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
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

      {/* New Project Dialog */}
      {currentUser?.role !== 'client' && (
        <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
          <DialogContent className="max-w-2xl border border-border/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Add a new architecture project to your portfolio.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Project Name *</label>
                <input
                  placeholder="e.g. Central Park Tower"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Clients */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Select Clients *</label>
                  {formData.client_ids.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {formData.client_ids.length} selected
                    </span>
                  )}
                </div>
                <div className="border border-input rounded-md bg-background/50 p-3 space-y-2 max-h-48 overflow-y-auto">
                  {clients.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No clients available</p>
                  ) : (
                    clients.map((client) => (
                      <label key={client.id} className="flex items-center gap-3 cursor-pointer hover:bg-background/80 p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.client_ids.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, client_ids: [...formData.client_ids, client.id] });
                            } else {
                              setFormData({ ...formData, client_ids: formData.client_ids.filter((id) => id !== client.id) });
                            }
                          }}
                          className="rounded border-input cursor-pointer accent-primary"
                        />
                        <span className="text-sm text-foreground font-medium flex-1">{client.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Budget (₱) *</label>
                  <input
                    type="number"
                    placeholder="5000000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline_at}
                    onChange={(e) => setFormData({ ...formData, deadline_at: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Team Assignments */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Team Members (optional)</h3>
                  {teamAssignments.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {teamAssignments.length} added
                    </span>
                  )}
                </div>

                {/* Add Team Member */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <select
                      value={newAssignment.user_id}
                      onChange={(e) => setNewAssignment({ ...newAssignment, user_id: e.target.value })}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all col-span-1 sm:col-span-2"
                    >
                      <option value="">Select user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>

                    <select
                      value={newAssignment.base_role}
                      onChange={(e) => setNewAssignment({ ...newAssignment, base_role: e.target.value as BaseRole })}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>

                    <select
                      value={newAssignment.specialty_role}
                      onChange={(e) => setNewAssignment({ ...newAssignment, specialty_role: e.target.value })}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:col-span-1"
                    >
                      <option value="">Specialty...</option>
                      <option value="architect">Architect</option>
                      <option value="engineer">Engineer</option>
                      <option value="pm">PM</option>
                      <option value="bim">BIM</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-10"
                    onClick={() => {
                      if (!newAssignment.user_id || !newAssignment.base_role) return;
                      if (teamAssignments.some((a) => a.user_id === newAssignment.user_id)) return;
                      setTeamAssignments([...teamAssignments, newAssignment]);
                      setNewAssignment({ user_id: '', base_role: 'member', specialty_role: '' });
                    }}
                  >
                    Add Member
                  </Button>
                </div>

                {/* Team List */}
                {teamAssignments.length > 0 && (
                  <div className="space-y-2">
                    {teamAssignments.map((assignment) => {
                      const selectedUser = users.find((u) => u.id === assignment.user_id);
                      return (
                        <div key={assignment.user_id} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted/30 transition-all">
                          <div className="flex-1">
                            <p className="text-foreground font-medium">{selectedUser?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {assignment.base_role}{assignment.specialty_role ? ` • ${assignment.specialty_role}` : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTeamAssignments(teamAssignments.filter((item) => item.user_id !== assignment.user_id))}
                            className="ml-2 text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateProject} disabled={createProject.isPending}>
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Projects;