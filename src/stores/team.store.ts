import { create } from 'zustand';
import type { TeamMember, TeamMemberDetailed } from '@/types';
import { teamMembers as mockTeamMembers, teamMembersDetailed as mockDetailed } from '@/data/mockData';

interface TeamState {
  members: TeamMember[];
  detailedMembers: TeamMemberDetailed[];
  isLoading: boolean;
  error: string | null;
}

interface TeamActions {
  fetchMembers: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type TeamStore = TeamState & TeamActions;

export const useTeamStore = create<TeamStore>((set) => ({
  members: mockTeamMembers,
  detailedMembers: mockDetailed,
  isLoading: false,
  error: null,

  fetchMembers: () => {
    set({ isLoading: true, error: null });
    set({ members: mockTeamMembers, detailedMembers: mockDetailed, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectMembers = (state: TeamStore) => state.members;
export const selectDetailedMembers = (state: TeamStore) => state.detailedMembers;
