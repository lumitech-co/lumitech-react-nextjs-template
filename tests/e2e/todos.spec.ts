import { AxeBuilder } from '@axe-core/playwright';
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

  await page.getByRole('button', { name: 'UA', exact: true }).click();

  await expect(page).toHaveURL(/\/uk$/);
  await expect(
    page.getByRole('button', { name: 'Створити задачу' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
});

test('switches back to English', async ({ page }) => {
  await page.goto('/uk');

  await page.getByRole('button', { name: 'EN', exact: true }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'Create Todo' })).toBeVisible();
});

test('shows the localized 404 on an unknown path', async ({ page }) => {
  const response = await page.goto('/uk/no-such-page');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Сторінку не знайдено' }),
  ).toBeVisible();
});

test('keeps the chosen theme after a reload', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Light' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.reload();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible();
});

test('runs under the CSP without a violation', async ({ page }) => {
  const violations: string[] = [];

  page.on('console', message => {
    if (message.text().includes('Content Security Policy')) {
      violations.push(message.text());
    }
  });

  const response = await page.goto('/');

  expect(response?.headers()['content-security-policy']).toContain('nonce-');
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await page.getByRole('button', { name: 'Light' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  expect(violations).toEqual([]);
});

test('sends a fresh nonce on every request', async ({ request }) => {
  const nonceOf = async () => {
    const response = await request.get('/');

    return response.headers()['content-security-policy']?.match(/nonce-[^']+/);
  };

  expect((await nonceOf())?.[0]).not.toBe((await nonceOf())?.[0]);
});

test('has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('listitem')).toHaveCount(2);

  const { violations } = await new AxeBuilder({ page }).analyze();

  expect(violations.map(({ id }) => id)).toEqual([]);
});

test('serves the SEO routes', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  const sitemap = await request.get('/sitemap.xml');

  expect(await robots.text()).toContain('sitemap.xml');
  expect(await sitemap.text()).toContain('hreflang="uk"');
});

test('links the page languages with hreflang', async ({ page }) => {
  await page.goto('/uk');

  const hreflang = page.locator('link[rel="alternate"][hreflang="en"]');

  await expect(hreflang).toHaveAttribute('href', 'http://localhost:3000');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/uk$/,
  );
});

test.describe('with a Ukrainian browser', () => {
  test.use({ locale: 'uk-UA' });

  test('opens the Ukrainian version from /', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/uk$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  });
});
