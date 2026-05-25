import { useMutation } from '@tanstack/react-query';

import { filesApi } from 'shared/api';

export const useGetSignedUrl = () =>
  useMutation({
    mutationFn: (filePath: string) => filesApi.getSignedUrl(filePath),
  });
