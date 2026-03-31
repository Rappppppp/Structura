/**
 * Attendance UI Store
 * Manages UI state for attendance page
 */

import { create } from 'zustand';

interface AttendanceUIStore {
  // Filters and selectors
  selectedScope: 'global' | 'project' | 'team' | null;
  selectedProjectId: string | null;
  selectedTeamId: string | null;

  // UI state
  isCheckingIn: boolean;
  showCameraPreview: boolean;
  capturedPhoto: string | null;

  // Setters
  setSelectedScope: (scope: 'global' | 'project' | 'team' | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedTeamId: (id: string | null) => void;
  setIsCheckingIn: (isChecking: boolean) => void;
  setShowCameraPreview: (show: boolean) => void;
  setCapturedPhoto: (photo: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedScope: null,
  selectedProjectId: null,
  selectedTeamId: null,
  isCheckingIn: false,
  showCameraPreview: false,
  capturedPhoto: null,
};

export const useAttendanceStore = create<AttendanceUIStore>((set) => ({
  ...initialState,

  setSelectedScope: (scope) => set({ selectedScope: scope }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setIsCheckingIn: (isChecking) => set({ isCheckingIn: isChecking }),
  setShowCameraPreview: (show) => set({ showCameraPreview: show }),
  setCapturedPhoto: (photo) => set({ capturedPhoto: photo }),

  reset: () => set(initialState),
}));
