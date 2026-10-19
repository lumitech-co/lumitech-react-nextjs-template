'use client';

import { useTranslations } from 'next-intl';

import { useGetTodos } from 'entities/todos/hooks/get';

import { Todo } from '../todo/todo';

export const TodosList = () => {
  const t = useTranslations('todos.list');
  const { data, isLoading, isError } = useGetTodos({
    _page: 1,
    _limit: 10,
  });

  if (isLoading) {
    return <p>{t('loading')}</p>;
  }

  if (isError) {
    return <p>{t('error')}</p>;
  }

  if (!data) {
    return <p>{t('empty')}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.map(todo => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
