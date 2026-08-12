import { expect, test } from '@playwright/test'

function mergedLength(ranges: Array<{ start: number; end: number }>): number {
  const sorted = ranges.slice().sort((left, right) => left.start - right.start)
  let total = 0
  let currentStart = -1
  let currentEnd = -1

  for (const range of sorted) {
    if (range.start > currentEnd) {
      if (currentStart >= 0) total += currentEnd - currentStart
      currentStart = range.start
      currentEnd = range.end
    } else {
      currentEnd = Math.max(currentEnd, range.end)
    }
  }
  if (currentStart >= 0) total += currentEnd - currentStart
  return total
}

test('loaded application modules retain browser execution coverage', async ({ page }) => {
  await page.coverage.startJSCoverage({ resetOnNavigation: false })

  await page.goto('/')
  await expect(page).toHaveTitle(/Chess/i)
  await expect(page.getByRole('button', { name: 'Open AI Config' })).toBeVisible()
  await page.getByRole('button', { name: 'Open AI Config' }).click()
  await expect(page.getByRole('heading', { name: 'AI Coach Settings' })).toBeVisible()

  await page.goto('/changelog')
  await expect(page.getByRole('heading', { name: 'Changelog' })).toBeVisible()

  const entries = (await page.coverage.stopJSCoverage()).filter(({ url }) =>
    url.startsWith('http://127.0.0.1:5173/src/')
  )
  expect(entries.length).toBeGreaterThan(0)

  let totalBytes = 0
  let coveredBytes = 0
  for (const entry of entries) {
    const sourceLength = entry.source?.length ?? 0
    const uncoveredBytes = mergedLength(
      entry.functions.flatMap((fn) =>
        fn.ranges
          .filter((range) => range.count === 0)
          .map((range) => ({ start: range.startOffset, end: range.endOffset }))
      )
    )
    totalBytes += sourceLength
    coveredBytes += Math.max(0, sourceLength - uncoveredBytes)
  }

  const percentage = (coveredBytes / totalBytes) * 100
  console.log(
    `Browser coverage: ${coveredBytes}/${totalBytes} transformed source bytes ` +
      `(${percentage.toFixed(2)}%) across ${entries.length} loaded modules.`
  )
  expect(percentage).toBeGreaterThanOrEqual(76.5)
})
