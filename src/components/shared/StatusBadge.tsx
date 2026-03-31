import { Check, Clock, AlertCircle, XCircle, Eye } from 'lucide-react';

const statusConfig = {
  active: {
    label: 'Active',
    styles: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    styles: 'bg-green-100 text-green-700 border-green-200',
    icon: Check,
  },
  review: {
    label: 'In Review',
    styles: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Eye,
  },
  'on-hold': {
    label: 'On Hold',
    styles: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock,
  },
  cancelled: {
    label: 'Cancelled',
    styles: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  paid: {
    label: 'Paid',
    styles: 'bg-green-100 text-green-700 border-green-200',
    icon: Check,
  },
  pending: {
    label: 'Pending',
    styles: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  overdue: {
    label: 'Overdue',
    styles: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

type StatusType = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
}

const StatusBadge = ({ status, showIcon = true }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.styles}`}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
