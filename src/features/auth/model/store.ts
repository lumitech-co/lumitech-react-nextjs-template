import { create } from 'zustand';

import { IUser } from 'shared/api';

interface IAuthStore {
  user: IUser | null;
  isAuthenticated: boolean;
  signIn: (user: IUser) => void;
  signOut: () => void;
}

export const useAuthStore = create<IAuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  signIn: user => set({ user, isAuthenticated: true }),
  signOut: () => set({ user: null, isAuthenticated: false }),
}));
