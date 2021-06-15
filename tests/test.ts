import { test, expect } from '@playwright/test';

test('Find <video>.src on Twitch', async ({ page }) => {
  await page.goto('https://twitch.tv');
  const src = await page.getAttribute('video[src]', 'src');
  expect(src).toMatch(/blob:/);
});
