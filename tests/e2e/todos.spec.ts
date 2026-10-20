import { expect, test } from '@playwright/test';

import { STUB_API_URL } from '../../playwright.config';

test.beforeEach(async ({ request }) => {
  await request.post(`${STUB_API_URL}/__reset`);
});

test('renders the prefetched todos list', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByText('buy milk')).toBeVisible();
  await expect(page.getByText('walk the dog')).toBeVisible();
});

test('shows a validation error for an empty title', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Create Todo' }).click();

  await expect(page.getByText('Title is required')).toBeVisible();
});

test('creates a todo and sees it in the list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('buy milk')).toBeVisible();

  await page.getByLabel('Title').fill('buy bread');
  await page.getByRole('button', { name: 'Create Todo' }).click();

  await expect(page.getByLabel('Title')).toHaveValue('');
  await expect(page.getByText('buy bread')).toBeVisible();
});

test('toggles a todo completion', async ({ page }) => {
  await page.goto('/');

  const milk = page.getByRole('listitem').filter({ hasText: 'buy milk' });
  const checkbox = milk.getByRole('checkbox');

  await expect(checkbox).not.toBeChecked();
  await checkbox.click();

  await expect(checkbox).toBeChecked();
  await expect(milk).toHaveClass(/line-through/);
});

test('switches the language and keeps it in the URL', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'UA' }).click();

  await expect(page).toHaveURL(/\/uk$/);
  await expect(page.getByRole('button', { name: 'Створити задачу' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
});

test('switches back to English', async ({ page }) => {
  await page.goto('/uk');

  await page.getByRole('button', { name: 'EN' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'Create Todo' })).toBeVisible();
});

test.describe('with a Ukrainian browser', () => {
  test.use({ locale: 'uk-UA' });

  test('opens the Ukrainian version from /', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/uk$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  });
});
