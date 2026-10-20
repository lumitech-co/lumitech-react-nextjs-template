import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants/query-keys';

import { createTodo } from '../api/post';
import { ICreateTodo } from '../types/payloads';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: (payload: ICreateTodo) => createTodo(payload),
  });
};
