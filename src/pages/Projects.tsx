import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { useClients } from '@/hooks/queries/useClients';
import { useCreateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useUsersDropdown } from '@/hooks/queries/useProjectTeam';
import { projectTeamService } from '@/api/project-team.service';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BaseRole, SpecialtyRole } from '@/types/team';
import { TablePagination } from '@/components/TablePagination';
import { useToast } from '@/hooks/use-toast';

const Projects = () => {
  const ITEMS_PER_PAGE = 10;
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client_ids: [] as string[],
    budget: '',
    deadline_at: ''
  });
  const [teamAssignments, setTeamAssignments] = useState<Array<{ user_id: string; base_role: BaseRole; specialty_role?: string }>>([]);
  const [newAssignment, setNewAssignment] = useState({ user_id: '', base_role: 'member' as BaseRole, specialty_role: '' });
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all projects (large perPage to get everything)
  const { data: projectsData, isLoading, error } = useProjects(undefined, 1, 1000);
  const { data: clientsData } = useClients(1, 100);
  const { data: usersData } = useUsersDropdown();
  const createProject = useCreateProjectMutation();
  
  // Extract projects array
  let allProjects = [];
  if (Array.isArray(projectsData)) {
    allProjects = projectsData;
  } else if (projectsData?.data && Array.isArray(projectsData.data)) {
    allProjects = projectsData.data;
  }

  // Apply search filter
  const filtered = allProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.clients && p.clients.some(c => c.name.toLowerCase().includes(search.toLowerCase())))
  );

  // Calculate pagination on filtered results
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProjects = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Extract clients and users
  let clients = [];
  if (Array.isArray(clientsData)) {
    clients = clientsData;
  } else if (clientsData?.data && Array.isArray(clientsData.data)) {
    clients = clientsData.data;
  }

  const users = usersData?.data || [];

  const handleCreateProject = async () => {
    if (!formData.name || formData.client_ids.length === 0 || !formData.budget || !formData.deadline_at) {
      toast({ title: 'Error', description: 'Please fill in all required fields and select at least one client', variant: 'destructive' });
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
      
      if (!projectId) {
        toast({ 
          title: 'Error', 
          description: 'Failed to get project ID from response',
          variant: 'destructive' 
        });
        return;
      }

      // Add team members if provided
      let teamErrorMessage = '';
      if (teamAssignments.length > 0) {
        try {
          await Promise.all(
            teamAssignments.map((assignment) =>
              projectTeamService.add(String(projectId), {
                user_id: assignment.user_id,
                base_role: assignment.base_role,
                specialty_role: assignment.specialty_role || undefined
              })
            )
          );
        } catch (teamErr: any) {
          // Log team member errors but don't block project creation
          teamErrorMessage = teamErr.response?.data?.message || 'Failed to add some team members';
          console.error('Team member assignment error:', teamErrorMessage);
        }
      }
      
      setFormData({ name: '', client_ids: [], budget: '', deadline_at: '' });
      setTeamAssignments([]);
      setNewAssignment({ user_id: '', base_role: 'member', specialty_role: '' });
      setNewProjectOpen(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      if (teamErrorMessage) {
        toast({ 
          title: 'Success', 
          description: `Project created but had issues adding team members: ${teamErrorMessage}`
        });
      } else {
        toast({ title: 'Success', description: 'Project created successfully' });
      }
    } catch (err: any) {
      console.error('Project creation error:', err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.errors?.client_ids?.[0] ||
                       err.message || 
                       'Failed to create project';
      toast({ 
        title: 'Error', 
        description: errorMsg,
        variant: 'destructive' 
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading projects...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-destructive">Error loading projects</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Projects</h1>
          <p className="text-base text-muted-foreground mt-2">Manage all your architecture projects</p>
        </div>
        <Button onClick={() => setNewProjectOpen(true)} className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-card shadow-md overflow-hidden animate-fade-in">
        <div className="border-b border-border/50 p-4 bg-gradient-to-r from-card/50 to-card/30">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects..."
              className="h-10 w-full rounded-lg border border-border/50 bg-background/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Project ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map(p => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{p.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {p.clients && p.clients.length > 0 
                      ? p.clients.map(c => c.name).join(', ')
                      : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.deadline}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
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
      </div>

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <DialogContent className="border border-border/50 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Project</DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new architecture project to your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Project Name *</label>
              <input 
                placeholder="e.g. Central Park Tower" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Clients * (select at least one)</label>
              <div className="border border-border/50 rounded-lg bg-background/50 p-3 space-y-2 max-h-40 overflow-y-auto">
                {clients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No clients available</p>
                ) : (
                  clients.map((client) => (
                    <label key={client.id} className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.client_ids.includes(client.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              client_ids: [...formData.client_ids, client.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              client_ids: formData.client_ids.filter(id => id !== client.id)
                            });
                          }
                        }}
                        className="rounded border-border/50 cursor-pointer"
                      />
                      <span className="text-sm text-foreground">{client.name}</span>
                    </label>
                  ))
                )}
              </div>
              {formData.client_ids.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">{formData.client_ids.length} client(s) selected</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Budget (₱) *</label>
                <input 
                  type="number" 
                  placeholder="5000000" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Deadline *</label>
                <input 
                  type="date" 
                  value={formData.deadline_at}
                  onChange={e => setFormData({...formData, deadline_at: e.target.value})}
                  className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all" 
                />
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/30 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Initial Team Members (optional)</p>
              <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                  <select
                    value={newAssignment.user_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, user_id: e.target.value })}
                    className="h-11 flex-1 rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                  >
                    <option value="">Select a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name} — {user.email}</option>
                    ))}
                  </select>
                  <select
                    value={newAssignment.base_role}
                    onChange={(e) => setNewAssignment({ ...newAssignment, base_role: e.target.value as BaseRole })}
                    className="h-11 flex-1 rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <select
                    value={newAssignment.specialty_role}
                    onChange={(e) => setNewAssignment({ ...newAssignment, specialty_role: e.target.value })}
                    className="h-11 flex-1 rounded-lg border border-border/50 bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                  >
                    <option value="">No specialty</option>
                    <option value="architect">Architect</option>
                    <option value="engineer">Engineer</option>
                    <option value="pm">Project Manager</option>
                    <option value="bim">BIM Specialist</option>
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border/50 h-11"
                    onClick={() => {
                      if (!newAssignment.user_id || !newAssignment.base_role) return;
                      if (teamAssignments.some((assignment) => assignment.user_id === newAssignment.user_id)) return;
                      setTeamAssignments([...teamAssignments, newAssignment]);
                      setNewAssignment({ user_id: '', base_role: 'member', specialty_role: '' });
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {teamAssignments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {teamAssignments.map((assignment) => {
                    const selectedUser = users.find((user) => user.id === assignment.user_id);
                    return (
                      <div key={assignment.user_id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-4 py-2 text-sm hover:bg-background/50 transition-colors">
                        <span className="text-foreground font-medium">{selectedUser?.name || assignment.user_id} — {assignment.base_role}{assignment.specialty_role ? ` (${assignment.specialty_role})` : ''}</span>
                        <button
                          type="button"
                          onClick={() => setTeamAssignments(teamAssignments.filter((item) => item.user_id !== assignment.user_id))}
                          className="text-muted-foreground hover:text-destructive transition-colors"
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
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleCreateProject} disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Projects;
