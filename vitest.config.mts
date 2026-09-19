import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/{unit,integration}/**/*.spec.{ts,tsx}'],
    env: {
      NEXT_PUBLIC_API_URL: 'http://api.test',
    },
  },
});
