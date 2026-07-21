import { useMutation } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants/query-keys';
import { queryClient } from 'shared/lib/query';

import { createTodo } from '../api/post';
import { ICreateTodo } from '../types/payloads';

export const useCreateTodo = () => {
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: (payload: ICreateTodo) => createTodo(payload),
  });
};
