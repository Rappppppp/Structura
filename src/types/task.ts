
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'structural' | 'architectural';
export type TaskSubCategory = 'masonry' | 'plumbing' | 'electrical' | 'finishing' | '';
export type TaskFinishingType = 'ceiling' | 'painting' | 'tiles' | 'fixtures' | 'facade' | 'roofing' | '';

export interface TaskAssignee {
  id: string;
  name: string;
}

export interface TaskProject {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  project: TaskProject;
  assignee?: TaskAssignee;
  assigned_to?: string;
  status: TaskStatus;
  priority: TaskPriority;
  work_percentage?: number;
  due_at?: string;
  created_at?: string;
  updated_at?: string;
  category?: TaskCategory;
  subCategory?: TaskSubCategory;
  finishingType?: TaskFinishingType;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeId?: string;
  workPercentage?: number;
  dueAt?: string;
  createdAt?: string;
  category?: TaskCategory;
  subCategory?: TaskSubCategory;
  finishingType?: TaskFinishingType;
}
