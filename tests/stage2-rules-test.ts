/**
 * Stage 2 성격 조합 룰 테스트
 *
 * 실행: npx tsx tests/stage2-rules-test.ts
 */

import {
  STAGE2_RULES,
  matchStage2Rules,
  getRuleById,
  getTotalRuleCount,
} from '../src/data/insight/stage2-rules';

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

function assertEqual<T>(actual: T, expected: T, message: string): void {
  const pass = actual === expected;
  if (pass) {
    console.log(`  ✅ ${message}`);
    passCount++;
  } else {
    console.log(`  ❌ ${message} (expected: ${expected}, got: ${actual})`);
    failCount++;
  }
}

function section(title: string): void {
  console.log(`\n📋 ${title}`);
  console.log('─'.repeat(50));
}

// ============================================================================
// 1. 룰 레지스트리 검증
// ============================================================================

section('1. 룰 레지스트리 검증');

assertEqual(getTotalRuleCount(), 15, '총 15개 룰 정의됨');

// ID 중복 체크
const ids = STAGE2_RULES.map(r => r.id);
const uniqueIds = new Set(ids);
assertEqual(ids.length, uniqueIds.size, '모든 룰 ID 고유함');

// 필수 필드 검증
for (const rule of STAGE2_RULES) {
  assert(rule.id.startsWith('combo-'), `${rule.id}: ID 형식 올바름`);
  assert(rule.conditions.required.length > 0, `${rule.id}: required 태그 있음`);
  assert(rule.insight.emoji.length > 0, `${rule.id}: 이모지 있음`);
  assert(rule.insight.title.length > 0, `${rule.id}: 제목 있음`);
  assert(rule.insight.description.length > 0, `${rule.id}: 설명 있음`);
}

// ============================================================================
// 2. getRuleById 테스트
// ============================================================================

section('2. getRuleById 테스트');

const rule001 = getRuleById('combo-001');
assert(rule001 !== undefined, 'combo-001 조회 성공');
assertEqual(rule001?.nameKr, '사교적인 나비', 'combo-001 이름: 사교적인 나비');

const ruleUnknown = getRuleById('unknown-rule');
assertEqual(ruleUnknown, undefined, '존재하지 않는 룰 → undefined');

// ============================================================================
// 3. 룰 매칭 - 외향적 사용자
// ============================================================================

section('3. 룰 매칭 - 외향적 사용자');

const extrovertTags = ['extroverted', 'expressive', 'together', 'adventurous', 'spontaneous'];
const extrovertMatches = matchStage2Rules(extrovertTags, 3);

console.log('  외향적 사용자 태그:', extrovertTags.join(', '));
console.log('  매칭된 룰:', extrovertMatches.map(r => r.nameKr).join(', '));

assert(extrovertMatches.length > 0, '외향적 사용자: 매칭 결과 있음');

// combo-001 (사교적인 나비)가 매칭되어야 함
const hasSocialButterfly = extrovertMatches.some(r => r.id === 'combo-001');
assert(hasSocialButterfly, '외향적 사용자: 사교적인 나비(combo-001) 매칭');

// combo-008 (모험 정신)도 매칭 가능
const hasAdventurous = extrovertMatches.some(r => r.id === 'combo-008');
assert(hasAdventurous, '외향적 사용자: 모험 정신(combo-008) 매칭');

// ============================================================================
// 4. 룰 매칭 - 내향적 사용자
// ============================================================================

section('4. 룰 매칭 - 내향적 사용자');

const introvertTags = ['introverted', 'analytical', 'solo', 'safe', 'structured'];
const introvertMatches = matchStage2Rules(introvertTags, 3);

console.log('  내향적 사용자 태그:', introvertTags.join(', '));
console.log('  매칭된 룰:', introvertMatches.map(r => r.nameKr).join(', '));

assert(introvertMatches.length > 0, '내향적 사용자: 매칭 결과 있음');

// combo-002 (조용한 관찰자)가 매칭되어야 함
const hasQuietObserver = introvertMatches.some(r => r.id === 'combo-002');
assert(hasQuietObserver, '내향적 사용자: 조용한 관찰자(combo-002) 매칭');

// combo-009 (안정적인 닻)도 매칭 가능
const hasSteadyAnchor = introvertMatches.some(r => r.id === 'combo-009');
assert(hasSteadyAnchor, '내향적 사용자: 안정적인 닻(combo-009) 매칭');

// ============================================================================
// 5. 룰 매칭 - 공감형 사용자
// ============================================================================

section('5. 룰 매칭 - 공감형 사용자');

const empatheticTags = ['supportive', 'other-first', 'collaborating', 'emotional', 'indirect'];
const empatheticMatches = matchStage2Rules(empatheticTags, 3);

console.log('  공감형 사용자 태그:', empatheticTags.join(', '));
console.log('  매칭된 룰:', empatheticMatches.map(r => r.nameKr).join(', '));

assert(empatheticMatches.length > 0, '공감형 사용자: 매칭 결과 있음');

// combo-010 (공감하는 연결자)가 매칭되어야 함
const hasEmpathicConnector = empatheticMatches.some(r => r.id === 'combo-010');
assert(hasEmpathicConnector, '공감형 사용자: 공감하는 연결자(combo-010) 매칭');

// ============================================================================
// 6. 충돌 태그 테스트
// ============================================================================

section('6. 충돌 태그 테스트');

// combo-008 (모험 정신)은 'safe' 태그가 있으면 매칭 안됨
const safeAdventurerTags = ['adventurous', 'spontaneous', 'safe'];
const safeAdventurerMatches = matchStage2Rules(safeAdventurerTags, 5);

const hasAdventurousSpirit = safeAdventurerMatches.some(r => r.id === 'combo-008');
assert(!hasAdventurousSpirit, 'safe 태그 있으면 모험 정신(combo-008) 매칭 안됨');

// ============================================================================
// 7. 매칭 없음 테스트
// ============================================================================

section('7. 매칭 없음 테스트');

const noMatchTags = ['unknown-tag-1', 'unknown-tag-2'];
const noMatches = matchStage2Rules(noMatchTags);

assertEqual(noMatches.length, 0, '매칭 태그 없으면 빈 배열');

// ============================================================================
// 8. 우선순위 검증
// ============================================================================

section('8. 우선순위 검증');

// 우선순위가 낮은 룰이 먼저 매칭되어야 함
const priorityCheck = STAGE2_RULES.every(r => r.priority >= 1 && r.priority <= 100);
assert(priorityCheck, '모든 룰 우선순위 1-100 범위');

// priority 10인 룰들 확인
const priority10Rules = STAGE2_RULES.filter(r => r.priority === 10);
assert(priority10Rules.length > 0, 'priority 10 룰 존재');
console.log(`  priority 10 룰: ${priority10Rules.map(r => r.nameKr).join(', ')}`);

// ============================================================================
// 9. 신뢰도 분포 확인
// ============================================================================

section('9. 신뢰도 분포 확인');

const highConfidence = STAGE2_RULES.filter(r => r.confidence === 'high').length;
const mediumConfidence = STAGE2_RULES.filter(r => r.confidence === 'medium').length;
const lowConfidence = STAGE2_RULES.filter(r => r.confidence === 'low').length;

console.log(`  high: ${highConfidence}개, medium: ${mediumConfidence}개, low: ${lowConfidence}개`);

assert(highConfidence >= 5, 'high 신뢰도 룰 5개 이상');
assert(mediumConfidence >= 5, 'medium 신뢰도 룰 5개 이상');

// ============================================================================
// 10. 카테고리별 룰 분포
// ============================================================================

section('10. 룰 ID 접두사 분포');

const comboRules = STAGE2_RULES.filter(r => r.id.startsWith('combo-'));
assertEqual(comboRules.length, 15, 'combo- 접두사 룰 15개');

// ID 순서 확인
const sortedIds = [...ids].sort();
assertEqual(sortedIds[0], 'combo-001', '첫 번째 ID: combo-001');
assertEqual(sortedIds[sortedIds.length - 1], 'combo-015', '마지막 ID: combo-015');

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`📊 테스트 결과: ${passCount} 통과, ${failCount} 실패`);
console.log('═'.repeat(50));

if (failCount > 0) {
  process.exit(1);
}
