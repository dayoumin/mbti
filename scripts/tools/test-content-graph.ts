/**
 * contentGraph.ts 테스트
 *
 * 실행: npx tsx scripts/test-content-graph.ts
 */

import {
  TEST_TO_CATEGORY,
  CATEGORY_TO_TEST,
  TEST_CONNECTIONS,
  FORTUNE_CONNECTIONS,
  RESULT_TO_DETAIL_TEST,
  CATEGORY_META,
  TEST_META,
  getTestConnections,
  getTestsForCategory,
  getFortuneConnections,
  getDetailTestsForResult,
  getTopConnections,
} from '../src/data/contentGraph';

import { PETMATCH_DATA } from '../src/data/subjects/petMatch';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${(e as Error).message}`);
    failed++;
  }
}

function assertEqual<T>(actual: T, expected: T, msg = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${msg}\n   Expected: ${JSON.stringify(expected)}\n   Actual: ${JSON.stringify(actual)}`);
  }
}

function assertContains<T>(arr: T[], item: T, msg = '') {
  if (!arr.includes(item)) {
    throw new Error(`${msg}\n   Array does not contain: ${item}`);
  }
}

function assertNotEmpty<T>(arr: T[], msg = '') {
  if (!arr || arr.length === 0) {
    throw new Error(`${msg}\n   Array is empty`);
  }
}

console.log('\n========================================');
console.log('contentGraph.ts 테스트');
console.log('========================================\n');

// ============================================================================
// 1. RESULT_TO_DETAIL_TEST 키 일치 테스트 (HIGH 이슈)
// ============================================================================

console.log('--- RESULT_TO_DETAIL_TEST 테스트 ---\n');

test('petMatch 결과 키가 RESULT_TO_DETAIL_TEST와 일치해야 함', () => {
  const petMatchResults = PETMATCH_DATA.resultLabels.map(r => r.name);
  const mappedKeys = Object.keys(RESULT_TO_DETAIL_TEST);

  for (const resultName of petMatchResults) {
    if (!mappedKeys.includes(resultName)) {
      throw new Error(`Missing key: "${resultName}"`);
    }
  }
});

test('"활발한 강아지" 결과가 dogBreed로 연결되어야 함', () => {
  const result = getDetailTestsForResult('활발한 강아지');
  assertContains(result, 'dogBreed');
});

test('"도도한 고양이" 결과가 catBreed로 연결되어야 함', () => {
  const result = getDetailTestsForResult('도도한 고양이');
  assertContains(result, 'catBreed');
});

test('"나만의 반려동물" 폴백 결과는 빈 배열이어야 함', () => {
  const result = getDetailTestsForResult('나만의 반려동물');
  assertEqual(result, []);
});

test('존재하지 않는 결과는 빈 배열 반환', () => {
  const result = getDetailTestsForResult('없는 결과');
  assertEqual(result, []);
});

// ============================================================================
// 2. CATEGORY_TO_TEST 테스트 (MEDIUM 이슈)
// ============================================================================

console.log('\n--- CATEGORY_TO_TEST 테스트 ---\n');

test('food 카테고리에 food, ramen, bread, fruit 포함', () => {
  const tests = CATEGORY_TO_TEST['food'];
  assertNotEmpty(tests, 'food 카테고리가 없음');
  assertContains(tests, 'food');
  assertContains(tests, 'ramen');
  assertContains(tests, 'bread');
  assertContains(tests, 'fruit');
});

test('beauty 카테고리에 perfume, aroma 포함', () => {
  const tests = CATEGORY_TO_TEST['beauty'];
  assertNotEmpty(tests, 'beauty 카테고리가 없음');
  assertContains(tests, 'perfume');
  assertContains(tests, 'aroma');
});

test('alcohol 카테고리에 whiskeySample 포함', () => {
  const tests = CATEGORY_TO_TEST['alcohol'];
  assertNotEmpty(tests, 'alcohol 카테고리가 없음');
  assertContains(tests, 'whiskeySample');
});

test('getTestsForCategory("food") 동작 확인', () => {
  const tests = getTestsForCategory('food');
  assertNotEmpty(tests);
  assertContains(tests, 'food');
});

test('없는 카테고리는 general 폴백', () => {
  const tests = getTestsForCategory('없는카테고리');
  assertEqual(tests, CATEGORY_TO_TEST['general']);
});

// ============================================================================
// 3. TEST_META / CATEGORY_META 테스트 (LOW 이슈)
// ============================================================================

console.log('\n--- TEST_META / CATEGORY_META 테스트 ---\n');

test('모든 CATEGORY_TO_TEST 키가 CATEGORY_META에 있어야 함', () => {
  const categories = Object.keys(CATEGORY_TO_TEST);
  const metaKeys = Object.keys(CATEGORY_META);

  const missing = categories.filter(c => !metaKeys.includes(c));
  if (missing.length > 0) {
    throw new Error(`Missing in CATEGORY_META: ${missing.join(', ')}`);
  }
});

test('whiskeySample이 TEST_META에 있어야 함', () => {
  if (!TEST_META['whiskeySample']) {
    throw new Error('whiskeySample missing');
  }
  assertEqual(TEST_META['whiskeySample'].label, '위스키 취향');
});

test('spendingStyle, travelStyle이 TEST_META에 있어야 함', () => {
  if (!TEST_META['spendingStyle']) throw new Error('spendingStyle missing');
  if (!TEST_META['travelStyle']) throw new Error('travelStyle missing');
});

test('food, ramen, bread가 TEST_META에 있어야 함', () => {
  if (!TEST_META['food']) throw new Error('food missing');
  if (!TEST_META['ramen']) throw new Error('ramen missing');
  if (!TEST_META['bread']) throw new Error('bread missing');
});

// ============================================================================
// 4. 유틸리티 함수 테스트
// ============================================================================

console.log('\n--- 유틸리티 함수 테스트 ---\n');

test('getTestConnections("petMatch") 결과 확인', () => {
  const connections = getTestConnections('petMatch');
  assertNotEmpty(connections, 'petMatch 연결이 없음');

  const types = connections.map(c => c.type);
  assertContains(types, 'quiz');
  assertContains(types, 'poll');
  assertContains(types, 'test');
});

test('getFortuneConnections("tarot") 결과 확인', () => {
  const connections = getFortuneConnections('tarot');
  assertNotEmpty(connections, 'tarot 연결이 없음');

  // tarot에서 test 타입 연결 확인
  const testConnections = connections.filter(c => c.type === 'test');
  assertNotEmpty(testConnections, 'tarot → test 연결 없음');
});

test('getTopConnections 정렬 확인', () => {
  const top = getTopConnections('human', 'test', 2);
  if (top.length < 2) {
    throw new Error('human test 연결이 2개 미만');
  }

  // relevance 내림차순 정렬 확인
  if (top[0].relevance < top[1].relevance) {
    throw new Error('relevance 정렬 오류');
  }
});

// ============================================================================
// 5. 데이터 정합성 테스트
// ============================================================================

console.log('\n--- 데이터 정합성 테스트 ---\n');

test('TEST_CONNECTIONS의 모든 from이 유효한 테스트 키', () => {
  const validTests = Object.keys(TEST_TO_CATEGORY);
  const invalidFrom = TEST_CONNECTIONS.filter(c => !validTests.includes(c.from));

  if (invalidFrom.length > 0) {
    throw new Error(`Invalid from keys: ${invalidFrom.map(c => c.from).join(', ')}`);
  }
});

test('TEST_CONNECTIONS relevance 범위 (1-5)', () => {
  const invalid = TEST_CONNECTIONS.filter(c => c.relevance < 1 || c.relevance > 5);
  if (invalid.length > 0) {
    throw new Error(`Invalid relevance: ${invalid.map(c => `${c.from}→${c.to}:${c.relevance}`).join(', ')}`);
  }
});

test('FORTUNE_CONNECTIONS relevance 범위 (1-5)', () => {
  const invalid = FORTUNE_CONNECTIONS.filter(c => c.relevance < 1 || c.relevance > 5);
  if (invalid.length > 0) {
    throw new Error(`Invalid relevance: ${invalid.map(c => `${c.from}→${c.to}:${c.relevance}`).join(', ')}`);
  }
});

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n========================================');
console.log(`테스트 결과: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
