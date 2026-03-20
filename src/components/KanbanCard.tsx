import { Task, TaskStatus } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onClick?: () => void;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-muted/20 text-muted-foreground',
  'in-progress': 'bg-primary/20 text-primary',
  done: 'bg-success/20 text-success',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-destructive/20 text-destructive',
  medium: 'bg-warning/20 text-warning',
  low: 'bg-success/20 text-success',
};

export const KanbanCard = ({ task, onDragStart, onClick }: KanbanCardProps) => {
  const isOverdue = task.due_at && new Date(task.due_at) < new Date();

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onClick={onClick}
      className="p-3 mb-3 cursor-move hover:shadow-md transition-all duration-200 bg-card hover:bg-muted/50"
    >
      <div className="space-y-2">
        {/* Title */}
        <h4 className="text-sm font-semibold text-foreground line-clamp-2">
          {task.title}
        </h4>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className={cn(PRIORITY_COLORS[task.priority])}>
            {task.priority}
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {/* Due Date */}
          {task.due_at && (
            <div className={cn('flex items-center gap-1 text-xs', isOverdue ? 'text-destructive' : 'text-muted-foreground')}>
              {isOverdue && <AlertCircle className="h-3 w-3" />}
              {!isOverdue && <Calendar className="h-3 w-3" />}
              <span>{new Date(task.due_at).toLocaleDateString()}</span>
            </div>
          )}

          {/* Assignee Avatar */}
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </Card>
  );
};
