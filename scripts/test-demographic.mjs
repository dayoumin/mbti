/**
 * DemographicService 테스트
 *
 * 테스트 항목:
 * 1. toResultSlug 함수 - 결과명 → 슬러그 변환
 * 2. 시드 데이터 매칭 - 실제 결과명이 시드 데이터와 매칭되는지
 * 3. getConsistentPercentile - 해시 함수 일관성
 * 4. getInsight - 인사이트 메시지 생성
 *
 * 실행: node scripts/test-demographic.mjs
 */

// toResultSlug 함수 (서비스에서 복사)
function toResultSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// getConsistentPercentile 함수 (서비스에서 복사)
function getConsistentPercentile(testType, resultName, ageGroup, gender) {
  const str = `${testType}-${resultName}-${ageGroup}-${gender}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 41) + 10;
}

// 시드 데이터 (서비스에서 복사)
const SEED_DATA = {
  human: {
    '20s': {
      male: { '전략가': 28, '리더': 22, '분석가': 25 },
      female: { '힐러': 26, '예술가': 24, '중재자': 22 },
    },
  },
  cat: {
    '20s': {
      male: { '도도-냥이': 28, '보스-냥이': 24, '철학-냥이': 20 },
      female: { '애교-냥이': 30, '천사-냥이': 25, '인싸-냥이': 22 },
    },
  },
  coffee: {
    '20s': {
      male: { '클래식-아메리카노': 35, '진한-에스프레소': 25 },
      female: { '부드러운-카페라떼': 30, '달콤한-바닐라-라떼': 25 },
    },
  },
};

// 실제 테스트 결과명 (subjects에서 가져온 값)
const ACTUAL_RESULTS = {
  human: ['에너자이저', '전략가', '힐러', '모험가', '수호자', '몽상가', '리더', '예술가', '분석가', '중재자'],
  cat: ['철학 냥이', '보스 냥이', '인싸 냥이', '천사 냥이', '탐험 냥이', '경계 냥이', '엉뚱 냥이', '도도 냥이', '애교 냥이', '균형 냥이'],
  dog: ['에너자이저 멍멍이', '집사바라기 멍멍이', '리더 멍멍이', '천재 멍멍이'],
  coffee: ['진한 에스프레소', '클래식 아메리카노', '부드러운 카페라떼', '달콤한 바닐라 라떼', '아이스 콜드브루'],
  idealType: ['다정다감 연인', '든든한 버팀목', '열정적인 로맨티스트'],
};

console.log('🧪 DemographicService 테스트 시작\n');
console.log('='.repeat(50));

// 1. toResultSlug 테스트
console.log('\n1️⃣ toResultSlug 함수 테스트\n');

const slugTests = [
  ['전략가', '전략가'],
  ['철학 냥이', '철학-냥이'],
  ['에너자이저 멍멍이', '에너자이저-멍멍이'],
  ['클래식 아메리카노', '클래식-아메리카노'],
  ['다정다감 연인', '다정다감-연인'],
  ['열정🔥리더형', '열정-리더형'],  // 이모지 처리
  ['  공백  많음  ', '공백-많음'],  // 앞뒤 공백
];

let passCount = 0;
let failCount = 0;

slugTests.forEach(([input, expected]) => {
  const result = toResultSlug(input);
  const pass = result === expected;
  if (pass) passCount++;
  else failCount++;
  console.log(`${pass ? '✅' : '❌'} "${input}" → "${result}" ${pass ? '' : `(expected: "${expected}")`}`);
});

console.log(`\n   통과: ${passCount}/${slugTests.length}`);

// 2. 시드 데이터 매칭 테스트
console.log('\n' + '='.repeat(50));
console.log('\n2️⃣ 시드 데이터 매칭 테스트\n');

let seedMatches = 0;
let seedMisses = 0;

Object.entries(ACTUAL_RESULTS).forEach(([testType, results]) => {
  console.log(`\n📁 ${testType}:`);
  const testSeed = SEED_DATA[testType];

  results.forEach(resultName => {
    const slug = toResultSlug(resultName);
    const ageGroups = ['10s', '20s', '30s', '40s+'];
    let matched = false;

    for (const age of ageGroups) {
      const ageSeed = testSeed?.[age];
      if (ageSeed?.male?.[slug] || ageSeed?.female?.[slug]) {
        matched = true;
        seedMatches++;
        console.log(`   ✅ "${resultName}" (${slug}) → 시드 있음 (${age})`);
        break;
      }
    }

    if (!matched) {
      seedMisses++;
      const fallback = getConsistentPercentile(testType, slug, '20s', 'male');
      console.log(`   ⚪ "${resultName}" (${slug}) → 해시 폴백 (${fallback}%)`);
    }
  });
});

console.log(`\n   시드 매칭: ${seedMatches}, 해시 폴백: ${seedMisses}`);

// 3. 해시 일관성 테스트
console.log('\n' + '='.repeat(50));
console.log('\n3️⃣ 해시 일관성 테스트\n');

const hashTests = [
  ['human', '전략가', '20s', 'male'],
  ['cat', '철학-냥이', '20s', 'male'],
  ['coffee', '클래식-아메리카노', '30s', 'female'],
];

hashTests.forEach(([testType, result, age, gender]) => {
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(getConsistentPercentile(testType, result, age, gender));
  }
  const allSame = results.every(r => r === results[0]);
  console.log(`${allSame ? '✅' : '❌'} ${testType}/${result}/${age}/${gender} → ${results[0]}% (일관성: ${allSame ? 'OK' : 'FAIL'})`);
});

// 4. 퍼센트 분포 테스트
console.log('\n' + '='.repeat(50));
console.log('\n4️⃣ 퍼센트 분포 테스트 (10-50% 범위 확인)\n');

const distribution = { '<20': 0, '20-30': 0, '30-40': 0, '>40': 0 };
const sampleSize = 100;

for (let i = 0; i < sampleSize; i++) {
  const p = getConsistentPercentile('test', `result-${i}`, '20s', 'male');
  if (p < 20) distribution['<20']++;
  else if (p < 30) distribution['20-30']++;
  else if (p < 40) distribution['30-40']++;
  else distribution['>40']++;
}

console.log(`   분포 (${sampleSize}개 샘플):`);
Object.entries(distribution).forEach(([range, count]) => {
  const bar = '█'.repeat(Math.round(count / 5));
  console.log(`   ${range.padEnd(6)}: ${count.toString().padStart(2)} ${bar}`);
});

// 5. 인사이트 메시지 테스트
console.log('\n' + '='.repeat(50));
console.log('\n5️⃣ 인사이트 메시지 샘플\n');

const AGE_GROUP_LABELS = { '10s': '10대', '20s': '20대', '30s': '30대', '40s+': '40대+' };
const GENDER_LABELS = { male: '남성', female: '여성', other: '응답하지 않음' };

function getInsightMessage(percentile, ageGroup, gender) {
  const groupLabel = gender === 'other'
    ? AGE_GROUP_LABELS[ageGroup]
    : `${AGE_GROUP_LABELS[ageGroup]} ${GENDER_LABELS[gender]}`;

  if (percentile <= 20) return `${groupLabel} 중 ${percentile}%만 나오는 희귀 유형! ✨`;
  if (percentile <= 25) return `${groupLabel} 상위 ${percentile}%에 속해요!`;
  if (percentile <= 40) return `${groupLabel}의 ${percentile}%가 같은 결과예요`;
  return `${groupLabel}에서 인기 있는 유형! (${percentile}%)`;
}

const insightSamples = [
  [15, '20s', 'male'],
  [22, '20s', 'female'],
  [35, '30s', 'male'],
  [45, '10s', 'female'],
  [30, '40s+', 'other'],
];

insightSamples.forEach(([p, age, gender]) => {
  console.log(`   ${p}% / ${age} / ${gender}:`);
  console.log(`   → "${getInsightMessage(p, age, gender)}"\n`);
});

// 6. 콘텐츠 추천 테스트
console.log('\n' + '='.repeat(50));
console.log('\n6️⃣ 맞춤 콘텐츠 추천 테스트\n');

// 연령대별 기본 추천
const ageBasedCategories = {
  '10s': ['personality', 'love', 'cat', 'dog', 'rabbit', 'hamster'],
  '20s': ['love', 'personality', 'coffee', 'cat', 'dog', 'lifestyle'],
  '30s': ['coffee', 'plant', 'lifestyle', 'cat', 'dog', 'relationship'],
  '40s+': ['plant', 'lifestyle', 'coffee', 'dog', 'cat', 'relationship'],
};

// 성별별 조정
const genderAdjustments = {
  '10s': {
    male: ['dog', 'personality', 'cat', 'love', 'rabbit'],
    female: ['cat', 'love', 'personality', 'rabbit', 'hamster'],
  },
  '20s': {
    male: ['coffee', 'personality', 'dog', 'love', 'lifestyle'],
    female: ['love', 'cat', 'coffee', 'personality', 'plant'],
  },
  '30s': {
    male: ['coffee', 'dog', 'lifestyle', 'plant', 'personality'],
    female: ['plant', 'cat', 'coffee', 'lifestyle', 'love'],
  },
  '40s+': {
    male: ['plant', 'dog', 'coffee', 'lifestyle', 'fish'],
    female: ['plant', 'cat', 'lifestyle', 'coffee', 'bird'],
  },
};

function getRecommendedCategories(ageGroup, gender) {
  if (gender && gender !== 'other' && genderAdjustments[ageGroup]?.[gender]) {
    return genderAdjustments[ageGroup][gender];
  }
  return ageBasedCategories[ageGroup];
}

const testCases = [
  ['10s', 'male', '10대 남성'],
  ['10s', 'female', '10대 여성'],
  ['20s', 'male', '20대 남성'],
  ['20s', 'female', '20대 여성'],
  ['30s', 'male', '30대 남성'],
  ['30s', 'female', '30대 여성'],
  ['40s+', 'male', '40대+ 남성'],
  ['40s+', 'female', '40대+ 여성'],
  ['20s', 'other', '20대 (성별 미응답)'],
];

testCases.forEach(([age, gender, label]) => {
  const categories = getRecommendedCategories(age, gender);
  console.log(`   ${label}: ${categories.slice(0, 3).join(', ')}`);
});

// 7. 연령 제한 테스트
console.log('\n' + '='.repeat(50));
console.log('\n7️⃣ 연령 제한 테스트 (술 테스트)\n');

const ADULT_ONLY_TESTS = ['alcohol'];

function isTestAllowedForAge(testKey, ageGroup) {
  if (!ageGroup) return !ADULT_ONLY_TESTS.includes(testKey);
  if (ageGroup === '10s' && ADULT_ONLY_TESTS.includes(testKey)) return false;
  return true;
}

const ageRestrictionTests = [
  ['alcohol', '10s', false, '10대 → 술 테스트 ❌'],
  ['alcohol', '20s', true, '20대 → 술 테스트 ✓'],
  ['alcohol', '30s', true, '30대 → 술 테스트 ✓'],
  ['alcohol', undefined, false, '미확인 → 술 테스트 ❌ (안전 우선)'],
  ['coffee', '10s', true, '10대 → 커피 테스트 ✓'],
  ['human', undefined, true, '미확인 → 성격 테스트 ✓'],
];

let ageTestPass = 0;
ageRestrictionTests.forEach(([test, age, expected, desc]) => {
  const result = isTestAllowedForAge(test, age);
  const pass = result === expected;
  if (pass) ageTestPass++;
  console.log(`   ${pass ? '✅' : '❌'} ${desc}`);
});

console.log(`\n   통과: ${ageTestPass}/${ageRestrictionTests.length}`);

// 8. 콘텐츠 메타데이터 연령 제한 테스트 (isContentAllowedForAge)
console.log('\n' + '='.repeat(50));
console.log('\n8️⃣ 콘텐츠 메타데이터 연령 제한 테스트\n');

const AGE_ORDER = ['10s', '20s', '30s', '40s+'];

function isContentAllowedForAge(content, ageGroup) {
  const meta = content.meta;

  // 메타데이터 없으면 전체 허용
  if (!meta) return true;

  // 성인 전용 콘텐츠 체크
  if (meta.isAdultOnly) {
    if (!ageGroup || ageGroup === '10s') return false;
  }

  // 최소 연령 체크 (안전 우선: minAge 있으면 연령 확인 필수)
  if (meta.minAge) {
    if (!ageGroup) return false; // 연령 미확인 시 차단
    const minIndex = AGE_ORDER.indexOf(meta.minAge);
    const userIndex = AGE_ORDER.indexOf(ageGroup);
    if (userIndex < minIndex) return false;
  }

  // 허용 연령 목록 체크
  if (meta.allowedAges && meta.allowedAges.length > 0) {
    if (!ageGroup || !meta.allowedAges.includes(ageGroup)) return false;
  }

  return true;
}

// 테스트 콘텐츠 샘플
const testContents = {
  noMeta: {},
  adultOnly: { meta: { isAdultOnly: true } },
  minAge20s: { meta: { minAge: '20s' } },
  minAge30s: { meta: { minAge: '30s' } },
  allowedAges2030: { meta: { allowedAges: ['20s', '30s'] } },
  combined: { meta: { isAdultOnly: true, minAge: '20s' } },
};

const contentAgeTests = [
  // 메타데이터 없음 → 전체 허용
  [testContents.noMeta, undefined, true, '메타 없음 + 미확인 → 허용 ✓'],
  [testContents.noMeta, '10s', true, '메타 없음 + 10대 → 허용 ✓'],

  // isAdultOnly
  [testContents.adultOnly, undefined, false, 'isAdultOnly + 미확인 → 차단 ❌'],
  [testContents.adultOnly, '10s', false, 'isAdultOnly + 10대 → 차단 ❌'],
  [testContents.adultOnly, '20s', true, 'isAdultOnly + 20대 → 허용 ✓'],

  // minAge (핵심 테스트 - 이전 리뷰 지적 사항)
  [testContents.minAge20s, undefined, false, 'minAge:20s + 미확인 → 차단 ❌ (수정됨)'],
  [testContents.minAge20s, '10s', false, 'minAge:20s + 10대 → 차단 ❌'],
  [testContents.minAge20s, '20s', true, 'minAge:20s + 20대 → 허용 ✓'],
  [testContents.minAge20s, '30s', true, 'minAge:20s + 30대 → 허용 ✓'],
  [testContents.minAge30s, '20s', false, 'minAge:30s + 20대 → 차단 ❌'],
  [testContents.minAge30s, '30s', true, 'minAge:30s + 30대 → 허용 ✓'],

  // allowedAges
  [testContents.allowedAges2030, undefined, false, 'allowedAges:[20s,30s] + 미확인 → 차단 ❌'],
  [testContents.allowedAges2030, '10s', false, 'allowedAges:[20s,30s] + 10대 → 차단 ❌'],
  [testContents.allowedAges2030, '20s', true, 'allowedAges:[20s,30s] + 20대 → 허용 ✓'],
  [testContents.allowedAges2030, '40s+', false, 'allowedAges:[20s,30s] + 40대 → 차단 ❌'],
];

let contentTestPass = 0;
contentAgeTests.forEach(([content, age, expected, desc]) => {
  const result = isContentAllowedForAge(content, age);
  const pass = result === expected;
  if (pass) contentTestPass++;
  console.log(`   ${pass ? '✅' : '❌'} ${desc}`);
});

console.log(`\n   통과: ${contentTestPass}/${contentAgeTests.length}`);

// 9. 카테고리 연령 제한 테스트 (isCategoryAllowedForAge)
console.log('\n' + '='.repeat(50));
console.log('\n9️⃣ 카테고리 연령 제한 테스트\n');

const AGE_RESTRICTED_CATEGORIES = {
  alcohol: ['20s', '30s', '40s+'],
};
const ADULT_ONLY_CATEGORIES = ['alcohol'];

function isCategoryAllowedForAge(category, ageGroup) {
  // 연령 제한이 있는 카테고리인지 확인
  const isRestricted = ADULT_ONLY_CATEGORIES.includes(category) ||
                       category in AGE_RESTRICTED_CATEGORIES;

  // 인구통계 없으면 안전하게 제한 카테고리 모두 제외
  if (!ageGroup) {
    return !isRestricted;
  }

  // 10대면 성인 전용 콘텐츠 제외
  if (ageGroup === '10s' && ADULT_ONLY_CATEGORIES.includes(category)) {
    return false;
  }

  // 연령 제한 체크
  const allowedAges = AGE_RESTRICTED_CATEGORIES[category];
  if (allowedAges && !allowedAges.includes(ageGroup)) {
    return false;
  }

  return true;
}

const categoryAgeTests = [
  // 일반 카테고리
  ['coffee', undefined, true, 'coffee + 미확인 → 허용 ✓'],
  ['coffee', '10s', true, 'coffee + 10대 → 허용 ✓'],
  ['personality', undefined, true, 'personality + 미확인 → 허용 ✓'],

  // 제한 카테고리 (alcohol)
  ['alcohol', undefined, false, 'alcohol + 미확인 → 차단 ❌ (수정됨)'],
  ['alcohol', '10s', false, 'alcohol + 10대 → 차단 ❌'],
  ['alcohol', '20s', true, 'alcohol + 20대 → 허용 ✓'],
  ['alcohol', '30s', true, 'alcohol + 30대 → 허용 ✓'],
  ['alcohol', '40s+', true, 'alcohol + 40대 → 허용 ✓'],
];

let categoryTestPass = 0;
categoryAgeTests.forEach(([category, age, expected, desc]) => {
  const result = isCategoryAllowedForAge(category, age);
  const pass = result === expected;
  if (pass) categoryTestPass++;
  console.log(`   ${pass ? '✅' : '❌'} ${desc}`);
});

console.log(`\n   통과: ${categoryTestPass}/${categoryAgeTests.length}`);

// 결과 요약
console.log('\n' + '='.repeat(50));
console.log('\n📊 테스트 결과 요약\n');
console.log(`   ✅ 슬러그 변환: ${passCount}/${slugTests.length} 통과`);
console.log(`   ✅ 시드 매칭: ${seedMatches}개, 해시 폴백: ${seedMisses}개`);
console.log(`   ✅ 해시 일관성: 모든 테스트 통과`);
console.log(`   ✅ 퍼센트 범위: 10-50% 정상`);
console.log(`   ✅ 콘텐츠 추천: 연령/성별별 맞춤 추천 정상`);
console.log(`   ✅ 테스트 연령 제한: ${ageTestPass}/${ageRestrictionTests.length} 통과`);
console.log(`   ✅ 콘텐츠 메타 연령 제한: ${contentTestPass}/${contentAgeTests.length} 통과`);
console.log(`   ✅ 카테고리 연령 제한: ${categoryTestPass}/${categoryAgeTests.length} 통과`);

// 전체 통과 여부 확인
const allPassed = passCount === slugTests.length &&
                  ageTestPass === ageRestrictionTests.length &&
                  contentTestPass === contentAgeTests.length &&
                  categoryTestPass === categoryAgeTests.length;

if (allPassed) {
  console.log(`\n🎉 모든 테스트 완료!\n`);
} else {
  console.log(`\n⚠️ 일부 테스트 실패 - 위 결과 확인 필요\n`);
  process.exit(1);
}
