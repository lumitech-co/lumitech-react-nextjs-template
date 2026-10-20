import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants/query-keys';

import { updateTodo } from '../api/put';
import { IUpdateTodo } from '../types/payloads';

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: ({
      todoId,
      ...payload
    }: Partial<IUpdateTodo> & { todoId: string }) =>
      updateTodo(todoId, payload),
  });
};
