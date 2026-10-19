import { z } from 'zod';

type ValidationMessage = 'titleRequired';

/**
 * Built from a translator so error messages follow the active locale —
 * pass `useTranslations('todos.validation')` from a component.
 */
export const createTodoSchema = (t: (key: ValidationMessage) => string) =>
  z.object({
    title: z
      .string({ message: t('titleRequired') })
      .min(1, { message: t('titleRequired') }),
    completed: z.boolean().default(false),
  });

export type CreateTodoInput = z.infer<ReturnType<typeof createTodoSchema>>;
