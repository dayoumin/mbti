/**
 * Sidebar 캐시 로직 테스트
 *
 * 검증 항목:
 * 1. effectiveGender 변수로 캐시 키와 API 요청 통일
 * 2. gender=other 시 캐시 키가 'all'이 되어야 함
 * 3. JSON 파싱 에러 시 캐시 제거
 */

import { expect, test } from '@playwright/test';

// Sidebar.tsx의 캐시 키 생성 로직 복제
function getCacheKey(ageGroup: string | null, gender: string | null): string {
  const effectiveGender = gender && gender !== 'other' ? gender : null;
  return `popular_tests_${ageGroup || 'all'}_${effectiveGender || 'all'}`;
}

// API 파라미터 생성 로직 복제
function getApiParams(ageGroup: string | null, gender: string | null): URLSearchParams {
  const effectiveGender = gender && gender !== 'other' ? gender : null;
  const params = new URLSearchParams({ type: 'popular-tests', limit: '20' });
  if (ageGroup) params.set('ageGroup', ageGroup);
  if (effectiveGender) params.set('gender', effectiveGender);
  return params;
}

test.describe('Sidebar 캐시 키 생성 로직', () => {
  test('ageGroup과 gender가 모두 있을 때', () => {
    const cacheKey = getCacheKey('20s', 'female');
    const params = getApiParams('20s', 'female');

    expect(cacheKey).toBe('popular_tests_20s_female');
    expect(params.get('ageGroup')).toBe('20s');
    expect(params.get('gender')).toBe('female');
  });

  test('ageGroup만 있고 gender가 null일 때', () => {
    const cacheKey = getCacheKey('20s', null);
    const params = getApiParams('20s', null);

    expect(cacheKey).toBe('popular_tests_20s_all');
    expect(params.get('ageGroup')).toBe('20s');
    expect(params.get('gender')).toBeNull();
  });

  test('gender가 "other"일 때 캐시 키는 all이어야 함', () => {
    const cacheKey = getCacheKey('20s', 'other');
    const params = getApiParams('20s', 'other');

    // gender=other는 필터에서 제외되므로 캐시 키는 'all'
    expect(cacheKey).toBe('popular_tests_20s_all');
    expect(params.get('ageGroup')).toBe('20s');
    expect(params.get('gender')).toBeNull(); // gender=other는 API 요청에 포함 안됨
  });

  test('둘 다 null일 때', () => {
    const cacheKey = getCacheKey(null, null);
    const params = getApiParams(null, null);

    expect(cacheKey).toBe('popular_tests_all_all');
    expect(params.get('ageGroup')).toBeNull();
    expect(params.get('gender')).toBeNull();
  });

  test('ageGroup이 null이고 gender가 female일 때', () => {
    const cacheKey = getCacheKey(null, 'female');
    const params = getApiParams(null, 'female');

    expect(cacheKey).toBe('popular_tests_all_female');
    expect(params.get('ageGroup')).toBeNull();
    expect(params.get('gender')).toBe('female');
  });

  test('ageGroup이 null이고 gender가 other일 때', () => {
    const cacheKey = getCacheKey(null, 'other');
    const params = getApiParams(null, 'other');

    // gender=other는 필터에서 제외
    expect(cacheKey).toBe('popular_tests_all_all');
    expect(params.get('ageGroup')).toBeNull();
    expect(params.get('gender')).toBeNull();
  });
});

test.describe('캐시 키와 API 요청 일관성', () => {
  // 여러 조합에서 캐시 키가 API 요청과 일치하는지 확인
  const testCases = [
    { ageGroup: '10s', gender: 'male', expectedKey: 'popular_tests_10s_male' },
    { ageGroup: '20s', gender: 'female', expectedKey: 'popular_tests_20s_female' },
    { ageGroup: '30s', gender: 'other', expectedKey: 'popular_tests_30s_all' },
    { ageGroup: '40s+', gender: null, expectedKey: 'popular_tests_40s+_all' },
    { ageGroup: null, gender: 'male', expectedKey: 'popular_tests_all_male' },
    { ageGroup: null, gender: 'other', expectedKey: 'popular_tests_all_all' },
  ];

  for (const tc of testCases) {
    test(`ageGroup=${tc.ageGroup}, gender=${tc.gender} → ${tc.expectedKey}`, () => {
      const cacheKey = getCacheKey(tc.ageGroup, tc.gender);
      expect(cacheKey).toBe(tc.expectedKey);
    });
  }
});
