import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // window 객체 필요 (storage.ts)
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**/*.test.ts'], // E2E 테스트는 Playwright 사용
    globals: true,
    setupFiles: ['./vitest.setup.ts'], // 전역 설정 파일
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
