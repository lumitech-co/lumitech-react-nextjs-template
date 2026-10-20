import { Suspense } from 'react';

import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getTodos } from 'entities/todos/api/get';
import type { IGetTodosParams } from 'entities/todos/types/params';

import { CreateTodoForm } from 'features/todos/ui/create-todo-form/create-todo-form';
import { TodosList } from 'features/todos/ui/todos-list/todos-list';
import { QueryKeys } from 'shared/constants/query-keys';
import { getQueryClient } from 'shared/lib/query';

const todosParams: IGetTodosParams = {
  _page: 1,
  _limit: 10,
};

type Props = {
  params: { locale: Locale };
};

const HomePage = async ({ params }: Props) => {
  setRequestLocale(params.locale);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_TODOS, todosParams],
    queryFn: () => getTodos(todosParams),
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
