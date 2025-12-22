/**
 * NextActionService 단위 테스트
 * - 스트릭 임계값 경계 테스트 (2→3, 6→7, 13→14)
 * - 시간대 경계값 테스트 (5→6, 8→9, 17→18, 21→22)
 * - contentId 방어 테스트
 *
 * 실행: npx tsx tests/next-action-service.test.ts
 */

import { nextActionService } from '../src/services/NextActionService';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error}`);
    failed++;
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${actual}`);
      }
    },
    not: {
      toBeNull() {
        if (actual === null) {
          throw new Error(`Expected not null, got null`);
        }
      },
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual > expected) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected defined, got undefined`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== 'string' || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
  };
}

console.log('\n=== NextActionService 테스트 ===\n');

// ============================================================================
// 스트릭 임계값 경계 테스트
// ============================================================================
console.log('--- 스트릭 임계값 경계 테스트 ---');

test('streak 2 → null (보너스 없음)', () => {
  const result = nextActionService.getStreakBonusAction(2);
  expect(result).toBeNull();
});

test('streak 3 → 퀴즈 보너스', () => {
  const result = nextActionService.getStreakBonusAction(3);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('quiz');
  expect(result?.label).toContain('3일');
});

test('streak 6 → 퀴즈 보너스 (3일 기준 적용)', () => {
  const result = nextActionService.getStreakBonusAction(6);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('quiz');
});

test('streak 7 → 테스트 보너스 (1주)', () => {
  const result = nextActionService.getStreakBonusAction(7);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('test');
  expect(result?.label).toContain('1주');
});

test('streak 13 → 테스트 보너스 (7일 기준 적용)', () => {
  const result = nextActionService.getStreakBonusAction(13);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('test');
});

test('streak 14 → 공유 보너스 (2주)', () => {
  const result = nextActionService.getStreakBonusAction(14);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('share');
  expect(result?.label).toContain('2주');
});

test('streak 30 → 공유 보너스 유지', () => {
  const result = nextActionService.getStreakBonusAction(30);
  expect(result).not.toBeNull();
  expect(result?.type).toBe('share');
});

// ============================================================================
// 시간대 경계값 테스트
// ============================================================================
console.log('\n--- 시간대 경계값 테스트 ---');

test('hour 5 → 밤 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(5);
  expect(result.type).toBe('quiz');
  expect(result.label).toContain('밤');
});

test('hour 6 → 아침 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(6);
  expect(result.type).toBe('quiz');
  expect(result.label).toContain('아침');
});

test('hour 8 → 아침 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(8);
  expect(result.type).toBe('quiz');
  expect(result.label).toContain('아침');
});

test('hour 9 → 오늘의 테스트', () => {
  const result = nextActionService.getTimeBasedAction(9);
  expect(result.type).toBe('test');
  expect(result.label).toContain('오늘');
});

test('hour 17 → 오늘의 테스트', () => {
  const result = nextActionService.getTimeBasedAction(17);
  expect(result.type).toBe('test');
});

test('hour 18 → 저녁 투표', () => {
  const result = nextActionService.getTimeBasedAction(18);
  expect(result.type).toBe('poll');
  expect(result.label).toContain('저녁');
});

test('hour 21 → 저녁 투표', () => {
  const result = nextActionService.getTimeBasedAction(21);
  expect(result.type).toBe('poll');
});

test('hour 22 → 밤 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(22);
  expect(result.type).toBe('quiz');
  expect(result.label).toContain('밤');
});

test('hour 0 (자정) → 밤 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(0);
  expect(result.type).toBe('quiz');
  expect(result.label).toContain('밤');
});

test('hour 23 → 밤 퀴즈', () => {
  const result = nextActionService.getTimeBasedAction(23);
  expect(result.type).toBe('quiz');
});

test('hour 12 (정오) → 오늘의 테스트', () => {
  const result = nextActionService.getTimeBasedAction(12);
  expect(result.type).toBe('test');
});

// ============================================================================
// contentId 방어 테스트
// ============================================================================
console.log('\n--- contentId 방어 테스트 ---');

test('test_result with undefined contentId → 정상 동작', () => {
  const result = nextActionService.getRecommendations({
    endpoint: 'test_result',
    contentId: undefined,
  });
  expect(result.length).toBeGreaterThan(0);
  expect(result.some(a => a.type === 'share')).toBe(true);
});

test('test_result with empty string contentId → 정상 동작', () => {
  const result = nextActionService.getRecommendations({
    endpoint: 'test_result',
    contentId: '',
  });
  expect(result.length).toBeGreaterThan(0);
});

test('test_result with invalid contentId → 정상 동작', () => {
  const result = nextActionService.getRecommendations({
    endpoint: 'test_result',
    contentId: 'invalidTestKey123',
  });
  expect(result.some(a => a.type === 'share')).toBe(true);
  expect(result.some(a => a.type === 'ranking')).toBe(true);
});

test('ranking_view with undefined contentId → 정상 동작', () => {
  const result = nextActionService.getRecommendations({
    endpoint: 'ranking_view',
    contentId: undefined,
  });
  expect(result.length).toBeGreaterThan(0);
  expect(result.some(a => a.type === 'test')).toBe(true);
});

// ============================================================================
// 빈 배열/방어 테스트
// ============================================================================
console.log('\n--- getRelatedContentFromHistory 방어 테스트 ---');

test('빈 배열 → 빈 결과', () => {
  const result = nextActionService.getRelatedContentFromHistory([]);
  expect(result.length).toBe(0);
});

test('유효한 테스트 히스토리 → 관련 콘텐츠 반환', () => {
  const result = nextActionService.getRelatedContentFromHistory(['petMatch']);
  expect(result.length).toBeGreaterThan(0);
});

test('알 수 없는 테스트 키 → 빈 결과', () => {
  const result = nextActionService.getRelatedContentFromHistory(['unknownTest']);
  expect(result.length).toBe(0);
});

// ============================================================================
// 중복 제거 로직 테스트
// ============================================================================
console.log('\n--- 중복 제거 로직 테스트 ---');

test('스트릭 quiz + 시간대 quiz → 중복 허용 (다른 속성)', () => {
  const result = nextActionService.getContextualBonusActions({
    endpoint: 'test_result',
    streakCount: 3,
    currentHour: 6,
  });
  expect(result.length).toBeGreaterThanOrEqual(1);
});

test('스트릭 test + 시간대 test → 중복 제거', () => {
  const result = nextActionService.getContextualBonusActions({
    endpoint: 'test_result',
    streakCount: 7,
    currentHour: 12,
  });
  const testActions = result.filter(a => a.type === 'test');
  expect(testActions.length).toBeLessThanOrEqual(2);
});

// ============================================================================
// 개인화 추천 테스트
// ============================================================================
console.log('\n--- 개인화 추천 테스트 ---');

test('미완료 테스트 없음 → null', () => {
  const result = nextActionService.getPersonalizedTestRecommendation(
    'human',
    ['human', 'cat', 'dog'],
    []
  );
  expect(result).toBeNull();
});

test('미완료 테스트 있음 → 추천 반환', () => {
  const result = nextActionService.getPersonalizedTestRecommendation(
    'human',
    ['human'],
    ['cat', 'dog', 'petMatch']
  );
  expect(result).not.toBeNull();
  expect(result?.type).toBe('test');
  expect(result?.targetId).toBeDefined();
});

// ============================================================================
// 결과 출력
// ============================================================================
console.log('\n=============================');
console.log(`총 ${passed + failed}개 테스트`);
console.log(`✓ 통과: ${passed}`);
console.log(`✗ 실패: ${failed}`);
console.log('=============================\n');

if (failed > 0) {
  process.exit(1);
}
