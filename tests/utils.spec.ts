import { expect, test } from '@playwright/test';

import { getDeviceId, hasDeviceId, USER_KEY } from '../src/utils/device';
import { formatDate, formatNumber, formatRelativeTime } from '../src/utils/format';

test.describe('formatRelativeTime', () => {
  test('formats relative times in Korean', () => {
    const baseNow = Date.parse('2025-12-15T12:00:00.000Z');
    const originalNow = Date.now;
    Date.now = () => baseNow;

    try {
      expect(formatRelativeTime(new Date(baseNow - 30_000).toISOString())).toBe('방금 전');
      expect(formatRelativeTime(new Date(baseNow - 5 * 60_000).toISOString())).toBe('5분 전');
      expect(formatRelativeTime(new Date(baseNow - 3 * 60 * 60_000).toISOString())).toBe('3시간 전');
      expect(formatRelativeTime(new Date(baseNow - 6 * 24 * 60 * 60_000).toISOString())).toBe('6일 전');
      expect(formatRelativeTime(new Date(baseNow - 14 * 24 * 60 * 60_000).toISOString())).toBe('2주 전');
      expect(formatRelativeTime(new Date(baseNow - 60 * 24 * 60 * 60_000).toISOString())).toBe('2개월 전');
      expect(formatRelativeTime(new Date(baseNow - 400 * 24 * 60 * 60_000).toISOString())).toBe('1년 전');
    } finally {
      Date.now = originalNow;
    }
  });

  test('handles invalid/future dates', () => {
    const baseNow = Date.parse('2025-12-15T12:00:00.000Z');
    const originalNow = Date.now;
    Date.now = () => baseNow;

    try {
      expect(formatRelativeTime('not-a-date')).toBe('');
      expect(formatRelativeTime(new Date(baseNow + 60_000).toISOString())).toBe('방금 전');
    } finally {
      Date.now = originalNow;
    }
  });
});

test.describe('formatNumber', () => {
  test('formats numbers using K/M abbreviations', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(9999)).toBe('10K');
    expect(formatNumber(10_000)).toBe('10K');
    expect(formatNumber(999_999)).toBe('999K');
    expect(formatNumber(1_000_000)).toBe('1M');
    expect(formatNumber(1_200_000)).toBe('1.2M');
    expect(formatNumber(-1500)).toBe('-1.5K');
  });

  test('handles non-finite values', () => {
    expect(formatNumber(Number.NaN)).toBe('0');
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('0');
    expect(formatNumber(Number.NEGATIVE_INFINITY)).toBe('0');
  });
});

test.describe('formatDate', () => {
  test('formats dates in ko-KR', () => {
    const formatted = formatDate('2025-12-15T00:00:00');
    expect(formatted).toContain('12');
    expect(formatted).toContain('15');
  });

  test('handles invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

test.describe('device', () => {
  const globalRecord = globalThis as unknown as Record<string, unknown>;
  const originalWindow = globalRecord.window;
  const originalLocalStorage = globalRecord.localStorage;

  test.afterEach(() => {
    globalRecord.window = originalWindow;
    globalRecord.localStorage = originalLocalStorage;
  });

  test('returns server/false during SSR', () => {
    delete globalRecord.window;
    delete globalRecord.localStorage;

    expect(getDeviceId()).toBe('server');
    expect(hasDeviceId()).toBe(false);
  });

  test('creates and persists an anonymous device id', () => {
    const store = new Map<string, string>();
    globalRecord.window = {};
    globalRecord.localStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    };

    expect(hasDeviceId()).toBe(false);
    const first = getDeviceId();
    expect(first).toMatch(/^anon_/);
    expect(hasDeviceId()).toBe(true);
    expect(getDeviceId()).toBe(first);
    expect(
      (globalRecord.localStorage as { getItem: (key: string) => string | null }).getItem(USER_KEY),
    ).toBe(first);
  });

  test('does not throw when localStorage access is blocked', () => {
    globalRecord.window = {};
    globalRecord.localStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };

    expect(getDeviceId()).toMatch(/^anon_/);
    expect(hasDeviceId()).toBe(false);
  });
});
