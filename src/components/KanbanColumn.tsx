import { Task, TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  title: string;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: TaskStatus) => void;
  children: React.ReactNode;
}

const COLUMN_ICONS: Record<TaskStatus, string> = {
  todo: '📋',
  'in-progress': '🔄',
  done: '✅',
};

export const KanbanColumn = ({
  status,
  tasks,
  title,
  onDragOver,
  onDrop,
  children,
}: KanbanColumnProps) => {
  const taskCount = tasks.length;

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, status)}
      className="flex flex-col w-full min-h-96 bg-muted/30 rounded-md border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-0">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <span>{COLUMN_ICONS[status]}</span>
            <span>{title}</span>
            <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {taskCount}
            </span>
          </h3>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {children}
      </div>
    </div>
  );
};
