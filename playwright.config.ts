import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  projects: [
    { name: 'unit', testMatch: '**/*.spec.ts' },
    {
      name: 'e2e-mobile',
      testMatch: '**/e2e/**/*.test.ts',
      use: {
        ...devices['iPhone 14'],
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'e2e-tablet',
      testMatch: '**/e2e/**/*.test.ts',
      use: {
        viewport: { width: 768, height: 1024 },
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'e2e-desktop',
      testMatch: '**/e2e/**/*.test.ts',
      use: {
        viewport: { width: 1280, height: 800 },
        baseURL: 'http://localhost:3001',
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120000,
  },
});

