import { create } from 'zustand';

import { authApi, IUser, usersApi } from 'shared/api';
import { tokenStorage } from 'shared/lib';

interface IAuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  signIn: (accessToken: string) => void;
  signOut: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  isAuthenticated: tokenStorage.get() !== null,
  user: null,

  signIn: accessToken => {
    tokenStorage.set(accessToken);
    set({ isAuthenticated: true });
    get().fetchUser();
  },

  signOut: () => {
    authApi.logout().catch(() => {});
    tokenStorage.clear();
    set({ isAuthenticated: false, user: null });
  },

  fetchUser: async () => {
    try {
      const response = await usersApi.getMe();

      set({ user: response.data });
    } catch {
      get().signOut();
    }
  },
}));
