import { create } from 'zustand';

import { authApi, IUser, usersApi } from 'shared/api';
import { tokenStorage } from 'shared/lib';

interface IAuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  isUserLoading: boolean;
  signIn: (accessToken: string) => void;
  signOut: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  isAuthenticated: tokenStorage.get() !== null,
  user: null,
  isUserLoading: tokenStorage.get() !== null,

  signIn: accessToken => {
    tokenStorage.set(accessToken);
    set({ isAuthenticated: true, isUserLoading: true });
    get().fetchUser();
  },

  signOut: () => {
    authApi.logout().catch(() => {});
    tokenStorage.clear();
    set({ isAuthenticated: false, user: null, isUserLoading: false });
  },

  fetchUser: async () => {
    set({ isUserLoading: true });

    try {
      const response = await usersApi.getMe();

      set({ user: response.data });
    } catch {
      get().signOut();
    } finally {
      set({ isUserLoading: false });
    }
  },
}));
