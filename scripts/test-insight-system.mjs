/**
 * 인사이트 시스템 검증 스크립트
 *
 * 검증 항목:
 * 1. Stage 해금 조건 일관성
 * 2. 태그 정의 무결성
 * 3. 룰 구조 유효성
 * 4. 타입 호환성
 * 5. 중복 정의 감지
 */

// TypeScript 파일에서 named export를 가져옴
const module = await import('../src/app/dashboard/data/insight-system.ts');
const {
  INSIGHT_STAGES,
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  SAMPLE_RULES,
  RULE_PLAN,
  PRICING_TIERS,
  BUSINESS_MODEL,
} = module;

console.log('='.repeat(60));
console.log('인사이트 시스템 검증');
console.log('='.repeat(60));

let errors = 0;
let warnings = 0;

// ============================================================================
// 1. Stage 해금 조건 검증
// ============================================================================
console.log('\n[1] Stage 해금 조건 검증');

// Stage 7이 Stage 6 이후인지 확인
const stage6 = INSIGHT_STAGES.find(s => s.id === 6);
const stage7 = INSIGHT_STAGES.find(s => s.id === 7);

if (stage7.unlockCondition.includes('Stage 6')) {
  console.log('  ✅ Stage 7은 Stage 6 해금 후 가능');
} else {
  console.log('  ❌ Stage 7 조건에 Stage 6 선행 조건 없음');
  errors++;
}

// Stage 진행 조건 정보 출력 (참고용)
// Stage 5는 "관계 활동 10개"로 특정 카테고리이므로 순차 비교 대상 아님
console.log('  ℹ️ Stage 해금 조건:');
for (const s of INSIGHT_STAGES) {
  console.log(`     Stage ${s.id}: ${s.unlockCondition}`);
}

// 모든 Stage의 cost 확인
const freeStages = INSIGHT_STAGES.filter(s => s.cost === 'free');
const paidStages = INSIGHT_STAGES.filter(s => s.cost === 'paid');
console.log(`  ℹ️ 무료 Stage: ${freeStages.length}개, 유료 Stage: ${paidStages.length}개`);

if (paidStages.length === 1 && paidStages[0].id === 7) {
  console.log('  ✅ Stage 7만 유료 (의도대로)');
} else {
  console.log('  ⚠️ 유료 Stage 구성 확인 필요');
  warnings++;
}

// ============================================================================
// 2. 태그 정의 무결성
// ============================================================================
console.log('\n[2] 태그 정의 검증');

// 중복 태그 확인
const allTags = [...PERSONALITY_TAGS, ...DECISION_TAGS, ...RELATIONSHIP_TAGS];
const tagSet = new Set(allTags);
const duplicates = allTags.filter((tag, i) => allTags.indexOf(tag) !== i);

if (duplicates.length > 0) {
  console.log(`  ❌ 중복 태그 발견: ${[...new Set(duplicates)].join(', ')}`);
  errors++;
} else {
  console.log('  ✅ 태그 중복 없음');
}

// 태그 개수 확인
console.log(`  ℹ️ PERSONALITY_TAGS: ${PERSONALITY_TAGS.length}개`);
console.log(`  ℹ️ DECISION_TAGS: ${DECISION_TAGS.length}개`);
console.log(`  ℹ️ RELATIONSHIP_TAGS: ${RELATIONSHIP_TAGS.length}개`);

// 태그 명명 규칙 확인 (kebab-case 또는 lowercase)
const invalidTags = allTags.filter(tag => !/^[a-z]+(-[a-z]+)*$/.test(tag));
if (invalidTags.length > 0) {
  console.log(`  ⚠️ 명명 규칙 불일치: ${invalidTags.join(', ')}`);
  warnings++;
} else {
  console.log('  ✅ 태그 명명 규칙 일관됨 (kebab-case)');
}

// ============================================================================
// 3. 룰 구조 유효성
// ============================================================================
console.log('\n[3] 룰 구조 검증');

// 샘플 룰 수 확인
console.log(`  ℹ️ 샘플 룰: ${SAMPLE_RULES.length}개 (목표: ${RULE_PLAN.total}개)`);

// 룰 ID 중복 확인
const ruleIds = SAMPLE_RULES.map(r => r.id);
const duplicateRuleIds = ruleIds.filter((id, i) => ruleIds.indexOf(id) !== i);
if (duplicateRuleIds.length > 0) {
  console.log(`  ❌ 중복 룰 ID: ${duplicateRuleIds.join(', ')}`);
  errors++;
} else {
  console.log('  ✅ 룰 ID 중복 없음');
}

// 룰 조건에서 사용된 태그가 정의되어 있는지 확인
const definedTags = new Set(allTags);
const usedTagsInRules = [];

for (const rule of SAMPLE_RULES) {
  if (rule.conditions.tests) {
    for (const testKey of Object.keys(rule.conditions.tests)) {
      const test = rule.conditions.tests[testKey];
      if (test.tags) {
        usedTagsInRules.push(...test.tags);
      }
    }
  }
  if (rule.conditions.decisionPattern) {
    for (const pattern of rule.conditions.decisionPattern) {
      usedTagsInRules.push(pattern.tag);
    }
  }
}

const undefinedTags = usedTagsInRules.filter(tag => !definedTags.has(tag));
if (undefinedTags.length > 0) {
  console.log(`  ❌ 정의되지 않은 태그 사용: ${[...new Set(undefinedTags)].join(', ')}`);
  errors++;
} else {
  console.log('  ✅ 룰에서 사용된 태그 모두 정의됨');
}

// 룰 카테고리 분포
const categoryCount = {};
for (const rule of SAMPLE_RULES) {
  categoryCount[rule.category] = (categoryCount[rule.category] || 0) + 1;
}
console.log(`  ℹ️ 카테고리 분포: ${JSON.stringify(categoryCount)}`);

// ============================================================================
// 4. 비즈니스 모델 일관성
// ============================================================================
console.log('\n[4] 비즈니스 모델 검증');

// Stage 1-6 무료, Stage 7 유료 확인
if (BUSINESS_MODEL.ourModel.free === 'Stage 1-6 인사이트 (룰 기반)') {
  console.log('  ✅ 무료 범위: Stage 1-6 (비즈니스 모델과 일치)');
} else {
  console.log('  ⚠️ 무료 범위 확인 필요');
  warnings++;
}

// PRICING_TIERS와 Stage 정의 일치 확인
if (PRICING_TIERS.free.includes.includes('Stage 1-6 인사이트')) {
  console.log('  ✅ PRICING_TIERS와 Stage 정의 일치');
} else {
  console.log('  ⚠️ PRICING_TIERS에 Stage 정보 불일치');
  warnings++;
}

// ============================================================================
// 5. 문서-코드 정합성 (간접 확인)
// ============================================================================
console.log('\n[5] 데이터 일관성 검증');

// Stage 분석 방식 분포
const methodCount = {};
for (const stage of INSIGHT_STAGES) {
  methodCount[stage.analysisMethod] = (methodCount[stage.analysisMethod] || 0) + 1;
}
console.log(`  ℹ️ 분석 방식: ${JSON.stringify(methodCount)}`);

// Stage 6이 룰 매칭인지 확인 (AI가 아닌)
if (stage6.analysisMethod === 'rule-matching') {
  console.log('  ✅ Stage 6은 룰 매칭 (무료 유지)');
} else if (stage6.analysisMethod === 'ai-generation') {
  console.log('  ❌ Stage 6이 AI 분석으로 설정됨 (무료인데 비용 발생)');
  errors++;
}

// Stage 7만 AI인지 확인
const aiStages = INSIGHT_STAGES.filter(s => s.analysisMethod === 'ai-generation');
if (aiStages.length === 1 && aiStages[0].id === 7) {
  console.log('  ✅ Stage 7만 AI 분석 사용');
} else {
  console.log(`  ⚠️ AI 분석 Stage: ${aiStages.map(s => s.id).join(', ')}`);
  warnings++;
}

// ============================================================================
// 6. 프리미엄 기능 & 로드맵 검증
// ============================================================================
console.log('\n[6] 프리미엄 기능 & 로드맵 검증');

// PREMIUM_FEATURES 검증
const premiumFeatures = module.PREMIUM_FEATURES;
if (premiumFeatures && premiumFeatures.length > 0) {
  console.log(`  ℹ️ 프리미엄 기능: ${premiumFeatures.length}개`);

  // 모든 기능이 구독에 포함되는지 확인
  const allInSubscription = premiumFeatures.every(f => f.includedInSubscription);
  if (allInSubscription) {
    console.log('  ✅ 모든 프리미엄 기능이 구독에 포함됨');
  } else {
    const notIncluded = premiumFeatures.filter(f => !f.includedInSubscription).map(f => f.name);
    console.log(`  ℹ️ 구독 미포함 기능: ${notIncluded.join(', ')}`);
  }

  // pricingModel 분포
  const modelCount = {};
  for (const f of premiumFeatures) {
    modelCount[f.pricingModel] = (modelCount[f.pricingModel] || 0) + 1;
  }
  console.log(`  ℹ️ 가격 모델 분포: ${JSON.stringify(modelCount)}`);
} else {
  console.log('  ⚠️ PREMIUM_FEATURES 없음');
  warnings++;
}

// IMPLEMENTATION_ROADMAP 검증
const roadmap = module.IMPLEMENTATION_ROADMAP;
if (roadmap && roadmap.length > 0) {
  console.log(`  ℹ️ 로드맵 Phase: ${roadmap.length}개`);

  // 유료화가 마지막 Phase인지 확인
  const lastPhase = roadmap[roadmap.length - 1];
  if (lastPhase.title.includes('유료화') || lastPhase.phase.includes('7')) {
    console.log('  ✅ 유료화는 마지막 Phase');
  } else {
    console.log('  ⚠️ 유료화가 마지막 Phase가 아님');
    warnings++;
  }

  // Phase 번호 순차 확인
  const phases = roadmap.map(r => r.phase);
  console.log(`  ℹ️ Phase 순서: ${phases.join(' → ')}`);
} else {
  console.log('  ⚠️ IMPLEMENTATION_ROADMAP 없음');
  warnings++;
}

// PEOPLE_MATCHING_SYSTEM 검증
const peopleMatching = module.PEOPLE_MATCHING_SYSTEM;
if (peopleMatching) {
  console.log(`  ℹ️ 사람 매칭 유형: ${peopleMatching.matchTypes?.length || 0}개`);
  if (peopleMatching.tiers?.free && peopleMatching.tiers?.paid) {
    console.log('  ✅ 사람 매칭 무료/유료 티어 정의됨');
  }
}

// RELATIONSHIP_MATCH 무료/유료 구분 검증
const relationshipMatch = module.RELATIONSHIP_MATCH;
if (relationshipMatch?.tiers?.free && relationshipMatch?.tiers?.premium) {
  console.log('  ✅ 궁합 분석 무료/유료 티어 정의됨 (바이럴용 무료 포함)');
} else {
  console.log('  ⚠️ 궁합 분석 티어 정의 확인 필요');
  warnings++;
}

// ============================================================================
// 결과 요약
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('검증 결과 요약');
console.log('='.repeat(60));
console.log(`  ❌ 오류: ${errors}개`);
console.log(`  ⚠️ 경고: ${warnings}개`);

if (errors === 0 && warnings === 0) {
  console.log('\n✅ 모든 검증 통과!');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n⚠️ 경고 있음, 검토 권장');
  process.exit(0);
} else {
  console.log('\n❌ 오류 발견, 수정 필요');
  process.exit(1);
}
