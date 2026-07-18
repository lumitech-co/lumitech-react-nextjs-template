'use client';

import { useGetTodos } from 'entities/todos/hooks/get';

import { Todo } from '../todo/todo';

export const TodosList = () => {
  const { data, isLoading, isError } = useGetTodos({
    _page: 1,
    _limit: 10,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  if (!data) {
    return <p>Empty list</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.map(todo => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
