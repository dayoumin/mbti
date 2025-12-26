// ============================================================================
// Stage 5-6 테스트: 관계 패턴 & 숨은 패턴
// ============================================================================
// 실행: npx tsx tests/stage5-6-test.ts

import {
  TKI_STYLES,
  RELATIONSHIP_PROFILES,
  calculateConflictStyleScores,
  findPrimaryConflictStyles,
  calculateAxisScore,
  matchRelationshipProfile,
  generateRelationshipPatternResult,
  getSummaryText as getRelationshipSummary,
} from '../src/data/insight/stage5-relationship-pattern';

import {
  CONTRADICTION_RULES,
  RARE_COMBINATIONS,
  findContradictions,
  findRarePatterns,
  analyzeConsistency,
  extractDominantTraits,
  generateHiddenPatternResult,
  getSummaryText as getHiddenSummary,
  getRarityLabel,
} from '../src/data/insight/stage6-hidden-pattern';

console.log('============================================================');
console.log(' Stage 5-6 테스트: 관계 패턴 & 숨은 패턴');
console.log('============================================================\n');

// ============================================================================
// Stage 5 테스트
// ============================================================================

console.log('💕 Stage 5: 관계 패턴 테스트');
console.log('────────────────────────────────────────');

// 테스트 데이터
const relationshipTags1 = {
  competing: 5,
  avoiding: 1,
  accommodating: 2,
  collaborating: 3,
  compromising: 2,
  'close-bonding': 8,
  'space-needing': 2,
  'self-first': 3,
  'other-first': 7,
  assertive: 2,
  diplomatic: 6,
};

const relationshipTags2 = {
  competing: 2,
  avoiding: 6,
  accommodating: 5,
  'space-needing': 7,
  'close-bonding': 2,
  'self-first': 6,
  'other-first': 3,
  assertive: 1,
  diplomatic: 4,
};

const relationshipTags3 = {
  collaborating: 8,
  assertive: 7,
  diplomatic: 2,
  'close-bonding': 5,
  'space-needing': 3,
  'other-first': 5,
  'self-first': 4,
};

// 엣지 케이스: 데이터 없음
const relationshipTags4 = {};

// 엣지 케이스: 하나만 있음
const relationshipTags5 = {
  competing: 10,
};

console.log('\n[테스트 1] 협력적 + 밀착 + 타인우선 성향');
console.log('태그:', relationshipTags1);

const conflictScores1 = calculateConflictStyleScores(relationshipTags1);
console.log('\nTKI 점수:', conflictScores1);

const { primary: primary1, secondary: secondary1 } = findPrimaryConflictStyles(conflictScores1);
console.log(`주요 스타일: ${TKI_STYLES[primary1].emoji} ${TKI_STYLES[primary1].nameKr}`);
if (secondary1) {
  console.log(`부 스타일: ${TKI_STYLES[secondary1].emoji} ${TKI_STYLES[secondary1].nameKr}`);
}

const result1 = generateRelationshipPatternResult(relationshipTags1);
console.log(`\n프로필: ${result1.profile.emoji} ${result1.profile.nameKr}`);
console.log(`설명: ${result1.profile.description}`);
console.log(`\n축 분석:`);
console.log(`  친밀도: ${result1.intimacyPreference.interpretation} (${result1.intimacyPreference.score})`);
console.log(`  배려: ${result1.careDirection.interpretation} (${result1.careDirection.score})`);
console.log(`  소통: ${result1.communicationStyle.interpretation} (${result1.communicationStyle.score})`);
console.log(`\n인사이트:`);
result1.insights.forEach(i => console.log(`  • ${i}`));

console.log('\n[테스트 2] 회피형 + 거리 + 자기우선 성향');
console.log('태그:', relationshipTags2);
const result2 = generateRelationshipPatternResult(relationshipTags2);
console.log(`\n프로필: ${result2.profile.emoji} ${result2.profile.nameKr}`);
console.log(`갈등 스타일: ${result2.conflictStyle.interpretation}`);

console.log('\n[테스트 3] 협력형 + 주장적 성향');
console.log('태그:', relationshipTags3);
const result3 = generateRelationshipPatternResult(relationshipTags3);
console.log(`\n프로필: ${result3.profile.emoji} ${result3.profile.nameKr}`);
console.log(`요약: ${getRelationshipSummary(result3)}`);

console.log('\n[테스트 4] 엣지 케이스: 데이터 없음');
const result4 = generateRelationshipPatternResult(relationshipTags4);
console.log(`프로필: ${result4.profile.emoji} ${result4.profile.nameKr} (기본값)`);

console.log('\n[테스트 5] 엣지 케이스: 하나만 있음');
const result5 = generateRelationshipPatternResult(relationshipTags5);
console.log(`프로필: ${result5.profile.emoji} ${result5.profile.nameKr}`);
console.log(`갈등 스타일: ${result5.conflictStyle.primary.nameKr}`);

// ============================================================================
// Stage 6 테스트
// ============================================================================

console.log('\n\n🔮 Stage 6: 숨은 패턴 테스트');
console.log('────────────────────────────────────────');

// 모순 있는 데이터
const hiddenTags1 = {
  extroverted: 5,
  introverted: 4,
  planned: 6,
  spontaneous: 5,
  logical: 3,
  emotional: 4,
  adventurous: 7,
  safe: 2,
};

// 희귀 조합 데이터
const hiddenTags2 = {
  introverted: 5,
  leading: 4,
  direct: 3,
  analytical: 2,
  planned: 3,
};

// 일관된 데이터 (모순 없음)
const hiddenTags3 = {
  extroverted: 10,
  spontaneous: 8,
  adventurous: 9,
  expressive: 7,
};

// 엣지 케이스: 데이터 없음
const hiddenTags4 = {};

console.log('\n[테스트 1] 모순 패턴 분석');
console.log('태그:', hiddenTags1);

const contradictions1 = findContradictions(hiddenTags1);
console.log(`\n발견된 모순: ${contradictions1.length}개`);
contradictions1.forEach(c => {
  console.log(`  ${c.emoji} ${c.interpretation}`);
  console.log(`     ${c.tagPair[0]}(${c.leftCount}) vs ${c.tagPair[1]}(${c.rightCount})`);
  console.log(`     → ${c.insight}`);
});

console.log('\n[테스트 2] 희귀 조합 분석');
console.log('태그:', hiddenTags2);

const rarePatterns2 = findRarePatterns(hiddenTags2);
console.log(`\n발견된 희귀 조합: ${rarePatterns2.length}개`);
rarePatterns2.forEach(r => {
  console.log(`  ${r.emoji} ${r.interpretation} (${getRarityLabel(r.rarity)}, ${r.percentage}%)`);
  console.log(`     태그: ${r.tags.join(', ')}`);
});

console.log('\n[테스트 3] 일관성 분석');
console.log('태그:', hiddenTags3);

const consistency3 = analyzeConsistency(hiddenTags3);
console.log(`\n일관성 점수: ${consistency3.score}% (${consistency3.level})`);
console.log(`해석: ${consistency3.interpretation}`);
console.log('상세:');
consistency3.details.forEach(d => console.log(`  • ${d}`));

console.log('\n[테스트 4] 전체 숨은 패턴 결과');
console.log('태그:', hiddenTags1);

const hiddenResult1 = generateHiddenPatternResult(hiddenTags1);
console.log(`\n요약: ${getHiddenSummary(hiddenResult1)}`);
console.log(`종합 인사이트: ${hiddenResult1.overallInsight}`);
console.log(`맞춤 메시지: ${hiddenResult1.personalizedMessage}`);

const dominantTraits1 = extractDominantTraits(hiddenTags1);
console.log('\n상위 특성:');
dominantTraits1.forEach(t => {
  console.log(`  ${t.tag}: ${t.count} (${t.category})`);
});

console.log('\n[테스트 5] 엣지 케이스: 데이터 없음');
const hiddenResult4 = generateHiddenPatternResult(hiddenTags4);
console.log(`일관성: ${hiddenResult4.consistency.interpretation}`);

// ============================================================================
// 검증 결과
// ============================================================================

console.log('\n\n============================================================');
console.log(' 검증 결과');
console.log('============================================================');

let passed = 0;
let failed = 0;

// Stage 5 검증
if (Object.keys(TKI_STYLES).length === 5) {
  console.log('✅ TKI_STYLES: 5개 정의됨');
  passed++;
} else {
  console.log(`❌ TKI_STYLES: ${Object.keys(TKI_STYLES).length}개 (예상: 5)`);
  failed++;
}

if (RELATIONSHIP_PROFILES.length === 8) {
  console.log('✅ RELATIONSHIP_PROFILES: 8개 정의됨');
  passed++;
} else {
  console.log(`❌ RELATIONSHIP_PROFILES: ${RELATIONSHIP_PROFILES.length}개 (예상: 8)`);
  failed++;
}

if (primary1 === 'competing') {
  console.log('✅ 주요 갈등 스타일 (competing): 정확');
  passed++;
} else {
  console.log(`❌ 주요 갈등 스타일: ${primary1} (예상: competing)`);
  failed++;
}

if (result1.intimacyPreference.type === 'close') {
  console.log('✅ 친밀도 선호 (close): 정확');
  passed++;
} else {
  console.log(`❌ 친밀도 선호: ${result1.intimacyPreference.type} (예상: close)`);
  failed++;
}

if (result1.careDirection.type === 'other') {
  console.log('✅ 배려 방향 (other): 정확');
  passed++;
} else {
  console.log(`❌ 배려 방향: ${result1.careDirection.type} (예상: other)`);
  failed++;
}

if (result2.conflictStyle.primary.id === 'avoiding') {
  console.log('✅ 회피형 매칭: 정확');
  passed++;
} else {
  console.log(`❌ 회피형 매칭: ${result2.conflictStyle.primary.id} (예상: avoiding)`);
  failed++;
}

if (result3.profile.id === 'confident-collaborator') {
  console.log('✅ 자신감 있는 협력가 매칭: 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭: ${result3.profile.id} (예상: confident-collaborator)`);
  failed++;
}

if (result4.profile.id === 'adaptable-relator') {
  console.log('✅ 엣지 케이스 (데이터 없음): 기본값 반환');
  passed++;
} else {
  console.log(`❌ 엣지 케이스: ${result4.profile.id} (예상: adaptable-relator)`);
  failed++;
}

// Stage 6 검증
if (CONTRADICTION_RULES.length >= 10) {
  console.log(`✅ CONTRADICTION_RULES: ${CONTRADICTION_RULES.length}개 정의됨`);
  passed++;
} else {
  console.log(`❌ CONTRADICTION_RULES: ${CONTRADICTION_RULES.length}개 (예상: 10+)`);
  failed++;
}

if (RARE_COMBINATIONS.length >= 10) {
  console.log(`✅ RARE_COMBINATIONS: ${RARE_COMBINATIONS.length}개 정의됨`);
  passed++;
} else {
  console.log(`❌ RARE_COMBINATIONS: ${RARE_COMBINATIONS.length}개 (예상: 10+)`);
  failed++;
}

if (contradictions1.length >= 2) {
  console.log(`✅ 모순 발견: ${contradictions1.length}개`);
  passed++;
} else {
  console.log(`❌ 모순 발견: ${contradictions1.length}개 (예상: 2+)`);
  failed++;
}

if (rarePatterns2.length >= 1) {
  console.log(`✅ 희귀 조합 발견: ${rarePatterns2.length}개`);
  passed++;
} else {
  console.log(`❌ 희귀 조합 발견: ${rarePatterns2.length}개 (예상: 1+)`);
  failed++;
}

if (consistency3.level === 'high') {
  console.log('✅ 일관성 분석 (high): 정확');
  passed++;
} else {
  console.log(`❌ 일관성 분석: ${consistency3.level} (예상: high)`);
  failed++;
}

if (hiddenResult1.contradictions.length >= 2) {
  console.log('✅ 전체 결과 모순 포함: 정확');
  passed++;
} else {
  console.log(`❌ 전체 결과 모순: ${hiddenResult1.contradictions.length}개 (예상: 2+)`);
  failed++;
}

if (hiddenResult4.consistency.score === 50) {
  console.log('✅ 엣지 케이스 (데이터 없음) 일관성: 기본값 50');
  passed++;
} else {
  console.log(`❌ 엣지 케이스 일관성: ${hiddenResult4.consistency.score} (예상: 50)`);
  failed++;
}

console.log('\n────────────────────────────────────────');
console.log(`총 ${passed + failed}개 테스트: ✅ ${passed} 통과, ❌ ${failed} 실패`);

if (failed === 0) {
  console.log('\n🎉 Stage 5-6 구현 완료!');
} else {
  console.log('\n⚠️ 일부 테스트 실패');
  process.exit(1);
}
