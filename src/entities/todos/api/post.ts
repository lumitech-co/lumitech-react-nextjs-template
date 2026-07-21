import { api } from 'shared/lib/axios';

import { ICreateTodo } from '../types/payloads';

export const createTodo = async (payload: ICreateTodo): Promise<string> => {
  await api.post('/todos', payload);

  return 'Todo was created';
};
