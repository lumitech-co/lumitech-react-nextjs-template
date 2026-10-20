'use client';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTodo } from 'entities/todos/hooks/post';
import { useForm } from 'react-hook-form';

import { cn } from 'shared/lib/styles';

import {
  createTodoSchema,
  type CreateTodoInput,
} from '../../schemas/validation';

export const CreateTodoForm = () => {
  const t = useTranslations('todos.form');
  const tValidation = useTranslations('todos.validation');
  const { mutate: createTodo, isPending } = useCreateTodo();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema(tValidation)),
    defaultValues: {
      title: '',
      completed: false,
    },
  });

  const { errors } = form.formState;

  const handleSubmit = (values: CreateTodoInput) => {
    createTodo({ userId: 1, ...values }, { onSuccess: () => form.reset() });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex max-w-[600px] flex-col gap-6"
    >
      <h1>{t('heading')}</h1>
      <fieldset className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className={cn(
              'text-sm font-medium',
              errors.title && 'text-red-800',
            )}
          >
            {t('title')}
          </label>
          <input
            id="title"
            {...form.register('title')}
            placeholder={t('titlePlaceholder')}
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
            {t('completed')}
          </label>
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        {isPending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
};
