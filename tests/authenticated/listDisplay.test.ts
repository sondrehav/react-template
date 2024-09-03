import { expect, test } from '@playwright/test';

import mock from './mock';

test.describe('List display', () => {
  test.beforeEach(mock);

  test('Displays correct names from api.', async ({ page }) => {
    await page.route('**/api/names', (route) =>
      route.request().method() !== 'GET'
        ? route.fallback()
        : route.fulfill({
            status: 200,
            json: [
              /* prettier-ignore */
              { id: "zycEak2n", name: "Jonas" },
              /* prettier-ignore */
              { id: "aXT2yCPG", name: "Kari" },
            ],
          }),
    );
    await page.goto('/');

    const namesList = page.getByTestId('names-list');
    await expect(namesList).toBeVisible();

    const nameItems = namesList.getByTestId('names-list-item');
    await expect(nameItems).toHaveCount(2);

    const [firstName, secondName] = await nameItems.all();
    await expect(firstName).toContainText('Jonas');
    await expect(secondName).toContainText('Kari');
  });

  test('User is able to add new items.', async ({ page }) => {
    await page.route('**/api/names', (route) =>
      route.request().method() !== 'POST'
        ? route.fallback()
        : route.fulfill({
            status: 200,
            json: { id: 'c3XTFCcs', name: 'Ida' },
          }),
    );
    await page.goto('/');

    const namesList = page.getByTestId('names-list');
    await expect(namesList).toBeVisible();

    const form = page.getByTestId('name-form');
    const input = form.getByTestId('name-input');
    await input.fill('Ida');
    const [requestBody] = await Promise.all([
      page
        .waitForRequest(
          (res) => res.url().includes('/api/names') && res.method() === 'POST',
        )
        .then((res) => res.postDataJSON()),
      form.getByTestId('name-form-submit').click(),
    ]);

    expect(requestBody).toMatchObject({
      name: 'Ida',
    });

    await expect(namesList.getByTestId('names-list-item')).toHaveCount(3);
  });
});
