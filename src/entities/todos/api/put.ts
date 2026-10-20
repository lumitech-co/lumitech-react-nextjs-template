import { api } from 'shared/lib/axios';

import type { IUpdateTodo } from '../types/payloads';
import type { ITodoResponse } from '../types/responses';

export const updateTodo = async (
  todoId: string,
  payload: Partial<IUpdateTodo>,
): Promise<ITodoResponse> => {
  const response = await api.put(`/todos/${todoId}`, payload);

  return response.data;
};
