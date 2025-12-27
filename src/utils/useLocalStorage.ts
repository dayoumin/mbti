import { useState, useEffect } from 'react';

/**
 * localStorage와 동기화되는 state 훅
 * - 새로고침해도 값 유지
 * - SSR 안전 (window 체크)
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // SSR 안전: 클라이언트에서만 localStorage 읽기
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // state 변경 시 localStorage 업데이트
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save to localStorage (key: ${key}):`, error);
    }
  }, [key, state]);

  return [state, setState];
}
