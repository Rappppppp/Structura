import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendCardProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  onClick?: () => void;
}

const TrendCard = ({
  title,
  value,
  trend,
  subtitle,
  icon: Icon,
  accentColor = 'blue',
  onClick,
}: TrendCardProps) => {
  const colorMap = {
    blue: {
      bg: 'from-blue-50 to-blue-5 dark:from-blue-900/20 dark:to-blue-900/5',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/50 dark:border-blue-800/50',
    },
    green: {
      bg: 'from-green-50 to-green-5 dark:from-green-900/20 dark:to-green-900/5',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200/50 dark:border-green-800/50',
    },
    orange: {
      bg: 'from-orange-50 to-orange-5 dark:from-orange-900/20 dark:to-orange-900/5',
      icon: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200/50 dark:border-orange-800/50',
    },
    red: {
      bg: 'from-red-50 to-red-5 dark:from-red-900/20 dark:to-red-900/5',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200/50 dark:border-red-800/50',
    },
    purple: {
      bg: 'from-purple-50 to-purple-5 dark:from-purple-900/20 dark:to-purple-900/5',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/50 dark:border-purple-800/50',
    },
  };

  const colors = colorMap[accentColor];
  const isTrendPositive = trend && trend > 0;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-6 shadow-sm hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/50 dark:bg-card/50 ${colors.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isTrendPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-sm font-semibold ${isTrendPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendCard;
