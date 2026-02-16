export type ProjectStatus = 'active' | 'review' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
  budget: number;
}

export interface ProjectStatusData {
  month: string;
  active: number;
  completed: number;
  onHold: number;
}
