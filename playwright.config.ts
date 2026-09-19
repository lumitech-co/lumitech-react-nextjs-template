import { defineConfig, devices } from '@playwright/test';

const STUB_API_PORT = 4010;
const APP_URL = 'http://localhost:3000';

export const STUB_API_URL = `http://localhost:${STUB_API_PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  // The stub API keeps its todos in memory, so specs share state and run serially.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: [
    {
      command: 'node tests/e2e/stub-api.mjs',
      url: `${STUB_API_URL}/todos`,
      reuseExistingServer: !process.env.CI,
      env: { STUB_API_PORT: String(STUB_API_PORT) },
    },
    {
      // The page prefetches on the server, so the app must point at the stub
      // API itself — `page.route` only sees requests made by the browser.
      command: process.env.CI ? 'yarn start' : 'yarn dev',
      url: APP_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { NEXT_PUBLIC_API_URL: STUB_API_URL },
    },
  ],
});
