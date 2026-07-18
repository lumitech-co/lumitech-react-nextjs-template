import { api } from 'shared/lib/axios';

import { IUpdateTodoRequest } from '../types/payloads';

export const updateTodo = async (
  todoId: string,
  payload: Partial<IUpdateTodoRequest>,
): Promise<string> => {
  await api.put(`/todos/${todoId}`, payload);

  return 'Todo was updated';
};
