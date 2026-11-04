import { api } from 'shared/lib/axios';

import type { IGetTodosParams } from '../types/params';
import { todosResponseSchema, type ITodoResponse } from '../types/responses';

export const getTodos = async (
  params?: IGetTodosParams,
  signal?: AbortSignal,
): Promise<ITodoResponse[]> => {
  const response = await api.get('/todos', {
    params,
    signal,
  });

  return todosResponseSchema.parse(response.data);
};
