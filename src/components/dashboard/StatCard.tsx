import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
}

const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon }: StatCardProps) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  }[changeType];

  const bgColors = {
    positive: 'from-success/20 to-success/5',
    negative: 'from-destructive/20 to-destructive/5',
    neutral: 'from-primary/20 to-primary/5',
  };

  const iconColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-primary',
  };

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-md hover:shadow-lg hover:border-border transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p className={`mt-2 text-sm font-semibold ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${bgColors[changeType]} border border-${iconColors[changeType]}/20`}>
          <Icon className={`h-7 w-7 ${iconColors[changeType]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
