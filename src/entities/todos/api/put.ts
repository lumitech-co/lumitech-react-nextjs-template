import { api } from 'shared/lib/axios';

import { IUpdateTodo } from '../types/payloads';

export const updateTodo = async (
  todoId: string,
  payload: Partial<IUpdateTodo>,
): Promise<string> => {
  await api.put(`/todos/${todoId}`, payload);

  return 'Todo was updated';
};
