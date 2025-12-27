/**
 * Vitest 전역 설정
 *
 * InsightService 등 window 객체 의존성이 있는 싱글톤 서비스를 위한 설정
 */

import '@testing-library/jest-dom';

// localStorage mock (jsdom 기본 제공하지만 명시적으로 설정)
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

// window.localStorage 설정
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
}
