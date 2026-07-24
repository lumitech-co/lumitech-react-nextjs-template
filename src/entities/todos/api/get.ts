import { api } from 'shared/lib/axios';

import { IGetTodosParams } from '../types/params';
import { ITodoResponse } from '../types/responses';

export const getTodos = async (
  params?: IGetTodosParams,
  signal?: AbortSignal,
): Promise<ITodoResponse[]> => {
  const response = await api.get('/todos', {
    params,
    signal,
  });

  return response.data;
};
