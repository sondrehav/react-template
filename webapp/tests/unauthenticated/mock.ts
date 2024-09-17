import { Page } from '@playwright/test';

import { fakeTimer } from '../utils';

const unauthenticated = { status: 401 };

const login = {
  status: 200,
  responseBody: {
    tokenType: 'Bearer',
    accessToken: 'asdasd',
    expiresIn: 31536000,
    refreshToken: 'asdasd',
  },
};

const refresh = {
  status: 200,
};

const forgotPassword = {
  status: 200,
  responseBody: {
    tokenType: 'Bearer',
    accessToken: 'asdasd',
    expiresIn: 31536000,
    refreshToken: 'asdasd',
  },
};

const resetPassword = {
  status: 200,
};

const register = {
  status: 200,
  responseBody: {
    type: 'string',
    title: 'string',
    status: 123456789,
    detail: 'string',
    instance: 'string',
  },
};

export default async ({ page }: { page: Page }) => {
  await fakeTimer(page);
  await Promise.all([
    page.route(
      '**/api/**',
      (route) => route.request().method() === 'GET' && route.fulfill(unauthenticated),
    ),
    page.route(
      '**/Account/login**',
      (route) => route.request().method() === 'POST' && route.fulfill(login),
    ),
    page.route(
      '**/Account/refresh**',
      (route) => route.request().method() === 'POST' && route.fulfill(refresh),
    ),
    page.route(
      '**/Account/forgotPassword',
      (route) => route.request().method() === 'POST' && route.fulfill(forgotPassword),
    ),
    page.route(
      '**/Account/resetPassword',
      (route) => route.request().method() === 'POST' && route.fulfill(resetPassword),
    ),
    page.route(
      '**/Account/register',
      (route) => route.request().method() === 'POST' && route.fulfill(register),
    ),
  ]);
};
