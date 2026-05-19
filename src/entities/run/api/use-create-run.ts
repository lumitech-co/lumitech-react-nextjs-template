import { useMutation } from '@tanstack/react-query';

import { ICreateRunRequest, runsApi } from 'shared/api';

export const useCreateRun = () =>
  useMutation({
    mutationFn: (data: ICreateRunRequest) => runsApi.createRun(data),
  });
