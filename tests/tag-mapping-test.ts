/**
 * 테스트 결과 태그 매핑 검증
 *
 * 실행: npx tsx tests/tag-mapping-test.ts
 */

import {
  TEST_TAG_MAPPINGS,
  extractTagsFromTestResult,
  isRelationshipTest,
  getTestCategory,
} from '../src/data/insight/test-tag-mappings';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passCount++;
  } else {
    console.log(`  ❌ ${message}`);
    failCount++;
  }
}

function section(title: string): void {
  console.log(`\n📋 ${title}`);
  console.log('─'.repeat(50));
}

// ============================================================================
// 1. 매핑 레지스트리 검증
// ============================================================================

section('1. 매핑 레지스트리 검증');

const expectedTests = [
  'human', 'cat', 'dog', 'idealType', 'conflictStyle',
  'coffee', 'plant', 'petMatch', 'rabbit', 'hamster'
];

assert(Object.keys(TEST_TAG_MAPPINGS).length === 10, '10개 테스트 매핑 등록됨');

for (const testId of expectedTests) {
  assert(TEST_TAG_MAPPINGS[testId] !== undefined, `${testId} 매핑 존재`);
}

// ============================================================================
// 2. 카테고리 분류 검증
// ============================================================================

section('2. 카테고리 분류 검증');

assert(getTestCategory('human') === 'personality', 'human → personality');
assert(getTestCategory('cat') === 'pet', 'cat → pet');
assert(getTestCategory('dog') === 'pet', 'dog → pet');
assert(getTestCategory('idealType') === 'relationship', 'idealType → relationship');
assert(getTestCategory('conflictStyle') === 'relationship', 'conflictStyle → relationship');
assert(getTestCategory('coffee') === 'lifestyle', 'coffee → lifestyle');
assert(getTestCategory('unknown') === 'unknown', 'unknown 테스트 → unknown');

// ============================================================================
// 3. 관계 테스트 카운트 검증
// ============================================================================

section('3. 관계 테스트 카운트 검증');

assert(isRelationshipTest('idealType') === true, 'idealType은 관계 테스트');
assert(isRelationshipTest('conflictStyle') === true, 'conflictStyle은 관계 테스트');
assert(isRelationshipTest('human') === false, 'human은 관계 테스트 아님');
assert(isRelationshipTest('cat') === false, 'cat은 관계 테스트 아님');
assert(isRelationshipTest('coffee') === false, 'coffee는 관계 테스트 아님');

// ============================================================================
// 4. 태그 추출 테스트 - human (Big Five)
// ============================================================================

section('4. 태그 추출 - human (외향적 성격)');

// 외향적, 모험적, 공감적, 계획적, 멘탈 강한 사람
const extrovertScores = {
  inssa: 45,     // HIGH (15점 만점 중 15점 = 100%)
  adventure: 45, // HIGH
  empathy: 45,   // HIGH
  plan: 45,      // HIGH
  mental: 45,    // HIGH
};

const extrovertTags = extractTagsFromTestResult('human', extrovertScores, 15);
console.log('  추출된 태그:', extrovertTags.join(', '));

assert(extrovertTags.includes('extroverted'), '외향적 태그 포함');
assert(extrovertTags.includes('intuitive'), '직관적 태그 포함');
assert(extrovertTags.includes('emotional'), '감성적 태그 포함');
assert(extrovertTags.includes('planned'), '계획적 태그 포함');
assert(extrovertTags.includes('resilient'), '회복력 태그 포함');

// ============================================================================
// 5. 태그 추출 테스트 - human (내향적 성격)
// ============================================================================

section('5. 태그 추출 - human (내향적 성격)');

// 내향적, 안전추구, 논리적, 자유로운, 민감한 사람
const introvertScores = {
  inssa: 5,      // LOW
  adventure: 5,  // LOW
  empathy: 5,    // LOW
  plan: 5,       // LOW
  mental: 5,     // LOW
};

const introvertTags = extractTagsFromTestResult('human', introvertScores, 15);
console.log('  추출된 태그:', introvertTags.join(', '));

assert(introvertTags.includes('introverted'), '내향적 태그 포함');
assert(introvertTags.includes('analytical'), '분석적 태그 포함');
assert(introvertTags.includes('logical'), '논리적 태그 포함');
assert(introvertTags.includes('spontaneous'), '자발적 태그 포함');
assert(introvertTags.includes('sensitive'), '민감함 태그 포함');

// ============================================================================
// 6. 태그 추출 테스트 - MEDIUM 레벨은 태그 없음
// ============================================================================

section('6. 태그 추출 - MEDIUM 레벨 (중립)');

// 15문항, 5차원 → 차원당 3문항 → 차원당 최대 15점
// MEDIUM = 40%~60% = 6~9점
const neutralScores = {
  inssa: 7,      // MEDIUM (~47%)
  adventure: 8,  // MEDIUM (~53%)
  empathy: 7,    // MEDIUM (~47%)
  plan: 8,       // MEDIUM (~53%)
  mental: 7,     // MEDIUM (~47%)
};

const neutralTags = extractTagsFromTestResult('human', neutralScores, 15);
console.log('  추출된 태그 수:', neutralTags.length);
console.log('  (차원당 3문항, 최대 15점 기준 40-60% = 6-9점)');

// MEDIUM 레벨은 태그를 생성하지 않음
assert(neutralTags.length === 0, 'MEDIUM 레벨은 태그 없음');

// ============================================================================
// 7. 관계 테스트 태그 추출
// ============================================================================

section('7. 관계 테스트 태그 추출 - idealType');

const passionateScores = {
  passion: 25,   // HIGH
  commit: 25,    // HIGH
  close: 25,     // HIGH
  express: 25,   // HIGH
  active: 25,    // HIGH
};

const passionateTags = extractTagsFromTestResult('idealType', passionateScores, 15);
console.log('  추출된 태그:', passionateTags.join(', '));

assert(passionateTags.includes('expressive'), 'expressive 태그 포함');
assert(passionateTags.includes('close-bonding'), 'close-bonding 태그 포함');
assert(passionateTags.includes('future-focused'), 'future-focused 태그 포함');

// ============================================================================
// 8. 존재하지 않는 테스트 처리
// ============================================================================

section('8. 존재하지 않는 테스트 처리');

const unknownTags = extractTagsFromTestResult('unknownTest', { dim1: 50 }, 10);
assert(unknownTags.length === 0, '존재하지 않는 테스트 → 빈 배열');

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`📊 테스트 결과: ${passCount} 통과, ${failCount} 실패`);
console.log('═'.repeat(50));

if (failCount > 0) {
  process.exit(1);
}
