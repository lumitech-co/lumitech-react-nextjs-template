import {
  todosResponseSchema,
  updatedTodoResponseSchema,
} from 'entities/todos/types/responses';
import { describe, expect, it } from 'vitest';

const todo = { userId: 1, id: 1, title: 'buy milk', completed: false };

describe('todo response schemas', () => {
  it('accepts a valid list', () => {
    expect(todosResponseSchema.parse([todo])).toEqual([todo]);
  });

  it('rejects a list with a wrong field type', () => {
    expect(() => todosResponseSchema.parse([{ ...todo, id: 'one' }])).toThrow();
  });

  it('accepts the partial body a PUT returns, but requires the id', () => {
    const partial = { completed: true, id: 1 };

    expect(updatedTodoResponseSchema.parse(partial)).toEqual(partial);
    expect(() =>
      updatedTodoResponseSchema.parse({ completed: true }),
    ).toThrow();
  });
});
