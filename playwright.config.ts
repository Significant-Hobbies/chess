import { defineConfig } from '@playwright/test'

delete process.env.NO_COLOR

const baseURL = 'http://127.0.0.1:5173'

export default defineConfig({
  testDir: './tests',
  testIgnore: process.env.BROWSER_COVERAGE ? [] : ['coverage.spec.ts'],
  use: {
    baseURL,
  },
  webServer: {
    command: 'pnpm dev:frontend --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
