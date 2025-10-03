import {test, expect} from '@playwright/test';

test.describe('Home Page', () => {
  test('displays hero content', async ({page}) => {
    await page.goto('/fr');
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await expect(page.getByRole('link', {name: /Catalogue/i})).toBeVisible();
  });
});
