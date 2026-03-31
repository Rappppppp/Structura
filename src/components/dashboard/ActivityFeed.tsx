import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  timestamp: Date | string;
  type: 'project' | 'task' | 'payment' | 'message' | 'update';
  actionUrl?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
}

const getActivityColor = (type: ActivityItem['type']) => {
  const colors = {
    project: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    task: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    payment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    message: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    update: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  };
  return colors[type];
};

const ActivityFeed = ({ items, maxItems = 6 }: ActivityFeedProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.slice(0, maxItems).map((item) => {
        const Icon = item.icon;
        const timestamp = typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp;
        const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

        const itemContent = (
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors duration-200 group">
            <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(item.type)}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{item.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
            </div>
          </div>
        );

        if (item.actionUrl) {
          return (
            <a key={item.id} href={item.actionUrl} className="block">
              {itemContent}
            </a>
          );
        }

        return (
          <div key={item.id}>
            {itemContent}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
