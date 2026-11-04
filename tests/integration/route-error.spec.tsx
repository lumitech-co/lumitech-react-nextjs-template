import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RouteError } from 'features/layout/ui/route-error/route-error';

import { renderWithProviders, screen } from '../utils/render';

describe('RouteError', () => {
  it('shows the localized text and retries on click', async () => {
    const retry = vi.fn();

    renderWithProviders(<RouteError retry={retry} />);

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
