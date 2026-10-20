import { describe, expect, it } from 'vitest';

import { createTodoSchema } from 'features/todos/schemas/validation';

describe('createTodoSchema', () => {
  it('defaults completed to false', () => {
    expect(createTodoSchema.parse({ title: 'buy milk' })).toEqual({
      title: 'buy milk',
      completed: false,
    });
  });

  it('rejects an empty title', () => {
    const result = createTodoSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Title is required');
  });

  it('rejects a missing title', () => {
    expect(createTodoSchema.safeParse({}).success).toBe(false);
  });
});
