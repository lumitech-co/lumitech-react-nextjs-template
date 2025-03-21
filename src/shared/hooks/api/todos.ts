import { useMutation, useQuery } from '@tanstack/react-query';

import { todosApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import {
  ICreateTodoRequest,
  IGetTodosRequest,
  IUpdateTodoRequest,
} from 'shared/types';

export const useGetTodos = (params?: IGetTodosRequest) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODOS, params],
    queryFn: ({ signal }) => todosApi.getTodos(params, signal),
  });
};

export const useUpdateTodo = () => {
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: ({
      todoId,
      ...payload
    }: Partial<IUpdateTodoRequest> & { todoId: string }) =>
      todosApi.updateTodo(todoId, payload),
  });
};

export const useCreateTodo = () => {
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TODOS] });
    },
    mutationFn: (payload: ICreateTodoRequest) => todosApi.createTodo(payload),
  });
};
