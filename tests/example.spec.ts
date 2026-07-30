import { expect, test } from '@playwright/test';

test('loads the chess coach', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Chess/i);
});
