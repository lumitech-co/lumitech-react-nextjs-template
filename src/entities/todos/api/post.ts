import { api } from 'shared/lib/axios';

import { ICreateTodo } from '../types/payloads';
import { ITodoResponse } from '../types/responses';

export const createTodo = async (
  payload: ICreateTodo,
): Promise<ITodoResponse> => {
  const response = await api.post('/todos', payload);

  return response.data;
};
