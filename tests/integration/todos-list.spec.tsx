import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { TodosList } from 'features/todos/ui/todos-list/todos-list';

import { server } from '../mocks/server';
import { renderWithProviders, screen, waitFor } from '../utils/render';

describe('TodosList', () => {
  it('renders todos coming from the API', async () => {
    renderWithProviders(<TodosList />);

    expect(await screen.findByText('buy milk')).toBeInTheDocument();
    expect(screen.getByText('walk the dog')).toBeInTheDocument();
  });

  it('reflects completion state on the checkboxes', async () => {
    renderWithProviders(<TodosList />);

    await screen.findByText('buy milk');

    const [milk, dog] = screen.getAllByRole('checkbox');

    expect(milk).not.toBeChecked();
    expect(dog).toBeChecked();
  });

  it('shows an error state when the request fails', async () => {
    server.use(
      http.get(
        'http://api.test/todos',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderWithProviders(<TodosList />);

    expect(await screen.findByText('Error')).toBeInTheDocument();
  });

  it('renders no items when the API returns an empty array', async () => {
    server.use(http.get('http://api.test/todos', () => HttpResponse.json([])));

    renderWithProviders(<TodosList />);

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
