import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('User is able to log in', async ({ page }) => {
  await page.route('**/Account/login**', async (route) =>
    route.fulfill({
      status: 200,
      json: {
        tokenType: 'Bearer',
        accessToken: 'asdasd',
        expiresIn: 31536000,
        refreshToken: 'asdasd',
      },
    }),
  );

  await page.goto('/');

  const main = page.getByTestId('login-page-main');
  await expect(main).toBeVisible();
  await expect(main.locator('h1')).toContainText('OnTime');

  const form = main.locator('form').first();
  await expect(form).toBeVisible();
  await expect(form.getByLabel('E-post')).toBeEditable();
  await expect(form.getByLabel('Passord')).toBeEditable();
  await expect(form.getByLabel('Husk meg')).toBeEnabled();
  await expect(form.locator('a').and(form.getByText('Glemt passord'))).toHaveAttribute(
    'href',
    '/logg-inn/reset-passord',
  );
  await expect(form.locator('a').and(form.getByText('Registrer'))).toHaveAttribute(
    'href',
    '/logg-inn/registrer',
  );
  await expect(form.locator('button').and(form.locator('[type="submit"]'))).toBeEnabled();

  await form
    .getByLabel('E-post')
    .fill(process.env.PLW_USERNAME ?? 'jan.eiesascsacsacsaland@bob.no');
  await form.getByLabel('Passord').fill(process.env.PLW_PASSWORD ?? 'asdASDsacsaac123!');
  await form.getByLabel('Husk meg').check();

  const [response] = await Promise.all([
    page.waitForResponse((resp) => {
      return resp.url().includes(`/Account/login`);
    }),
    form.getByRole('button').click(),
  ]);

  expect(response.status()).toEqual(200);

  await page.context().storageState({ path: authFile });
});
