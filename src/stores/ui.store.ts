import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  globalLoading: boolean;
  globalError: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  globalLoading: false,
  globalError: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setGlobalError: (error) => set({ globalError: error }),
}));

// Selectors
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectGlobalLoading = (state: UIStore) => state.globalLoading;
export const selectGlobalError = (state: UIStore) => state.globalError;
