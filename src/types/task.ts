export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface KanbanTask {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
}
