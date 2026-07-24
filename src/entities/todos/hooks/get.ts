import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from 'shared/constants/query-keys';

import { getTodos } from '../api/get';
import { IGetTodosParams } from '../types/params';

export const useGetTodos = (params?: IGetTodosParams) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODOS, params],
    queryFn: ({ signal }) => getTodos(params, signal),
  });
};
