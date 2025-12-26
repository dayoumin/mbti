// ============================================================================
// Stage 3-4 테스트: 판단 스타일 & 관심사 지도
// ============================================================================
// 실행: npx tsx tests/stage3-4-test.ts

import {
  DECISION_DIMENSIONS,
  DECISION_PROFILES,
  calculateDimensionScores,
  matchDecisionProfile,
  generateDecisionStyleResult,
  dimensionToBar,
  getSummaryText,
} from '../src/data/insight/stage3-decision-style';

import {
  INTEREST_CATEGORIES,
  INTEREST_PROFILES,
  aggregateByCategory,
  generateInterestMapResult,
  interestMapToBarChart,
  getInterestSummary,
} from '../src/data/insight/stage4-interest-map';

console.log('============================================================');
console.log(' Stage 3-4 테스트: 판단 스타일 & 관심사 지도');
console.log('============================================================\n');

// ============================================================================
// Stage 3 테스트
// ============================================================================

console.log('📊 Stage 3: 판단 스타일 테스트');
console.log('────────────────────────────────────────');

// 테스트 데이터: 다양한 사용자 태그 카운트
const testTagCounts1 = {
  practical: 8,
  sentimental: 2,
  safe: 7,
  adventurous: 3,
  solo: 4,
  together: 6,
  direct: 5,
  indirect: 5,
};

const testTagCounts2 = {
  practical: 2,
  sentimental: 8,
  safe: 1,
  adventurous: 9,
  solo: 8,
  together: 2,
  direct: 3,
  indirect: 7,
};

// 2차 분류 테스트용 (1차 분류 데이터 없음)
const testTagCounts3 = {
  solo: 10,
  together: 2,
  direct: 8,
  indirect: 3,
};

const testTagCounts4 = {
  solo: 2,
  together: 9,
  direct: 1,
  indirect: 7,
};

// 추가 2차 분류 테스트
const testTagCounts5 = {
  solo: 7,
  together: 3,
  direct: 2,
  indirect: 8,
};

const testTagCounts6 = {
  solo: 1,
  together: 6,
  direct: 9,
  indirect: 2,
};

// 엣지 케이스: 데이터 없음
const testTagCounts7 = {};

// 엣지 케이스: 동점
const testTagCounts8 = {
  practical: 5,
  sentimental: 5,
  safe: 5,
  adventurous: 5,
};

// 엣지 케이스: 1차 분류 한 축만 데이터 있음 (부분 데이터)
const testTagCounts9 = {
  safe: 5,
  adventurous: 3,
  // practical/sentimental 없음 → 1차 분류 사용 불가 → 2차로 fallback
  solo: 4,
  together: 2,
  direct: 6,
  indirect: 1,
};

// 엣지 케이스: 2차 분류 한 축만 데이터 있음
const testTagCounts10 = {
  solo: 5,
  together: 3,
  // direct/indirect 없음 → 2차 분류 사용 불가 → 기본값
};

console.log('\n[테스트 1] 실용적 + 안전 추구 성향');
console.log('태그:', testTagCounts1);

const dimensions1 = calculateDimensionScores(testTagCounts1);
console.log('\n차원 점수:');
dimensions1.forEach(d => {
  const bar = dimensionToBar(d.score);
  console.log(`  ${d.dimension.emoji} ${d.dimension.nameKr}: ${bar} (${d.score > 0 ? '+' : ''}${d.score})`);
  console.log(`     → ${d.interpretation}`);
});

const profile1 = matchDecisionProfile(testTagCounts1);
console.log(`\n프로필: ${profile1.emoji} ${profile1.nameKr}`);
console.log(`설명: ${profile1.description}`);

const result1 = generateDecisionStyleResult(testTagCounts1);
console.log(`요약: ${getSummaryText(result1)}`);

console.log('\n[테스트 2] 감성적 + 모험 추구 성향');
console.log('태그:', testTagCounts2);

const dimensions2 = calculateDimensionScores(testTagCounts2);
console.log('\n차원 점수:');
dimensions2.forEach(d => {
  const bar = dimensionToBar(d.score);
  console.log(`  ${d.dimension.emoji} ${d.dimension.nameKr}: ${bar} (${d.score > 0 ? '+' : ''}${d.score})`);
  console.log(`     → ${d.interpretation}`);
});

const profile2 = matchDecisionProfile(testTagCounts2);
console.log(`\n프로필: ${profile2.emoji} ${profile2.nameKr}`);
console.log(`설명: ${profile2.description}`);

console.log('\n[테스트 3] 혼자 + 직접적 성향 (2차 분류)');
console.log('태그:', testTagCounts3);
const profile3 = matchDecisionProfile(testTagCounts3);
console.log(`\n프로필: ${profile3.emoji} ${profile3.nameKr}`);
console.log(`설명: ${profile3.description}`);

console.log('\n[테스트 4] 함께 + 간접적 성향 (2차 분류)');
console.log('태그:', testTagCounts4);
const profile4 = matchDecisionProfile(testTagCounts4);
console.log(`\n프로필: ${profile4.emoji} ${profile4.nameKr}`);
console.log(`설명: ${profile4.description}`);

console.log('\n[테스트 5] 혼자 + 간접적 성향 (2차 분류)');
console.log('태그:', testTagCounts5);
const profile5 = matchDecisionProfile(testTagCounts5);
console.log(`\n프로필: ${profile5.emoji} ${profile5.nameKr}`);
console.log(`설명: ${profile5.description}`);

console.log('\n[테스트 6] 함께 + 직접적 성향 (2차 분류)');
console.log('태그:', testTagCounts6);
const profile6 = matchDecisionProfile(testTagCounts6);
console.log(`\n프로필: ${profile6.emoji} ${profile6.nameKr}`);
console.log(`설명: ${profile6.description}`);

console.log('\n[테스트 7] 엣지 케이스: 데이터 없음');
console.log('태그:', testTagCounts7);
const profile7 = matchDecisionProfile(testTagCounts7);
console.log(`\n프로필: ${profile7.emoji} ${profile7.nameKr} (기본값)`);

console.log('\n[테스트 8] 엣지 케이스: 동점');
console.log('태그:', testTagCounts8);
const profile8 = matchDecisionProfile(testTagCounts8);
console.log(`\n프로필: ${profile8.emoji} ${profile8.nameKr} (동점 시 practical+safe 우선)`);

console.log('\n[테스트 9] 엣지 케이스: 1차 분류 부분 데이터');
console.log('태그:', testTagCounts9);
console.log('(safe/adventurous만 있고 practical/sentimental 없음 → 2차 분류로 fallback)');
const profile9 = matchDecisionProfile(testTagCounts9);
console.log(`\n프로필: ${profile9.emoji} ${profile9.nameKr}`);
console.log(`설명: ${profile9.description}`);

console.log('\n[테스트 10] 엣지 케이스: 2차 분류 부분 데이터');
console.log('태그:', testTagCounts10);
console.log('(solo/together만 있고 direct/indirect 없음 → 기본값)');
const profile10 = matchDecisionProfile(testTagCounts10);
console.log(`\n프로필: ${profile10.emoji} ${profile10.nameKr} (기본값)`);

// ============================================================================
// Stage 4 테스트
// ============================================================================

console.log('\n\n📍 Stage 4: 관심사 지도 테스트');
console.log('────────────────────────────────────────');

const interestTagCounts1 = {
  'interest-cat': 15,
  'interest-dog': 3,
  'interest-coffee': 5,
  'interest-plant': 2,
  'interest-love': 1,
};

const interestTagCounts2 = {
  'interest-coffee': 8,
  'interest-food': 6,
  'interest-love': 7,
  'interest-lifestyle': 4,
  'interest-psychology': 5,
};

console.log('\n[테스트 1] 반려동물 집중 성향');
console.log('태그:', interestTagCounts1);

const categoryMap1 = aggregateByCategory(interestTagCounts1);
console.log('\n카테고리별 집계:');
categoryMap1.forEach((count, categoryId) => {
  if (count > 0) {
    const category = INTEREST_CATEGORIES.find(c => c.id === categoryId);
    console.log(`  ${category?.emoji} ${category?.nameKr}: ${count}`);
  }
});

const interestResult1 = generateInterestMapResult(interestTagCounts1, 26);
console.log(`\n프로필: ${interestResult1.interestProfile.emoji} ${interestResult1.interestProfile.nameKr}`);
console.log(`설명: ${interestResult1.interestProfile.description}`);
console.log(`\n인사이트:`);
interestResult1.insights.forEach(insight => console.log(`  • ${insight}`));

console.log('\n바 차트:');
interestMapToBarChart(interestResult1.entries).forEach(line => console.log(`  ${line}`));

console.log('\n[테스트 2] 다양한 관심사');
console.log('태그:', interestTagCounts2);

const interestResult2 = generateInterestMapResult(interestTagCounts2, 30);
console.log(`\n프로필: ${interestResult2.interestProfile.emoji} ${interestResult2.interestProfile.nameKr}`);
console.log(`요약: ${getInterestSummary(interestResult2)}`);

console.log('\n바 차트:');
interestMapToBarChart(interestResult2.entries).forEach(line => console.log(`  ${line}`));

// ============================================================================
// 검증 결과
// ============================================================================

console.log('\n\n============================================================');
console.log(' 검증 결과');
console.log('============================================================');

let passed = 0;
let failed = 0;

// Stage 3 검증
if (DECISION_DIMENSIONS.length === 4) {
  console.log('✅ DECISION_DIMENSIONS: 4개 정의됨');
  passed++;
} else {
  console.log(`❌ DECISION_DIMENSIONS: ${DECISION_DIMENSIONS.length}개 (예상: 4)`);
  failed++;
}

if (DECISION_PROFILES.length === 8) {
  console.log('✅ DECISION_PROFILES: 8개 정의됨');
  passed++;
} else {
  console.log(`❌ DECISION_PROFILES: ${DECISION_PROFILES.length}개 (예상: 8)`);
  failed++;
}

if (profile1.id === 'practical-safe') {
  console.log('✅ 프로필 매칭 (실용+안전): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (실용+안전): ${profile1.id} (예상: practical-safe)`);
  failed++;
}

if (profile2.id === 'emotional-adventurous') {
  console.log('✅ 프로필 매칭 (감성+모험): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (감성+모험): ${profile2.id} (예상: emotional-adventurous)`);
  failed++;
}

// 2차 분류 프로필 테스트
if (profile3.id === 'solo-direct') {
  console.log('✅ 프로필 매칭 (혼자+직접): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (혼자+직접): ${profile3.id} (예상: solo-direct)`);
  failed++;
}

if (profile4.id === 'together-indirect') {
  console.log('✅ 프로필 매칭 (함께+간접): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (함께+간접): ${profile4.id} (예상: together-indirect)`);
  failed++;
}

// 추가 2차 분류 테스트
if (profile5.id === 'solo-indirect') {
  console.log('✅ 프로필 매칭 (혼자+간접): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (혼자+간접): ${profile5.id} (예상: solo-indirect)`);
  failed++;
}

if (profile6.id === 'together-direct') {
  console.log('✅ 프로필 매칭 (함께+직접): 정확');
  passed++;
} else {
  console.log(`❌ 프로필 매칭 (함께+직접): ${profile6.id} (예상: together-direct)`);
  failed++;
}

// 엣지 케이스 테스트
if (profile7.id === 'together-indirect') {
  console.log('✅ 엣지 케이스 (데이터 없음): 기본값 반환');
  passed++;
} else {
  console.log(`❌ 엣지 케이스 (데이터 없음): ${profile7.id} (예상: together-indirect)`);
  failed++;
}

if (profile8.id === 'practical-safe') {
  console.log('✅ 엣지 케이스 (동점): practical+safe 우선');
  passed++;
} else {
  console.log(`❌ 엣지 케이스 (동점): ${profile8.id} (예상: practical-safe)`);
  failed++;
}

// 부분 데이터 테스트
if (profile9.id === 'solo-direct') {
  console.log('✅ 엣지 케이스 (1차 부분 데이터): 2차 분류로 fallback');
  passed++;
} else {
  console.log(`❌ 엣지 케이스 (1차 부분 데이터): ${profile9.id} (예상: solo-direct)`);
  failed++;
}

if (profile10.id === 'together-indirect') {
  console.log('✅ 엣지 케이스 (2차 부분 데이터): 기본값 반환');
  passed++;
} else {
  console.log(`❌ 엣지 케이스 (2차 부분 데이터): ${profile10.id} (예상: together-indirect)`);
  failed++;
}

// Stage 4 검증
if (INTEREST_CATEGORIES.length === 6) {
  console.log('✅ INTEREST_CATEGORIES: 6개 정의됨');
  passed++;
} else {
  console.log(`❌ INTEREST_CATEGORIES: ${INTEREST_CATEGORIES.length}개 (예상: 6)`);
  failed++;
}

if (INTEREST_PROFILES.length === 7) {
  console.log('✅ INTEREST_PROFILES: 7개 정의됨');
  passed++;
} else {
  console.log(`❌ INTEREST_PROFILES: ${INTEREST_PROFILES.length}개 (예상: 7)`);
  failed++;
}

if (interestResult1.interestProfile.id === 'pet-lover') {
  console.log('✅ 관심사 프로필 (반려동물): 정확');
  passed++;
} else {
  console.log(`❌ 관심사 프로필: ${interestResult1.interestProfile.id} (예상: pet-lover)`);
  failed++;
}

if (interestResult1.topCategory?.id === 'pets') {
  console.log('✅ 상위 카테고리: 반려동물');
  passed++;
} else {
  console.log(`❌ 상위 카테고리: ${interestResult1.topCategory?.id} (예상: pets)`);
  failed++;
}

console.log('\n────────────────────────────────────────');
console.log(`총 ${passed + failed}개 테스트: ✅ ${passed} 통과, ❌ ${failed} 실패`);

if (failed === 0) {
  console.log('\n🎉 Stage 3-4 구현 완료!');
} else {
  console.log('\n⚠️ 일부 테스트 실패');
  process.exit(1);
}
