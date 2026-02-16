import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/stores/team.store';
import { Users, Mail, Phone, FolderKanban, Plus, Search, Filter } from 'lucide-react';

const roleColors: Record<string, string> = {
  'Lead Architect': 'bg-info/10 text-info',
  'Structural Engineer': 'bg-warning/10 text-warning',
  'Interior Designer': 'bg-primary/10 text-primary',
  'Project Manager': 'bg-success/10 text-success',
  'MEP Engineer': 'bg-destructive/10 text-destructive',
  'Civil Engineer': 'bg-secondary/10 text-secondary-foreground',
  'Landscape Architect': 'bg-info/10 text-info',
  'BIM Specialist': 'bg-primary/10 text-primary',
};

const Teams = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const detailedMembers = useTeamStore((s) => s.detailedMembers);

  const roles = ['All', ...Array.from(new Set(detailedMembers.map(m => m.role)))];

  const filtered = detailedMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">{detailedMembers.length} team members across all projects</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(member => (
          <Card key={member.id} className="animate-fade-in hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {member.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base truncate">{member.name}</CardTitle>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[member.role] || 'bg-muted text-muted-foreground'}`}>
                    {member.role}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderKanban className="h-3.5 w-3.5 shrink-0" />
                <span>{member.projects} active projects</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {member.assignedProjects.map(p => (
                  <span key={p} className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{p}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mb-3" />
          <p className="text-sm font-medium">No team members found</p>
          <p className="text-xs">Try adjusting your search or filter</p>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a new member to join your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="John Doe" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input type="email" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="john@structura.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Lead Architect</option>
                <option>Structural Engineer</option>
                <option>Interior Designer</option>
                <option>Project Manager</option>
                <option>MEP Engineer</option>
                <option>Civil Engineer</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast({ title: 'Invitation Sent', description: 'Team member has been invited via email.' }); }}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Teams;
