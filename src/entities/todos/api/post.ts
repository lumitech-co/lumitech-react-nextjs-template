import { api } from 'shared/lib/axios';

import type { ICreateTodo } from '../types/payloads';
import { todoResponseSchema, type ITodoResponse } from '../types/responses';

export const createTodo = async (
  payload: ICreateTodo,
): Promise<ITodoResponse> => {
  const response = await api.post('/todos', payload);

  return todoResponseSchema.parse(response.data);
};
