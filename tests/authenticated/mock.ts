import { Page } from '@playwright/test';

import { fakeTimer } from '../utils';

export default async ({ page }: { page: Page }) => {
  await fakeTimer(page);
  await Promise.all([
    page.route('**/api/names', (route) =>
      route.request().method() !== 'GET'
        ? route.fallback()
        : route.fulfill({
            status: 200,
            json: [
              /* prettier-ignore */
              { id: "BHPvW2jS", name: "Per" },
              /* prettier-ignore */
              { id: "ey4D6xPf", name: "Pål" },
            ],
          }),
    ),
  ]);
};
