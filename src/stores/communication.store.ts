import { create } from 'zustand';
import type { ChatRoom, TimelineEvent } from '@/types';
import { chatRooms as mockChatRooms, timelineEvents as mockTimeline } from '@/data/mockData';

interface CommunicationState {
  chatRooms: ChatRoom[];
  timelineEvents: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
}

interface CommunicationActions {
  fetchChatRooms: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type CommunicationStore = CommunicationState & CommunicationActions;

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  chatRooms: mockChatRooms,
  timelineEvents: mockTimeline,
  isLoading: false,
  error: null,

  fetchChatRooms: () => {
    set({ isLoading: true, error: null });
    set({ chatRooms: mockChatRooms, timelineEvents: mockTimeline, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectChatRooms = (state: CommunicationStore) => state.chatRooms;
export const selectTimelineEvents = (state: CommunicationStore) => state.timelineEvents;
