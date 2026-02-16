const statusStyles = {
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  review: 'bg-warning/10 text-warning border-warning/20',
  'on-hold': 'bg-muted text-muted-foreground border-border',
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

type StatusType = keyof typeof statusStyles;

const StatusBadge = ({ status }: { status: StatusType }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
    {status.replace('-', ' ')}
  </span>
);

export default StatusBadge;
