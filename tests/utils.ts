import { Page } from '@playwright/test';

export const e2e = !!process.env.PLW_E2E;

export const fakeTimer = async (page: Page, date: Date = new Date('2023-02-01')) =>
  page.addInitScript(`{
  // Extend Date constructor to default to fakeNow
  Date = class extends Date {
    constructor(...args) {
      if (args.length === 0) {
        super(${date.valueOf()});
      } else {
        super(...args);
      }
    }
  }
  // Override Date.now() to start from fakeNow
  const __DateNowOffset = ${date.valueOf()} - Date.now();
  const __DateNow = Date.now;
  Date.now = () => __DateNow() + __DateNowOffset;
}`);
