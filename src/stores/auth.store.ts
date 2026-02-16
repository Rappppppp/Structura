import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const roleNames: Record<UserRole, string> = {
  admin: 'Alex Morgan',
  architect: 'Sarah Chen',
  engineer: 'James Wilson',
  client: 'Michael Roberts',
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, _password, role) => {
    set({
      user: { email, name: roleNames[role], role },
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.user?.role;
