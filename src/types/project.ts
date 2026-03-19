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
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
}
