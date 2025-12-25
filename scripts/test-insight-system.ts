/**
 * 인사이트 시스템 데이터 검증 테스트
 * 실행: npx tsx scripts/test-insight-system.mjs
 */

import {
  INSIGHT_STAGES,
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  SAMPLE_RULES,
  RULE_PLAN,
  INSIGHT_SYSTEM,
} from '../src/app/dashboard/data/insight-system.ts';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passCount = 0;
let failCount = 0;
const errors = [];

function test(name, condition, errorMsg = '') {
  if (condition) {
    passCount++;
    console.log(`  ✅ ${name}`);
  } else {
    failCount++;
    const msg = `  ❌ ${name}${errorMsg ? ': ' + errorMsg : ''}`;
    console.log(msg);
    errors.push(msg);
  }
}

function section(name) {
  console.log(`\n📋 ${name}`);
  console.log('─'.repeat(50));
}

// ============================================================================
// 1. 해금 단계 검증
// ============================================================================

section('1. 해금 단계 (INSIGHT_STAGES) 검증');

test('7단계 존재', INSIGHT_STAGES.length === 7);

test('단계 ID 순서 정확',
  INSIGHT_STAGES.every((stage, i) => stage.id === i + 1));

test('모든 단계에 필수 필드 존재',
  INSIGHT_STAGES.every(s =>
    s.id && s.name && s.emoji && s.unlockCondition &&
    s.analysisMethod && s.cost && s.description));

test('분석 방식 유효',
  INSIGHT_STAGES.every(s =>
    ['aggregation', 'rule-matching', 'ai-generation'].includes(s.analysisMethod)));

test('비용 유효',
  INSIGHT_STAGES.every(s => ['free', 'paid'].includes(s.cost)));

test('Stage 7만 유료',
  INSIGHT_STAGES.filter(s => s.cost === 'paid').length === 1 &&
  INSIGHT_STAGES.find(s => s.cost === 'paid').id === 7);

test('마지막 단계(7)는 nudgeMessage 비어있음',
  INSIGHT_STAGES[6].nudgeMessage === '');

// 해금 조건 숫자 추출 및 검증
const unlockNumbers = INSIGHT_STAGES.map(s => {
  const match = s.unlockCondition.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
});
console.log(`  📊 해금 조건 숫자: ${unlockNumbers.join(' → ')}`);

// ============================================================================
// 2. 태그 시스템 검증
// ============================================================================

section('2. 태그 시스템 검증');

test('PERSONALITY_TAGS 존재', PERSONALITY_TAGS.length > 0);
test('DECISION_TAGS 존재', DECISION_TAGS.length > 0);
test('RELATIONSHIP_TAGS 존재', RELATIONSHIP_TAGS.length > 0);

// 중복 태그 검사
const allTags = [...PERSONALITY_TAGS, ...DECISION_TAGS, ...RELATIONSHIP_TAGS];
const tagSet = new Set(allTags);
const duplicates = allTags.filter((tag, i) => allTags.indexOf(tag) !== i);

if (duplicates.length > 0) {
  test('태그 중복 없음', false, `중복: ${[...new Set(duplicates)].join(', ')}`);
} else {
  test('태그 중복 없음', true);
}

// 태그 형식 검사 (소문자, 하이픈만 허용)
const invalidTags = allTags.filter(tag => !/^[a-z]+(-[a-z]+)*$/.test(tag));
test('모든 태그 형식 유효 (소문자-하이픈)',
  invalidTags.length === 0,
  invalidTags.length > 0 ? `잘못된 형식: ${invalidTags.join(', ')}` : '');

console.log(`  📊 총 태그 수: ${allTags.length} (성격: ${PERSONALITY_TAGS.length}, 결정: ${DECISION_TAGS.length}, 관계: ${RELATIONSHIP_TAGS.length})`);

// ============================================================================
// 3. 샘플 룰 검증
// ============================================================================

section('3. 샘플 룰 (SAMPLE_RULES) 검증');

test('샘플 룰 존재', SAMPLE_RULES.length > 0);

// 룰 ID 고유성
const ruleIds = SAMPLE_RULES.map(r => r.id);
const uniqueRuleIds = new Set(ruleIds);
test('룰 ID 고유', ruleIds.length === uniqueRuleIds.size);

// 룰 필수 필드
test('모든 룰에 필수 필드 존재',
  SAMPLE_RULES.every(r =>
    r.id && r.name && r.priority !== undefined && r.category &&
    r.confidence && r.conditions && r.insight));

// 카테고리 유효성
const validCategories = ['personality', 'lifestyle', 'relationship', 'hidden'];
const invalidCategoryRules = SAMPLE_RULES.filter(r => !validCategories.includes(r.category));
test('모든 룰 카테고리 유효',
  invalidCategoryRules.length === 0,
  invalidCategoryRules.length > 0 ? `잘못된 카테고리: ${invalidCategoryRules.map(r => r.id).join(', ')}` : '');

// confidence 유효성
const validConfidence = ['high', 'medium', 'low'];
test('모든 룰 confidence 유효',
  SAMPLE_RULES.every(r => validConfidence.includes(r.confidence)));

// insight 필수 필드
test('모든 insight에 필수 필드 존재',
  SAMPLE_RULES.every(r => r.insight.title && r.insight.emoji && r.insight.description));

console.log(`  📊 샘플 룰 수: ${SAMPLE_RULES.length}`);

// ============================================================================
// 4. 룰 플랜 검증
// ============================================================================

section('4. 룰 플랜 (RULE_PLAN) 검증');

const planCategories = Object.keys(RULE_PLAN).filter(k => k !== 'total');
const planSum = planCategories.reduce((sum, k) => sum + RULE_PLAN[k].count, 0);

test('룰 플랜 합계 일치',
  planSum === RULE_PLAN.total,
  `계산: ${planSum}, 명시: ${RULE_PLAN.total}`);

console.log(`  📊 룰 플랜: ${planCategories.map(k => `${k}(${RULE_PLAN[k].count})`).join(' + ')} = ${planSum}`);

// ============================================================================
// 5. 전체 INSIGHT_SYSTEM 구조 검증
// ============================================================================

section('5. INSIGHT_SYSTEM 전체 구조 검증');

const requiredKeys = ['concept', 'stages', 'tags', 'psychology', 'rules', 'tech', 'gamification', 'business', 'roadmap', 'metrics'];
const missingKeys = requiredKeys.filter(k => !(k in INSIGHT_SYSTEM));

test('모든 최상위 키 존재',
  missingKeys.length === 0,
  missingKeys.length > 0 ? `누락: ${missingKeys.join(', ')}` : '');

test('tags.personality 존재', Array.isArray(INSIGHT_SYSTEM.tags.personality));
test('tags.decision 존재', Array.isArray(INSIGHT_SYSTEM.tags.decision));
test('tags.relationship 존재', Array.isArray(INSIGHT_SYSTEM.tags.relationship));

test('roadmap 배열', Array.isArray(INSIGHT_SYSTEM.roadmap));
test('roadmap 6단계', INSIGHT_SYSTEM.roadmap.length === 6);

// ============================================================================
// 6. 비즈니스 모델 데이터 검증
// ============================================================================

section('6. 비즈니스 모델 데이터 검증');

test('benchmarks 존재', !!INSIGHT_SYSTEM.business.benchmarks);
test('competitorAnalysis 존재', !!INSIGHT_SYSTEM.business.competitorAnalysis);
test('ourModel 존재', !!INSIGHT_SYSTEM.business.ourModel);
test('pricing 존재', !!INSIGHT_SYSTEM.business.ourModel.pricing);

// ============================================================================
// 7. 성공 지표 검증
// ============================================================================

section('7. 성공 지표 (SUCCESS_METRICS) 검증');

test('userBehavior 지표 존재',
  Array.isArray(INSIGHT_SYSTEM.metrics.userBehavior) &&
  INSIGHT_SYSTEM.metrics.userBehavior.length > 0);

test('quality 지표 존재',
  Array.isArray(INSIGHT_SYSTEM.metrics.quality) &&
  INSIGHT_SYSTEM.metrics.quality.length > 0);

test('모든 지표에 metric, target 존재',
  [...INSIGHT_SYSTEM.metrics.userBehavior, ...INSIGHT_SYSTEM.metrics.quality]
    .every(m => m.metric && m.target));

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log('📊 테스트 결과 요약');
console.log('═'.repeat(50));
console.log(`✅ 통과: ${passCount}`);
console.log(`❌ 실패: ${failCount}`);
console.log(`📈 성공률: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);

if (errors.length > 0) {
  console.log('\n⚠️ 실패한 테스트:');
  errors.forEach(e => console.log(e));
}

// 권장사항
console.log('\n💡 권장사항:');
if (duplicates.length > 0) {
  console.log(`  - 중복 태그 해결 필요: ${[...new Set(duplicates)].join(', ')}`);
}
if (SAMPLE_RULES.length < 10) {
  console.log(`  - 샘플 룰 추가 권장 (현재 ${SAMPLE_RULES.length}개, 목표 60개)`);
}

process.exit(failCount > 0 ? 1 : 0);
