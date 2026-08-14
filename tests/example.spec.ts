import { expect, test } from '@playwright/test'

test('loads the chess coach', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Chess/i)
  await expect(page.getByRole('button', { name: 'White king on e1' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible()
  await expect(page.getByText('Move History')).toBeVisible()
})
