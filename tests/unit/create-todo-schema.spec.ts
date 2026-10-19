import { describe, expect, it } from 'vitest';

import { createTodoSchema as buildSchema } from 'features/todos/schemas/validation';

const createTodoSchema = buildSchema(key => key);

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
    expect(result.error?.issues[0].message).toBe('titleRequired');
  });

  it('rejects a missing title', () => {
    expect(createTodoSchema.safeParse({}).success).toBe(false);
  });
});
