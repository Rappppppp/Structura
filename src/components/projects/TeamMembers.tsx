import { useState } from 'react';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useProjectTeam, useUsersDropdown } from '@/hooks/queries/useProjectTeam';
import { useAddProjectTeamMemberMutation, useRemoveProjectTeamMemberMutation } from '@/hooks/mutations/useProjectTeamMutations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Trash2, Users } from 'lucide-react';
import { BaseRole, SpecialtyRole } from '@/types/team';

const BASE_ROLES: BaseRole[] = ['admin', 'member', 'viewer'];
const SPECIALTY_ROLES: SpecialtyRole[] = ['architect', 'engineer', 'pm', 'bim'];

const baseRoleColors: Record<BaseRole, string> = {
  'admin': 'bg-red-100 text-red-700',
  'member': 'bg-blue-100 text-blue-700',
  'viewer': 'bg-gray-100 text-gray-700',
};

const specialtyRoleColors: Record<string, string> = {
  'architect': 'bg-purple-100 text-purple-700',
  'engineer': 'bg-yellow-100 text-yellow-700',
  'pm': 'bg-green-100 text-green-700',
  'bim': 'bg-indigo-100 text-indigo-700',
};

interface TeamMembersProps {
  projectId?: string;
}

const TeamMembers = ({ projectId }: TeamMembersProps) => {
  const { data: teamData, isLoading } = useProjectTeam(projectId);
  const { data: usersData, isLoading: loadingUsers } = useUsersDropdown();
  const addMember = useAddProjectTeamMemberMutation(projectId || '');
  const removeMember = useRemoveProjectTeamMemberMutation(projectId || '');
  const { toast } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ user_id: '', base_role: 'member' as BaseRole, specialty_role: '' });

  const members = teamData?.data || [];
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.data?.user;
  const allUsers = usersData?.data || [];

  // Filter out users already in the project team
  const memberIds = new Set(members.map(m => m.user.id));
  const availableUsers = allUsers.filter(u => !memberIds.has(u.id));

  const handleAdd = async () => {
    if (!form.user_id || !form.base_role) {
      toast({ title: 'Error', description: 'Please select a user and base role', variant: 'destructive' });
      return;
    }
    try {
      await addMember.mutateAsync({
        user_id: form.user_id,
        base_role: form.base_role,
        specialty_role: form.specialty_role || undefined,
      });
      setForm({ user_id: '', base_role: 'member', specialty_role: '' });
      setAddOpen(false);
      toast({ title: 'Success', description: 'Team member added to project' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to add team member',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (userId: string, name: string) => {
    try {
      await removeMember.mutateAsync(userId);
      toast({ title: 'Removed', description: `${name} removed from project` });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove team member', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading team...</div>;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Project Team</h3>
          <p className="text-sm text-muted-foreground">{members.length} member{members.length !== 1 ? 's' : ''} assigned</p>
        </div>
        {currentUser?.role !== 'client' && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-muted-foreground">
          <Users className="h-10 w-10 mb-2" />
          <p className="text-sm font-medium">No team members assigned</p>
          <p className="text-xs mt-1">Click "Add Member" to assign users to this project</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(m => (
            <div key={m.id} className="group rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {m.user.name.charAt(0)}{m.user.name.split(' ')[1]?.charAt(0) || ''}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-card-foreground truncate">{m.user.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${baseRoleColors[m.base_role]}`}>
                      {m.base_role}
                    </span>
                    {m.specialty_role && (
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${specialtyRoleColors[m.specialty_role] || 'bg-muted text-muted-foreground'}`}>
                        {m.specialty_role}
                      </span>
                    )}
                  </div>
                </div>
                {currentUser?.role !== 'client' && (
                  <button
                    onClick={() => handleRemove(m.user.id, m.user.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5"
                    title="Remove from project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{m.user.email}</span>
                </div>
                {m.user.phone_number && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{m.user.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentUser?.role !== 'client' && (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Assign a user to this project with a specific role.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">User *</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  value={form.user_id}
                  onChange={e => setForm({ ...form, user_id: e.target.value })}
                  disabled={loadingUsers}
                >
                  <option value="">{loadingUsers ? 'Loading users...' : 'Select a user...'}</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Base Role *</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  value={form.base_role}
                  onChange={e => setForm({ ...form, base_role: e.target.value as BaseRole })}
                >
                  {BASE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Specialty Role (Optional)</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  value={form.specialty_role}
                  onChange={e => setForm({ ...form, specialty_role: e.target.value })}
                >
                  <option value="">None</option>
                  {SPECIALTY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={addMember.isPending}>
                {addMember.isPending ? 'Adding...' : 'Add Team Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamMembers;
