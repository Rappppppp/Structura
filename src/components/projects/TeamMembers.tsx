import { useTeamStore } from '@/stores/team.store';

const TeamMembers = () => {
  const members = useTeamStore((s) => s.members);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map(m => (
              <div key={m.name} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
  )
}

export default TeamMembers