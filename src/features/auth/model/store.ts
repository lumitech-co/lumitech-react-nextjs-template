import { create } from 'zustand';

import { authApi } from 'shared/api';
import { tokenStorage } from 'shared/lib';

interface IAuthStore {
  isAuthenticated: boolean;
  signIn: (accessToken: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<IAuthStore>(set => ({
  isAuthenticated: tokenStorage.get() !== null,
  signIn: accessToken => {
    tokenStorage.set(accessToken);
    set({ isAuthenticated: true });
  },
  signOut: () => {
    authApi.logout().catch(() => {});
    tokenStorage.clear();
    set({ isAuthenticated: false });
  },
}));
