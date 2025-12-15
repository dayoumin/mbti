import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  projects: [{ name: 'unit', testMatch: '**/*.spec.ts' }],
});

