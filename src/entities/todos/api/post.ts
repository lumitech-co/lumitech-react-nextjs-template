import { api } from 'shared/lib/axios';

import { ICreateTodoRequest } from '../types/payloads';

export const createTodo = async (
  payload: ICreateTodoRequest,
): Promise<string> => {
  await api.post('/todos', payload);

  return 'Todo was created';
};
