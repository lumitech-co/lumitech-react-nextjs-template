import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { CreateTodoForm } from 'features/todos/ui/create-todo-form/create-todo-form';

import { server } from '../mocks/server';
import { renderWithProviders, screen, waitFor } from '../utils/render';

describe('CreateTodoForm', () => {
  it('blocks submit and shows a validation error for an empty title', async () => {
    const user = userEvent.setup();
    const onRequest = vi.fn();

    server.events.on('request:start', onRequest);

    renderWithProviders(<CreateTodoForm />);
    await user.click(screen.getByRole('button', { name: 'Create Todo' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(onRequest).not.toHaveBeenCalled();

    server.events.removeListener('request:start', onRequest);
  });

  it('posts the form values and resets the form', async () => {
    const user = userEvent.setup();

    let body: unknown;

    server.use(
      http.post('http://api.test/todos', async ({ request }) => {
        body = await request.json();

        return HttpResponse.json({ id: 201 }, { status: 201 });
      }),
    );

    renderWithProviders(<CreateTodoForm />);

    const title = screen.getByLabelText('Title');

    await user.type(title, 'buy bread');
    await user.click(screen.getByLabelText('Completed'));
    await user.click(screen.getByRole('button', { name: 'Create Todo' }));

    await waitFor(() => expect(title).toHaveValue(''));
    expect(body).toEqual({ userId: 1, title: 'buy bread', completed: true });
  });
});
