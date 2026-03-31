import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { TaskDetailModal } from './TaskDetailModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onCreateTask?: () => void;
  isLoading?: boolean;
}

const COLUMNS: Array<{ status: TaskStatus; title: string }> = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

export const KanbanBoard = ({
  tasks,
  onTaskStatusChange,
  onCreateTask,
  isLoading,
}: KanbanBoardProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, newStatus: TaskStatus) => {
      e.preventDefault();
      if (!draggedTaskId) return;

      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.status !== newStatus) {
        onTaskStatusChange?.(draggedTaskId, newStatus);
      }

      setDraggedTaskId(null);
    },
    [draggedTaskId, tasks, onTaskStatusChange]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
        <Button
          onClick={onCreateTask}
          className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ status, title }) => {
          const columnTasks = tasks.filter((task) => task.status === status);

          return (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columnTasks}
              title={title}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <p className="text-sm">No tasks yet</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onClick={() => setSelectedTask(task)}
                  />
                ))
              )}
            </KanbanColumn>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};
