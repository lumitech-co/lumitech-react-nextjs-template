import { useGetLatestRun } from 'entities';

import { useAuthStore } from 'features';

export const useAppShellBootstrap = () => {
  const isUserLoading = useAuthStore(state => state.isUserLoading);
  const { isLoading: isLatestRunLoading } = useGetLatestRun();

  return {
    isInitialLoading: isUserLoading || isLatestRunLoading,
  };
};
