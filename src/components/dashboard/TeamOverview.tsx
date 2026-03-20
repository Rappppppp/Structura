export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status?: 'active' | 'away' | 'offline';
}

interface TeamOverviewProps {
  members: TeamMember[];
  maxDisplay?: number;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const TeamOverview = ({ members, maxDisplay = 8 }: TeamOverviewProps) => {
  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No team members</p>
      </div>
    );
  }

  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-wrap gap-4">
      {displayMembers.map((member) => (
        <div key={member.id} className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-background/50 transition-colors">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border/50 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:border-primary/30 transition-colors font-semibold text-primary text-sm">
              {getInitials(member.name)}
            </div>
            {member.status && (
              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-card-foreground">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center p-3 rounded-lg bg-background/50 border border-border/50 min-w-16">
          <p className="text-sm font-semibold text-muted-foreground">+{remainingCount}</p>
        </div>
      )}
    </div>
  );
};

export default TeamOverview;
