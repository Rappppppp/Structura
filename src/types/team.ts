export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  projects: number;
}

export interface TeamMemberDetailed {
  id: number;
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  projects: number;
  assignedProjects: string[];
}
