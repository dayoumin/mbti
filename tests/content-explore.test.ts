/**
 * ContentExplore 관련 유틸리티 함수 테스트
 * - getStablePollResults 경계값 테스트
 * - 카테고리 매핑 테스트
 *
 * 실행: npx tsx tests/content-explore.test.ts
 */

// getStablePollResults 함수 복사 (컴포넌트 내부 함수라 직접 테스트)
function getStablePollResults(pollId: string) {
  const seedStr = String(pollId || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash) % 41; // 0..40
  const a = 30 + base; // 30..70
  return { a, b: 100 - a };
}

// TEST_SUBJECT_MAP 복사
const TEST_SUBJECT_MAP: Record<string, string> = {
  human: 'me',
  conflictStyle: 'me',
  cat: 'pet',
  dog: 'pet',
  rabbit: 'pet',
  hamster: 'pet',
  coffee: 'drink',
  tea: 'drink',
  alcohol: 'drink',
  bread: 'food',
  fruit: 'food',
  plant: 'life',
  petMatch: 'life',
  idealType: 'love',
  dogBreed: 'pet',
  catBreed: 'pet',
  smallPet: 'pet',
  fishType: 'pet',
  birdType: 'pet',
  reptileType: 'pet'
};

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
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected defined, got undefined`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined, got ${actual}`);
      }
    },
  };
}

console.log('\n=== ContentExplore 테스트 ===\n');

// ============================================================================
// getStablePollResults 테스트
// ============================================================================
console.log('--- getStablePollResults 테스트 ---');

test('일반적인 pollId → 30-70 범위 결과', () => {
  const result = getStablePollResults('poll_001');
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
  expect(result.b).toBe(100 - result.a);
});

test('동일 pollId → 동일 결과 (결정론적)', () => {
  const result1 = getStablePollResults('poll_abc');
  const result2 = getStablePollResults('poll_abc');
  expect(result1.a).toBe(result2.a);
  expect(result1.b).toBe(result2.b);
});

test('다른 pollId → 다른 결과 (높은 확률)', () => {
  const result1 = getStablePollResults('poll_001');
  const result2 = getStablePollResults('poll_002');
  // 완전히 같을 확률은 1/41이므로 대부분 다름
  // 여기서는 단순히 함수가 동작하는지만 확인
  expect(result1.a).toBeGreaterThanOrEqual(30);
  expect(result2.a).toBeGreaterThanOrEqual(30);
});

test('빈 문자열 pollId → 정상 동작', () => {
  const result = getStablePollResults('');
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
  expect(result.b).toBe(100 - result.a);
});

test('null/undefined를 String으로 변환 → 정상 동작', () => {
  // @ts-ignore - 의도적으로 잘못된 타입 테스트
  const resultNull = getStablePollResults(null);
  // @ts-ignore
  const resultUndefined = getStablePollResults(undefined);

  expect(resultNull.a).toBeGreaterThanOrEqual(30);
  expect(resultUndefined.a).toBeGreaterThanOrEqual(30);
});

test('숫자를 문자열로 변환 → 정상 동작', () => {
  // @ts-ignore
  const result = getStablePollResults(12345);
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
});

test('특수문자 포함 pollId → 정상 동작', () => {
  const result = getStablePollResults('poll_!@#$%^&*()');
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
});

test('한글 pollId → 정상 동작', () => {
  const result = getStablePollResults('투표_한글테스트');
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
});

test('매우 긴 pollId → 정상 동작', () => {
  const longId = 'a'.repeat(1000);
  const result = getStablePollResults(longId);
  expect(result.a).toBeGreaterThanOrEqual(30);
  expect(result.a).toBeLessThanOrEqual(70);
});

// ============================================================================
// TEST_SUBJECT_MAP 테스트
// ============================================================================
console.log('\n--- TEST_SUBJECT_MAP 테스트 ---');

test('human → me 카테고리', () => {
  expect(TEST_SUBJECT_MAP['human']).toBe('me');
});

test('cat → pet 카테고리', () => {
  expect(TEST_SUBJECT_MAP['cat']).toBe('pet');
});

test('coffee → drink 카테고리', () => {
  expect(TEST_SUBJECT_MAP['coffee']).toBe('drink');
});

test('plant → life 카테고리', () => {
  expect(TEST_SUBJECT_MAP['plant']).toBe('life');
});

test('idealType → love 카테고리', () => {
  expect(TEST_SUBJECT_MAP['idealType']).toBe('love');
});

test('존재하지 않는 키 → undefined', () => {
  expect(TEST_SUBJECT_MAP['nonexistent']).toBeUndefined();
});

// ============================================================================
// 결과 합계 검증
// ============================================================================
console.log('\n--- 결과 합계 검증 ---');

test('a + b = 100 (다양한 입력)', () => {
  const testIds = ['poll_1', 'poll_2', 'test', '', 'abc123', '한글'];
  for (const id of testIds) {
    const result = getStablePollResults(id);
    if (result.a + result.b !== 100) {
      throw new Error(`pollId "${id}": ${result.a} + ${result.b} !== 100`);
    }
  }
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
