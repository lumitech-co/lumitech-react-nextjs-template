import { Suspense } from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { CreateTodoForm, TodosList } from 'features';
import { todosApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { IGetTodosRequest } from 'shared/types';

const params: IGetTodosRequest = {
  _page: 1,
  _limit: 10,
};

const HomePage = async () => {
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_TODOS, params],
    queryFn: () => todosApi.getTodos(params),
  });

  return (
    <main className="p-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <TodosList />
        </Suspense>
      </HydrationBoundary>
      <hr className="my-5" />
      <CreateTodoForm />
    </main>
  );
};

export default HomePage;
