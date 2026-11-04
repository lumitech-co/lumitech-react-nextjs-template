import { z } from 'zod';

export const todoResponseSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export const todosResponseSchema = z.array(todoResponseSchema);

/** The API echoes back only the fields a PUT sent, plus the id. */
export const updatedTodoResponseSchema = todoResponseSchema
  .partial()
  .required({ id: true });

export type ITodoResponse = z.infer<typeof todoResponseSchema>;
export type IUpdatedTodoResponse = z.infer<typeof updatedTodoResponseSchema>;
