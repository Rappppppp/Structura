import { create } from 'zustand';
import type { Client } from '@/types';
import { clients as mockClients } from '@/data/mockData';

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
}

interface ClientActions {
  fetchClients: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ClientStore = ClientState & ClientActions;

export const useClientStore = create<ClientStore>((set) => ({
  clients: mockClients,
  isLoading: false,
  error: null,

  fetchClients: () => {
    set({ isLoading: true, error: null });
    set({ clients: mockClients, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const selectClients = (state: ClientStore) => state.clients;
export const selectActiveClients = (state: ClientStore) =>
  state.clients.filter((c) => c.status === 'active');
