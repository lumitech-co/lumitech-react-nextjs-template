import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, { message: 'Title is required' }),
  completed: z.boolean().default(false),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
