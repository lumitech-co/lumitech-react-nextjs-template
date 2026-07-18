import { api } from 'shared/lib/axios';

import { IGetTodosRequest } from '../types/params';
import { ITodoResponse } from '../types/responses';

export const getTodos = async (
  params?: IGetTodosRequest,
  signal?: AbortSignal,
): Promise<ITodoResponse[]> => {
  const response = await api.get('/todos', {
    params,
    signal,
  });

  return response.data;
};
