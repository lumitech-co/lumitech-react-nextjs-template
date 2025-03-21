'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateTodo } from 'shared/hooks';
import { cn } from 'shared/lib';

import { CreateTodoInput, createTodoSchema } from '../../lib';

export const CreateTodoForm = () => {
  const { mutate: createTodo, isPending } = useCreateTodo();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      completed: false,
    },
  });

  const { errors } = form.formState;

  const handleSubmit = (values: CreateTodoInput) => {
    createTodo(
      { id: Date.now(), userId: Date.now(), ...values },
      { onSuccess: () => form.reset() },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex max-w-[600px] flex-col gap-6"
    >
      <h1>Create todo form</h1>
      <fieldset className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className={cn(
              'text-sm font-medium',
              errors.title && 'text-red-800',
            )}
          >
            Title
          </label>
          <input
            id="title"
            {...form.register('title')}
            placeholder="Enter title"
            className={cn(
              'rounded border border-gray-300 p-2',
              errors.title &&
                'border-red-300 bg-red-50 text-red-800 placeholder:text-red-800',
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-800">{errors.title?.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="completed"
            {...form.register('completed')}
            className="h-4 w-4"
          />
          <label htmlFor="completed" className="text-sm">
            Completed
          </label>
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        {isPending ? 'Loading...' : 'Create Todo'}
      </button>
    </form>
  );
};
