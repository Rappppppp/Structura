import { Badge } from '@/components/ui/badge';

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  status?: string;
  meta?: string;
}

const ProgressCard = ({
  title,
  subtitle,
  progress,
  color = 'blue',
  status,
  meta,
}: ProgressCardProps) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const badgeColorMap = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-card-foreground">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {status && (
          <Badge variant="secondary" className={`${badgeColorMap[color]} text-xs`}>
            {status}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-bold text-card-foreground">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {meta && <p className="text-xs text-muted-foreground mt-3">{meta}</p>}
    </div>
  );
};

export default ProgressCard;
