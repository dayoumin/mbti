import type { SubjectKey } from './types';
import { MAIN_TEST_KEYS } from './config';
import type { AgeGroup } from '@/services/DemographicService';

const MAIN_TEST_SET = new Set(MAIN_TEST_KEYS);

export const POPULAR_TESTS: SubjectKey[] = ['human', 'dog', 'cat', 'coffee', 'idealType'];

// ========== 연령 제한 테스트 ==========

// 20세 이상만 볼 수 있는 테스트 (법적 이유)
export const ADULT_ONLY_TESTS: SubjectKey[] = ['alcohol'];

// 연령별 허용 테스트 (명시되지 않으면 모든 연령 허용)
export const AGE_RESTRICTED_TESTS: Partial<Record<SubjectKey, AgeGroup[]>> = {
  alcohol: ['20s', '30s', '40s+'], // 술: 20대 이상
};

/**
 * 테스트가 해당 연령에 적합한지 확인
 */
export function isTestAllowedForAge(testKey: SubjectKey, ageGroup?: AgeGroup): boolean {
  // 연령 정보 없으면 성인 전용 테스트 제외 (안전 우선)
  if (!ageGroup) {
    return !ADULT_ONLY_TESTS.includes(testKey);
  }

  // 10대면 성인 전용 테스트 제외
  if (ageGroup === '10s' && ADULT_ONLY_TESTS.includes(testKey)) {
    return false;
  }

  // 연령 제한 체크
  const allowedAges = AGE_RESTRICTED_TESTS[testKey];
  if (allowedAges && !allowedAges.includes(ageGroup)) {
    return false;
  }

  return true;
}

/**
 * 연령에 맞게 테스트 목록 필터링
 */
export function filterTestsByAge(tests: SubjectKey[], ageGroup?: AgeGroup): SubjectKey[] {
  return tests.filter(test => isTestAllowedForAge(test, ageGroup));
}

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
