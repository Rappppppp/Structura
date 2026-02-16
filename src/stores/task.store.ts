import { create } from 'zustand';
import type { KanbanTask } from '@/types';
import { kanbanTasks as mockTasks } from '@/data/mockData';

interface TaskState {
  tasks: KanbanTask[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  fetchTasks: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type TaskStore = TaskState & TaskActions;

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: mockTasks,
  isLoading: false,
  error: null,

  fetchTasks: () => {
    set({ isLoading: true, error: null });
    set({ tasks: mockTasks, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectTasks = (state: TaskStore) => state.tasks;
export const selectTasksByStatus = (status: string) => (state: TaskStore) =>
  state.tasks.filter((t) => t.status === status);
