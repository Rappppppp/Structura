import { create } from 'zustand';
import type { Project, ProjectStatusData } from '@/types';
import { projects as mockProjects, projectStatusData as mockStatusData } from '@/data/mockData';

interface ProjectState {
  projects: Project[];
  statusData: ProjectStatusData[];
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  fetchProjects: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type ProjectStore = ProjectState & ProjectActions;

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: mockProjects,
  statusData: mockStatusData,
  isLoading: false,
  error: null,

  fetchProjects: () => {
    set({ isLoading: true, error: null });
    // API-ready: replace with async fetch
    set({ projects: mockProjects, statusData: mockStatusData, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectProjects = (state: ProjectStore) => state.projects;
export const selectActiveProjects = (state: ProjectStore) =>
  state.projects.filter((p) => p.status === 'active');
export const selectProjectById = (id: string) => (state: ProjectStore) =>
  state.projects.find((p) => p.id === id);
