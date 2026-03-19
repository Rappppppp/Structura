import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { useClients } from '@/hooks/queries/useClients';
import { useCreateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Projects = () => {
  const [search, setSearch] = useState('');
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    budget: '',
    deadline_at: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: projectsData, isLoading, error } = useProjects(undefined, 1, 100);
  const { data: clientsData } = useClients(1, 100);
  const createProject = useCreateProjectMutation();
  
  // Extract projects array - handle both response structures
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
  
  const filtered = Array.isArray(projects) ? projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const handleCreateProject = async () => {
    if (!formData.name || !formData.client_id || !formData.budget || !formData.deadline_at) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      await createProject.mutateAsync({
        name: formData.name,
        client_id: formData.client_id,
        budget: parseFloat(formData.budget),
        deadline_at: formData.deadline_at,
        status: 'active'
      });
      
      setFormData({ name: '', client_id: '', budget: '', deadline_at: '' });
      setNewProjectOpen(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project created successfully' });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create project',
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your architecture projects</p>
        </div>
        <Button onClick={() => setNewProjectOpen(true)}>
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card animate-fade-in">
        <div className="border-b border-border p-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.client}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.deadline}</td>
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
      </div>

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new architecture project to your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Project Name *</label>
              <input 
                placeholder="e.g. Central Park Tower" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" 
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Client *</label>
              <select
                value={formData.client_id}
                onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Budget (₱) *</label>
                <input 
                  type="number" 
                  placeholder="5000000" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Deadline *</label>
                <input 
                  type="date" 
                  value={formData.deadline_at}
                  onChange={e => setFormData({...formData, deadline_at: e.target.value})}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Projects;
