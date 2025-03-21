import { FC } from 'react';

import { useUpdateTodo } from 'shared/hooks';
import { cn } from 'shared/lib';
import { ITodoResponse } from 'shared/types';

interface IProps {
  todo: ITodoResponse;
}

export const Todo: FC<IProps> = ({ todo }) => {
  const { mutate: updateTodo, isPending } = useUpdateTodo();

  const handleToggleCompletion = () => {
    updateTodo({ todoId: todo.id.toString(), completed: !todo.completed });
  };

  return (
    <li
      key={todo.id}
      className={cn(
        'flex cursor-pointer gap-2 first-letter:uppercase',
        todo.completed && 'line-through',
        isPending && 'cursor-progress',
      )}
    >
      <input
        type="checkbox"
        disabled={isPending}
        onChange={handleToggleCompletion}
        checked={todo.completed}
      />
      {todo.title}
    </li>
  );
};
