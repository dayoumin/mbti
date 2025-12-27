/**
 * insight-tags.ts 구조 검증 테스트
 * - 주석 개수와 실제 배열 개수 일치 확인
 * - CATEGORY_TO_INTEREST 매핑 완전성 확인
 * - 중복 태그 검사
 *
 * 실행: npx tsx tests/insight-tags-structure.test.ts
 */

import {
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  INTEREST_TAGS,
  LIFESTYLE_TAGS,
  CATEGORY_TO_INTEREST,
  VALID_INSIGHT_TAGS,
} from '../src/data/insight/insight-tags';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passCount = 0;
let failCount = 0;
const errors: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passCount++;
    console.log(`  ✅ ${message}`);
  } else {
    failCount++;
    errors.push(message);
    console.log(`  ❌ ${message}`);
  }
}

function section(title: string): void {
  const separator = '='.repeat(70);
  console.log(`\n${separator}`);
  console.log(`  ${title}`);
  console.log(`${separator}\n`);
}

// ============================================================================
// 1. 주석 개수와 실제 배열 개수 일치
// ============================================================================

section('1. 주석 개수와 실제 배열 개수 일치 확인');

assert(PERSONALITY_TAGS.length === 32, `PERSONALITY_TAGS는 32개여야 함 (현재: ${PERSONALITY_TAGS.length}개)`);
assert(DECISION_TAGS.length === 21, `DECISION_TAGS는 21개여야 함 (현재: ${DECISION_TAGS.length}개)`);
assert(RELATIONSHIP_TAGS.length === 11, `RELATIONSHIP_TAGS는 11개여야 함 (현재: ${RELATIONSHIP_TAGS.length}개)`);
assert(INTEREST_TAGS.length === 20, `INTEREST_TAGS는 20개여야 함 (현재: ${INTEREST_TAGS.length}개)`);
assert(LIFESTYLE_TAGS.length === 19, `LIFESTYLE_TAGS는 19개여야 함 (현재: ${LIFESTYLE_TAGS.length}개)`);

const total = PERSONALITY_TAGS.length + DECISION_TAGS.length + RELATIONSHIP_TAGS.length + INTEREST_TAGS.length + LIFESTYLE_TAGS.length;
assert(total === 103, `전체 태그는 103개여야 함 (현재: ${total}개)`);

// ============================================================================
// 2. 중복 태그 검사
// ============================================================================

section('2. 중복 태그 검사');

const checkDuplicates = (tags: readonly string[], name: string) => {
  const uniqueTags = new Set(tags);
  assert(uniqueTags.size === tags.length, `${name}에 중복이 없어야 함 (유니크: ${uniqueTags.size}, 전체: ${tags.length})`);
};

checkDuplicates(PERSONALITY_TAGS, 'PERSONALITY_TAGS');
checkDuplicates(DECISION_TAGS, 'DECISION_TAGS');
checkDuplicates(RELATIONSHIP_TAGS, 'RELATIONSHIP_TAGS');
checkDuplicates(INTEREST_TAGS, 'INTEREST_TAGS');
checkDuplicates(LIFESTYLE_TAGS, 'LIFESTYLE_TAGS');

// 전체 태그 간 중복 검사
const allTags = [
  ...PERSONALITY_TAGS,
  ...DECISION_TAGS,
  ...RELATIONSHIP_TAGS,
  ...INTEREST_TAGS,
  ...LIFESTYLE_TAGS,
];
const uniqueAllTags = new Set(allTags);
assert(uniqueAllTags.size === allTags.length, `전체 태그 간 중복이 없어야 함 (유니크: ${uniqueAllTags.size}, 전체: ${allTags.length})`);

// ============================================================================
// 3. VALID_INSIGHT_TAGS Set 검증
// ============================================================================

section('3. VALID_INSIGHT_TAGS Set 검증');

assert(VALID_INSIGHT_TAGS.size === 103, `VALID_INSIGHT_TAGS는 103개 태그를 포함해야 함 (현재: ${VALID_INSIGHT_TAGS.size}개)`);

// 모든 태그가 VALID_INSIGHT_TAGS에 포함되어 있는지 확인
let allIncluded = true;
for (const tag of allTags) {
  if (!VALID_INSIGHT_TAGS.has(tag)) {
    allIncluded = false;
    console.log(`  ⚠️  태그 '${tag}'가 VALID_INSIGHT_TAGS에 없음`);
  }
}
assert(allIncluded, '모든 태그가 VALID_INSIGHT_TAGS에 포함되어야 함');

// ============================================================================
// 4. CATEGORY_TO_INTEREST 매핑 완전성
// ============================================================================

section('4. CATEGORY_TO_INTEREST 매핑 완전성');

const mappedTags = new Set(Object.values(CATEGORY_TO_INTEREST));
console.log(`  매핑된 태그 수: ${mappedTags.size} / ${INTEREST_TAGS.length}`);

// 각 INTEREST_TAG가 매핑되어 있는지 확인
let allMapped = true;
const unmappedTags: string[] = [];
for (const tag of INTEREST_TAGS) {
  if (!mappedTags.has(tag)) {
    allMapped = false;
    unmappedTags.push(tag);
  }
}

if (!allMapped) {
  console.log(`\n  ⚠️  매핑되지 않은 태그 (${unmappedTags.length}개):`);
  unmappedTags.forEach(tag => console.log(`    - ${tag}`));
}
assert(allMapped, `모든 INTEREST_TAGS가 CATEGORY_TO_INTEREST에 매핑되어야 함`);

// CATEGORY_TO_INTEREST의 모든 값이 유효한 INTEREST_TAGS인지 확인
let allValid = true;
for (const tag of Object.values(CATEGORY_TO_INTEREST)) {
  if (!INTEREST_TAGS.includes(tag)) {
    allValid = false;
    console.log(`  ⚠️  유효하지 않은 매핑: ${tag}`);
  }
}
assert(allValid, 'CATEGORY_TO_INTEREST의 모든 값이 유효한 INTEREST_TAGS여야 함');

// 필수 카테고리 매핑 확인
const requiredCategories = [
  'cat', 'dog', 'rabbit', 'hamster', 'bird', 'fish', 'reptile', 'pet',
  'plant', 'nature',
  'coffee', 'food', 'alcohol',
  'love', 'lifestyle', 'money', 'travel',
  'tarot', 'zodiac', 'psychology',
];

let allRequired = true;
const missingCategories: string[] = [];
for (const category of requiredCategories) {
  if (!CATEGORY_TO_INTEREST[category]) {
    allRequired = false;
    missingCategories.push(category);
  }
}

if (!allRequired) {
  console.log(`\n  ⚠️  누락된 필수 카테고리 (${missingCategories.length}개):`);
  missingCategories.forEach(cat => console.log(`    - ${cat}`));
}
assert(allRequired, `필수 카테고리 ${requiredCategories.length}개가 모두 매핑되어야 함`);

// 이전에 누락되었던 3개 태그 확인
assert(CATEGORY_TO_INTEREST.pet === 'interest-pet', "CATEGORY_TO_INTEREST.pet이 'interest-pet'이어야 함");
assert(CATEGORY_TO_INTEREST.nature === 'interest-nature', "CATEGORY_TO_INTEREST.nature가 'interest-nature'이어야 함");
assert(CATEGORY_TO_INTEREST.psychology === 'interest-psychology', "CATEGORY_TO_INTEREST.psychology가 'interest-psychology'이어야 함");

// ============================================================================
// 5. 태그 명명 규칙
// ============================================================================

section('5. 태그 명명 규칙');

// INTEREST_TAGS는 모두 "interest-" 접두사로 시작해야 함
let allInterestPrefixed = true;
for (const tag of INTEREST_TAGS) {
  if (!tag.startsWith('interest-')) {
    allInterestPrefixed = false;
    console.log(`  ⚠️  잘못된 interest 태그: ${tag}`);
  }
}
assert(allInterestPrefixed, "INTEREST_TAGS는 모두 'interest-' 접두사로 시작해야 함");

// 다른 카테고리는 "interest-" 접두사를 사용하지 않아야 함
const nonInterestTags = [
  ...PERSONALITY_TAGS,
  ...DECISION_TAGS,
  ...RELATIONSHIP_TAGS,
  ...LIFESTYLE_TAGS,
];
let noInterestPrefix = true;
for (const tag of nonInterestTags) {
  if (tag.startsWith('interest-')) {
    noInterestPrefix = false;
    console.log(`  ⚠️  interest- 접두사를 잘못 사용: ${tag}`);
  }
}
assert(noInterestPrefix, "다른 카테고리 태그는 'interest-' 접두사를 사용하지 않아야 함");

// 모든 태그는 kebab-case 형식이어야 함
const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/;
let allKebabCase = true;
for (const tag of allTags) {
  if (!kebabCaseRegex.test(tag)) {
    allKebabCase = false;
    console.log(`  ⚠️  kebab-case가 아님: ${tag}`);
  }
}
assert(allKebabCase, '모든 태그는 kebab-case 형식이어야 함');

// ============================================================================
// 6. 특정 태그 존재 확인
// ============================================================================

section('6. 특정 태그 존재 확인');

// Big Five 관련 주요 태그
const bigFiveTags = [
  'extroverted', 'introverted',  // 외향성
  'logical', 'intuitive',        // 개방성
  'planned', 'spontaneous',      // 성실성
  'collaborative', 'independent', // 친화성
  'resilient', 'sensitive',      // 신경성
];
let allBigFive = true;
for (const tag of bigFiveTags) {
  if (!PERSONALITY_TAGS.includes(tag)) {
    allBigFive = false;
    console.log(`  ⚠️  Big Five 태그 누락: ${tag}`);
  }
}
assert(allBigFive, 'Big Five 관련 주요 태그가 모두 존재해야 함');

// TKI 갈등 모델 5유형
const tkiTags = ['competing', 'avoiding', 'accommodating', 'collaborating', 'compromising'];
let allTKI = true;
for (const tag of tkiTags) {
  if (!RELATIONSHIP_TAGS.includes(tag)) {
    allTKI = false;
    console.log(`  ⚠️  TKI 태그 누락: ${tag}`);
  }
}
assert(allTKI, 'TKI 갈등 모델 5유형이 모두 존재해야 함');

// 주요 반려동물 태그
const petTags = ['interest-cat', 'interest-dog', 'interest-rabbit', 'interest-hamster'];
let allPets = true;
for (const tag of petTags) {
  if (!INTEREST_TAGS.includes(tag)) {
    allPets = false;
    console.log(`  ⚠️  반려동물 태그 누락: ${tag}`);
  }
}
assert(allPets, '주요 반려동물 관심사 태그가 모두 존재해야 함');

// ============================================================================
// 7. 서브그룹 개수 검증
// ============================================================================

section('7. 서브그룹 개수 검증');

// PERSONALITY_TAGS (32개)
const energyDirection = ['extroverted', 'introverted', 'ambiverted', 'socially-confident', 'socially-anxious'];
const infoProcessing = ['logical', 'emotional', 'intuitive', 'analytical', 'data-driven', 'systematic', 'holistic'];
const actionStyle = ['planned', 'spontaneous', 'flexible', 'structured', 'organized'];
const relationshipStyle = ['independent', 'collaborative', 'supportive', 'leading', 'empathetic', 'nurturing'];
const emotionalStability = ['resilient', 'sensitive', 'calm', 'excitable'];
const expressiveness = ['expressive', 'reserved', 'articulate', 'observant', 'romantic'];

const personalityTotal = energyDirection.length + infoProcessing.length + actionStyle.length +
                        relationshipStyle.length + emotionalStability.length + expressiveness.length;
assert(personalityTotal === 32, `PERSONALITY_TAGS 서브그룹 합계는 32개여야 함 (현재: ${personalityTotal}개)`);

// DECISION_TAGS (21개)
const criteria = ['practical', 'sentimental', 'idealistic', 'pragmatic'];
const riskTendency = ['adventurous', 'safe', 'cautious', 'risk-taking', 'conservative'];
const decisionSpeed = ['quick-decisive', 'deliberate', 'research-based', 'instinctive'];
const sociality = ['solo', 'together'];
const communication = ['direct', 'indirect', 'tactful'];
const timeOrientation = ['present-focused', 'future-focused', 'nostalgic'];

const decisionTotal = criteria.length + riskTendency.length + decisionSpeed.length +
                     sociality.length + communication.length + timeOrientation.length;
assert(decisionTotal === 21, `DECISION_TAGS 서브그룹 합계는 21개여야 함 (현재: ${decisionTotal}개)`);

// RELATIONSHIP_TAGS (11개)
const conflictHandling = ['competing', 'avoiding', 'accommodating', 'collaborating', 'compromising'];
const intimacyPreference = ['close-bonding', 'space-needing'];
const careDirection = ['self-first', 'other-first'];
const communicationStyle = ['assertive', 'diplomatic'];

const relationshipTotal = conflictHandling.length + intimacyPreference.length +
                         careDirection.length + communicationStyle.length;
assert(relationshipTotal === 11, `RELATIONSHIP_TAGS 서브그룹 합계는 11개여야 함 (현재: ${relationshipTotal}개)`);

// INTEREST_TAGS (20개)
const pets = ['interest-cat', 'interest-dog', 'interest-rabbit', 'interest-hamster',
             'interest-bird', 'interest-fish', 'interest-reptile', 'interest-pet'];
const plantNature = ['interest-plant', 'interest-nature'];
const foodDrink = ['interest-coffee', 'interest-food', 'interest-alcohol'];
const relationshipLifestyle = ['interest-love', 'interest-lifestyle', 'interest-money', 'interest-travel'];
const fortunePsychology = ['interest-tarot', 'interest-zodiac', 'interest-psychology'];

const interestTotal = pets.length + plantNature.length + foodDrink.length +
                     relationshipLifestyle.length + fortunePsychology.length;
assert(interestTotal === 20, `INTEREST_TAGS 서브그룹 합계는 20개여야 함 (현재: ${interestTotal}개)`);

// LIFESTYLE_TAGS (19개)
const activityLevel = ['active', 'homebody', 'energetic', 'relaxed'];
const spendingTendency = ['frugal', 'splurger', 'minimalist', 'collector'];
const timePreference = ['morning-person', 'night-owl', 'routine-oriented'];
const hobbyStyle = ['creative', 'consuming', 'artistic', 'innovative', 'traditional'];
const healthWellness = ['health-conscious', 'wellness-focused', 'balanced-lifestyle'];

const lifestyleTotal = activityLevel.length + spendingTendency.length + timePreference.length +
                      hobbyStyle.length + healthWellness.length;
assert(lifestyleTotal === 19, `LIFESTYLE_TAGS 서브그룹 합계는 19개여야 함 (현재: ${lifestyleTotal}개)`);

// ============================================================================
// 결과 요약
// ============================================================================

section('결과 요약');

console.log(`\n  ✅ 통과: ${passCount}`);
console.log(`  ❌ 실패: ${failCount}\n`);

if (errors.length > 0) {
  console.log('  실패한 검증:');
  errors.forEach(err => console.log(`    - ${err}`));
  console.log();
}

const separator = '='.repeat(70);
console.log(separator);
if (failCount === 0) {
  console.log('  ✅ 모든 insight-tags 구조 검증 통과!');
  console.log(separator + '\n');
  process.exit(0);
} else {
  console.log(`  ❌ ${failCount}개 검증 실패`);
  console.log(separator + '\n');
  process.exit(1);
}
