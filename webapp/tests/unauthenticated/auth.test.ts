import { test } from '@playwright/test';

import mock from './mock';

test.describe('Unauthenticated flows', () => {
  test.beforeEach(mock);
});
