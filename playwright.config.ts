import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL,
  },
  webServer: {
    command: 'pnpm dev:frontend --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
