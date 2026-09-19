import { http, HttpResponse } from 'msw';

import { ITodoResponse } from 'entities/todos/types/responses';

export const todosFixture: ITodoResponse[] = [
  { userId: 1, id: 1, title: 'buy milk', completed: false },
  { userId: 1, id: 2, title: 'walk the dog', completed: true },
];

export const handlers = [
  http.get('http://api.test/todos', () => HttpResponse.json(todosFixture)),

  http.post('http://api.test/todos', async ({ request }) => {
    const payload = (await request.json()) as Omit<ITodoResponse, 'id'>;

    return HttpResponse.json({ ...payload, id: 201 }, { status: 201 });
  }),

  http.put('http://api.test/todos/:todoId', async ({ params, request }) => {
    const payload = (await request.json()) as Partial<ITodoResponse>;

    return HttpResponse.json({ ...payload, id: Number(params.todoId) });
  }),
];
