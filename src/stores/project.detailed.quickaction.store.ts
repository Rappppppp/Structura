import { create } from 'zustand';
import { QuickAction } from '@/types/quickaction';

interface QuickActionState {
    activeAction: QuickAction | null;
    setActiveAction: (action: QuickAction | null) => void;
}

export const useQuickActionStore = create<QuickActionState>((set) => ({
    activeAction: null,
    setActiveAction: (action) => set({ activeAction: action }),
}));