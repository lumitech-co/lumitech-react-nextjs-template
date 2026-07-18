import { useMutation } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants/query-keys';
import { queryClient } from 'shared/lib/query';

import { updateTodo } from '../api/put';
import { IUpdateTodoRequest } from '../types/payloads';

export const useUpdateTodo = () => {
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: ({
      todoId,
      ...payload
    }: Partial<IUpdateTodoRequest> & { todoId: string }) =>
      updateTodo(todoId, payload),
  });
};
