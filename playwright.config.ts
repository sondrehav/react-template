import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config({ path: ['.env.test', '.env'] });

const projects = [
  {
    name: 'Chromium',
    use: devices['Desktop Chrome'],
  },
  {
    name: 'Firefox',
    use: devices['Desktop Firefox'],
  },

  {
    name: 'Webkit',
    use: devices['Desktop Safari'],
  },

  {
    name: 'Galaxy Note II landscape',
    use: devices['Galaxy Note II landscape'],
  },

  {
    name: 'Iphone 14',
    use: devices['iPhone 14'],
  },
] as const;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'tests/reports' }]],
  use: {
    baseURL: 'http://localhost:8385',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 1000,
    },
  },

  projects: [
    // { name: 'setupAuth', testMatch: /.*\.setup\.ts/, testDir: 'tests/authenticated' },
    ...projects.map((project) => ({
      ...project,
      name: project.name + ' authenticated',
      use: {
        ...project.use,
        // storageState: 'tests/.auth/user.json',
      },
      // dependencies: ['setupAuth'],
      testDir: 'tests/authenticated',
      testMatch: /.*\.test\.ts/,
    })),
    // ...projects.map((project) => ({
    //   ...project,
    //   name: project.name + ' unauthenticated',
    //   use: {
    //     ...project.use,
    //   },
    //   testDir: 'tests/unauthenticated',
    //   testMatch: /.*\.test\.ts/,
    // })),
  ],

  webServer: {
    command: 'npm run build:test && npm run preview',
    url: process.env.CI ? 'http://127.0.0.1:8385' : 'http://localhost:8385',
    reuseExistingServer: !process.env.CI,
  },
});
