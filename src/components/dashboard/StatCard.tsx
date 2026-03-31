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
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-2 text-4xl font-bold text-card-foreground group-hover:text-primary transition-colors">{value}</p>
          {change && (
            <p className={`mt-3 text-sm font-semibold ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${bgColors[changeType]} border border-${iconColors[changeType]}/20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-8 w-8 ${iconColors[changeType]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
