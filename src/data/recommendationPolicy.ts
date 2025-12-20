import type { SubjectKey } from './types';
import { MAIN_TEST_KEYS } from './config';

const MAIN_TEST_SET = new Set(MAIN_TEST_KEYS);

export const POPULAR_TESTS: SubjectKey[] = ['human', 'dog', 'cat', 'coffee', 'idealType'];

export const RECOMMENDATION_ORDER: SubjectKey[] = [
  'human',
  'petMatch',
  'idealType',
  'coffee',
  'plant',
  'cat',
  'dog',
  'conflictStyle',
  'rabbit',
  'hamster',
  'tea',
  'fruit',
  'alcohol',
  'bread',
  'perfume',
  'aroma',
];

export const COLD_START_POPULARITY_LIMIT = 2;

export function filterMainTests(testKeys: string[]): SubjectKey[] {
  return testKeys.filter((key): key is SubjectKey => MAIN_TEST_SET.has(key as SubjectKey));
}

export function pickFirstAvailable(order: SubjectKey[], available: SubjectKey[]): SubjectKey | undefined {
  return order.find((key) => available.includes(key));
}

export function pickColdStartTest(available: SubjectKey[], completedCount: number): SubjectKey | undefined {
  if (available.length === 0) return undefined;
  if (completedCount <= COLD_START_POPULARITY_LIMIT) {
    return pickFirstAvailable(POPULAR_TESTS, available) || available[0];
  }
  return undefined;
}
