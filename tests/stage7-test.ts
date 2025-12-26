// ============================================================================
// Stage 7 테스트: AI 종합 분석
// ============================================================================
// 실행: npx tsx tests/stage7-test.ts

import {
  generateFallbackReport,
  summarizeStage2Rules,
  summarizeStage3Result,
  summarizeStage4Result,
  summarizeStage5Result,
  summarizeStage6Result,
  generateSystemPrompt,
  generateUserPrompt,
  type AIAnalysisInput,
  type AIAnalysisResult,
} from '../src/data/insight/stage7-ai-analysis';

console.log('============================================================');
console.log(' Stage 7 테스트: AI 종합 분석');
console.log('============================================================\n');

// ============================================================================
// 테스트 데이터
// ============================================================================

const testInput: AIAnalysisInput = {
  activitySummary: {
    totalTests: 5,
    totalPolls: 15,
    totalQuizzes: 10,
    totalActivities: 30,
    activeDays: 7,
  },
  insights: {
    stage1: {
      testCount: 5,
      dominantTags: ['extroverted', 'logical', 'planned'],
    },
    stage2: {
      matchedRulesCount: 3,
      topRules: [
        { title: '논리적 외향인', description: '분석력과 소통력을 겸비한 타입' },
        { title: '계획적 리더', description: '체계적으로 이끄는 성향' },
      ],
    },
    stage3: {
      profileName: '실용적 모험가',
      dimensions: [
        { name: '실용-감성', score: 30, interpretation: '실용적 성향' },
        { name: '안전-모험', score: -20, interpretation: '적당한 모험 추구' },
      ],
    },
    stage4: {
      profileName: '탐구적 관심가',
      topInterests: [
        { category: '동물', percentage: 35 },
        { category: '음식', percentage: 25 },
        { category: '취미', percentage: 20 },
      ],
    },
    stage5: {
      profileName: '자신감 있는 협력가',
      conflictStyle: '협력형',
      intimacyPreference: '밀착형',
      careDirection: '타인 우선',
    },
    stage6: {
      consistencyScore: 75,
      contradictions: [
        { pattern: '외향-내향 혼재', insight: '상황에 따라 유연하게 적응' },
      ],
      rarePatterns: ['논리적이면서 감성적인 리더'],
    },
  },
  tagDistribution: [
    { tag: 'extroverted', count: 12, percentage: 20, category: 'personality' },
    { tag: 'logical', count: 10, percentage: 17, category: 'personality' },
    { tag: 'planned', count: 8, percentage: 13, category: 'personality' },
    { tag: 'collaborating', count: 7, percentage: 12, category: 'relationship' },
    { tag: 'practical', count: 6, percentage: 10, category: 'decision' },
    { tag: 'interest-cat', count: 5, percentage: 8, category: 'interest' },
    { tag: 'together', count: 5, percentage: 8, category: 'decision' },
    { tag: 'adventurous', count: 4, percentage: 7, category: 'decision' },
    { tag: 'direct', count: 3, percentage: 5, category: 'decision' },
  ],
};

// 최소 데이터
const minimalInput: AIAnalysisInput = {
  activitySummary: {
    totalTests: 1,
    totalPolls: 0,
    totalQuizzes: 0,
    totalActivities: 1,
    activeDays: 1,
  },
  insights: {
    stage1: { testCount: 1, dominantTags: ['introverted'] },
    stage2: null,
    stage3: null,
    stage4: null,
    stage5: null,
    stage6: null,
  },
  tagDistribution: [
    { tag: 'introverted', count: 1, percentage: 100, category: 'personality' },
  ],
};

// ============================================================================
// 폴백 리포트 테스트
// ============================================================================

console.log('🤖 폴백 리포트 생성 테스트');
console.log('────────────────────────────────────────\n');

console.log('[테스트 1] 풍부한 데이터로 리포트 생성');
const report1 = generateFallbackReport(testInput);

console.log('\n핵심 정체성:');
console.log(`  "${report1.coreIdentity}"`);

console.log('\n핵심 특성:');
report1.keyTraits.forEach((trait, i) => {
  console.log(`  ${i + 1}. ${trait.emoji} ${trait.trait} (${trait.strength})`);
  console.log(`     ${trait.description}`);
});

console.log('\n강점:');
report1.strengths.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.title}`);
  console.log(`     ${s.description}`);
});

console.log('\n성장 포인트:');
report1.growthAreas.forEach((g, i) => {
  console.log(`  ${i + 1}. ${g.title}`);
  console.log(`     팁: ${g.tips[0]}`);
});

console.log('\n관계 스타일:');
console.log(`  요약: ${report1.relationshipStyle.summary}`);
console.log(`  호환: ${report1.relationshipStyle.compatibleTypes.join(', ')}`);

console.log('\n숨겨진 가능성:');
console.log(`  ${report1.hiddenPotential.title}`);
console.log(`  ${report1.hiddenPotential.description}`);

console.log('\n메타 정보:');
console.log(`  데이터 포인트: ${report1.meta.dataPoints}개`);
console.log(`  신뢰도: ${report1.meta.confidenceLevel}`);

// ============================================================================
// 최소 데이터 테스트
// ============================================================================

console.log('\n\n[테스트 2] 최소 데이터로 리포트 생성');
const report2 = generateFallbackReport(minimalInput);

console.log('\n핵심 정체성:');
console.log(`  "${report2.coreIdentity}"`);

console.log('\n핵심 특성 수:', report2.keyTraits.length);
console.log('신뢰도:', report2.meta.confidenceLevel);

// ============================================================================
// 프롬프트 생성 테스트
// ============================================================================

console.log('\n\n📝 프롬프트 생성 테스트');
console.log('────────────────────────────────────────\n');

const systemPrompt = generateSystemPrompt();
console.log('[시스템 프롬프트 미리보기]');
console.log(systemPrompt.substring(0, 200) + '...');

const userPrompt = generateUserPrompt(testInput);
console.log('\n[사용자 프롬프트 미리보기]');
console.log(userPrompt.substring(0, 500) + '...');
console.log(`\n(전체 길이: ${userPrompt.length}자)`);

// ============================================================================
// 검증 결과
// ============================================================================

console.log('\n\n============================================================');
console.log(' 검증 결과');
console.log('============================================================');

let passed = 0;
let failed = 0;

// 리포트 구조 검증
if (report1.coreIdentity && report1.coreIdentity.length > 0) {
  console.log('✅ coreIdentity: 생성됨');
  passed++;
} else {
  console.log('❌ coreIdentity: 누락');
  failed++;
}

if (report1.keyTraits.length === 5) {
  console.log('✅ keyTraits: 5개 생성됨');
  passed++;
} else {
  console.log(`❌ keyTraits: ${report1.keyTraits.length}개 (예상: 5)`);
  failed++;
}

if (report1.strengths.length === 3) {
  console.log('✅ strengths: 3개 생성됨');
  passed++;
} else {
  console.log(`❌ strengths: ${report1.strengths.length}개 (예상: 3)`);
  failed++;
}

if (report1.growthAreas.length === 2) {
  console.log('✅ growthAreas: 2개 생성됨');
  passed++;
} else {
  console.log(`❌ growthAreas: ${report1.growthAreas.length}개 (예상: 2)`);
  failed++;
}

if (report1.personalizedAdvice.length === 3) {
  console.log('✅ personalizedAdvice: 3개 생성됨');
  passed++;
} else {
  console.log(`❌ personalizedAdvice: ${report1.personalizedAdvice.length}개 (예상: 3)`);
  failed++;
}

if (report1.meta.confidenceLevel === 'high') {
  console.log('✅ confidenceLevel: high (30개 활동)');
  passed++;
} else {
  console.log(`❌ confidenceLevel: ${report1.meta.confidenceLevel} (예상: high)`);
  failed++;
}

if (report2.meta.confidenceLevel === 'low') {
  console.log('✅ confidenceLevel: low (1개 활동)');
  passed++;
} else {
  console.log(`❌ confidenceLevel: ${report2.meta.confidenceLevel} (예상: low)`);
  failed++;
}

// 프롬프트 검증
if (systemPrompt.includes('심리학') && systemPrompt.includes('JSON')) {
  console.log('✅ systemPrompt: 핵심 키워드 포함');
  passed++;
} else {
  console.log('❌ systemPrompt: 핵심 키워드 누락');
  failed++;
}

if (userPrompt.includes('활동 요약') && userPrompt.includes('태그 분포')) {
  console.log('✅ userPrompt: 필수 섹션 포함');
  passed++;
} else {
  console.log('❌ userPrompt: 필수 섹션 누락');
  failed++;
}

// keyTraits strength 검증
if (report1.keyTraits[0].strength === 'very-strong') {
  console.log('✅ 첫 번째 특성 strength: very-strong');
  passed++;
} else {
  console.log(`❌ 첫 번째 특성 strength: ${report1.keyTraits[0].strength} (예상: very-strong)`);
  failed++;
}

// ============================================================================
// 태그 매핑 테스트 (추가된 관계/관심사 태그)
// ============================================================================

console.log('\n\n🏷️ 태그 매핑 테스트');
console.log('────────────────────────────────────────\n');

// 관계 스타일 태그 테스트 (SSOT: insight-tags.ts 기준 유효 태그 사용)
const relationshipTagInput: AIAnalysisInput = {
  activitySummary: { totalTests: 3, totalPolls: 10, totalQuizzes: 5, totalActivities: 18, activeDays: 3 },
  insights: {
    stage1: { testCount: 3, dominantTags: ['collaborating', 'close-bonding', 'other-first'] },
    stage2: null, stage3: null, stage4: null, stage5: null, stage6: null,
  },
  tagDistribution: [
    { tag: 'collaborating', count: 8, percentage: 30, category: 'relationship' },
    { tag: 'close-bonding', count: 6, percentage: 22, category: 'relationship' },
    { tag: 'other-first', count: 5, percentage: 19, category: 'relationship' },
    { tag: 'diplomatic', count: 4, percentage: 15, category: 'relationship' },
    { tag: 'interest-cat', count: 4, percentage: 14, category: 'interest' },  // SSOT 유효 태그
  ],
};

const relationReport = generateFallbackReport(relationshipTagInput);

console.log('[테스트 3] 관계/관심사 태그 매핑');
console.log('\n핵심 정체성:');
console.log(`  "${relationReport.coreIdentity}"`);

console.log('\n핵심 특성:');
relationReport.keyTraits.forEach((trait, i) => {
  console.log(`  ${i + 1}. ${trait.emoji} ${trait.trait} (${trait.strength})`);
});

// 관계 태그 매핑 검증
if (relationReport.coreIdentity.includes('협력') || relationReport.coreIdentity.includes('파트너')) {
  console.log('\n✅ 관계 태그 coreIdentity 매핑: 정상');
  passed++;
} else {
  console.log(`\n❌ 관계 태그 coreIdentity 매핑: "${relationReport.coreIdentity}" (협력 관련 문구 예상)`);
  failed++;
}

// 관계 태그 이름 검증
const hasRelationshipTraitName = relationReport.keyTraits.some(t =>
  t.trait === '협력형' || t.trait === '밀착형' || t.trait === '타인 우선'
);
if (hasRelationshipTraitName) {
  console.log('✅ 관계 태그 traitName 매핑: 정상');
  passed++;
} else {
  console.log('❌ 관계 태그 traitName 매핑: 한글 이름 예상');
  failed++;
}

// 관심사 태그 매핑 검증 (interest-cat → 고양이)
const hasInterestTrait = relationReport.keyTraits.some(t =>
  t.trait.includes('고양이') || t.emoji === '🐱'
);
if (hasInterestTrait) {
  console.log('✅ interest-cat 태그 매핑: 정상');
  passed++;
} else {
  console.log('❌ interest-cat 태그 매핑: 고양이 관련 특성 예상');
  failed++;
}

// 신뢰도 검증 (18개 활동 = medium)
if (relationReport.meta.confidenceLevel === 'medium') {
  console.log('✅ confidenceLevel: medium (18개 활동)');
  passed++;
} else {
  console.log(`❌ confidenceLevel: ${relationReport.meta.confidenceLevel} (예상: medium)`);
  failed++;
}

console.log('\n────────────────────────────────────────');
console.log(`총 ${passed + failed}개 테스트: ✅ ${passed} 통과, ❌ ${failed} 실패`);

if (failed === 0) {
  console.log('\n🎉 Stage 7 구현 완료!');
} else {
  console.log('\n⚠️ 일부 테스트 실패');
  process.exit(1);
}
