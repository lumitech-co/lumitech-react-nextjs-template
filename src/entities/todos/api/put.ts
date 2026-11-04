import { api } from 'shared/lib/axios';

import type { IUpdateTodo } from '../types/payloads';
import {
  updatedTodoResponseSchema,
  type IUpdatedTodoResponse,
} from '../types/responses';

export const updateTodo = async (
  todoId: string,
  payload: Partial<IUpdateTodo>,
): Promise<IUpdatedTodoResponse> => {
  const response = await api.put(`/todos/${todoId}`, payload);

  return updatedTodoResponseSchema.parse(response.data);
};
