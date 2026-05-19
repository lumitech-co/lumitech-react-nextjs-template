import { create } from 'zustand';

import { IRunItem, runsApi } from 'shared/api';

interface IRunStore {
  activeRun: IRunItem | null;
  isLoading: boolean;
  fetchActiveRun: () => Promise<void>;
}

export const useRunStore = create<IRunStore>(set => ({
  activeRun: null,
  isLoading: false,

  fetchActiveRun: async () => {
    set({ isLoading: true });

    try {
      const response = await runsApi.getLatest();

      set({ activeRun: response.data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
