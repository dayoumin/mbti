/**
 * Sidebar 캐시 키 테스트
 */

// Sidebar.tsx의 캐시 키 생성 로직 복제
function getCacheKey(ageGroup, gender) {
  const effectiveGender = gender && gender !== 'other' ? gender : null;
  return `popular_tests_${ageGroup || 'all'}_${effectiveGender || 'all'}`;
}

// API 파라미터 생성 로직 복제
function getApiParams(ageGroup, gender) {
  const effectiveGender = gender && gender !== 'other' ? gender : null;
  const params = new URLSearchParams({ type: 'popular-tests', limit: '20' });
  if (ageGroup) params.set('ageGroup', ageGroup);
  if (effectiveGender) params.set('gender', effectiveGender);
  return params;
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('✅', name);
    passed++;
  } catch (e) {
    console.log('❌', name + ':', e.message);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
    },
    toBeNull() {
      if (actual !== null) throw new Error(`Expected null, got ${actual}`);
    }
  };
}

console.log('\n=== Sidebar 캐시 키 테스트 ===\n');

test('ageGroup과 gender가 모두 있을 때', () => {
  expect(getCacheKey('20s', 'female')).toBe('popular_tests_20s_female');
  const params = getApiParams('20s', 'female');
  expect(params.get('ageGroup')).toBe('20s');
  expect(params.get('gender')).toBe('female');
});

test('gender가 other일 때 캐시 키는 all (핵심 수정)', () => {
  expect(getCacheKey('20s', 'other')).toBe('popular_tests_20s_all');
  const params = getApiParams('20s', 'other');
  expect(params.get('ageGroup')).toBe('20s');
  expect(params.get('gender')).toBeNull();
});

test('둘 다 null일 때', () => {
  expect(getCacheKey(null, null)).toBe('popular_tests_all_all');
});

test('gender만 other일 때', () => {
  expect(getCacheKey(null, 'other')).toBe('popular_tests_all_all');
});

test('ageGroup만 있을 때', () => {
  expect(getCacheKey('30s', null)).toBe('popular_tests_30s_all');
});

test('모든 연령대 테스트', () => {
  expect(getCacheKey('10s', 'male')).toBe('popular_tests_10s_male');
  expect(getCacheKey('20s', 'female')).toBe('popular_tests_20s_female');
  expect(getCacheKey('30s', 'other')).toBe('popular_tests_30s_all');
  expect(getCacheKey('40s+', null)).toBe('popular_tests_40s+_all');
});

test('캐시 키와 API 파라미터 일관성 (gender=other)', () => {
  // gender=other인 경우 캐시 키와 API 요청 모두 gender를 제외해야 함
  const cacheKey = getCacheKey('20s', 'other');
  const params = getApiParams('20s', 'other');

  // 캐시 키에서 gender 부분이 'all'
  expect(cacheKey.includes('_all')).toBe(true);
  // API 요청에서 gender 파라미터 없음
  expect(params.get('gender')).toBeNull();
});

console.log(`\n=============================`);
console.log(`결과: ${passed} passed, ${failed} failed`);
console.log(`=============================\n`);

process.exit(failed > 0 ? 1 : 0);
