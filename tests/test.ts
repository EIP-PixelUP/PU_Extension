import { test } from '@playwright/test';

test('Find <canvas> on Twitch', async ({ page }) => {
  await page.goto('chrome://extensions');
  await page.click('#detailsButton');
  await page.click('#allow-incognito');
  await page.goto('https://twitch.tv/');
  await page.waitForSelector('canvas');
});
