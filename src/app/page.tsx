import { Suspense } from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getTodos } from 'entities/todos/api/get';
import { IGetTodosParams } from 'entities/todos/types/params';

import { CreateTodoForm } from 'features/todos/ui/create-todo-form/create-todo-form';
import { TodosList } from 'features/todos/ui/todos-list/todos-list';
import { QueryKeys } from 'shared/constants/query-keys';
import { queryClient } from 'shared/lib/query';

const params: IGetTodosParams = {
  _page: 1,
  _limit: 10,
};

const HomePage = async () => {
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_TODOS, params],
    queryFn: () => getTodos(params),
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
