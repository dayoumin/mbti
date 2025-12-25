/**
 * 카테고리 관련 데이터 일관성 점검
 * 실행: npx tsx scripts/check-category-consistency.ts
 */

import { CATEGORIES, CATEGORY_KEYS, type ContentCategory } from '../src/data/content/categories';
import { TEST_TO_CATEGORY, TEST_META, CATEGORY_TO_TEST } from '../src/data/contentGraph';

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.log(`❌ ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.log(`⚠️  ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`✅ ${msg}`);
}

console.log('\n========================================');
console.log('카테고리 데이터 일관성 점검');
console.log('========================================\n');

// =============================================================================
// 1. CATEGORY_KEYS vs CATEGORIES 동기화
// =============================================================================
console.log('--- 1. CATEGORY_KEYS vs CATEGORIES 동기화 ---\n');

const categoriesKeys = Object.keys(CATEGORIES);
const missingInCategories = CATEGORY_KEYS.filter(k => !categoriesKeys.includes(k));
const extraInCategories = categoriesKeys.filter(k => !CATEGORY_KEYS.includes(k as ContentCategory));

if (missingInCategories.length) {
  error(`CATEGORIES에 누락: ${missingInCategories.join(', ')}`);
} else if (extraInCategories.length) {
  error(`CATEGORY_KEYS에 누락: ${extraInCategories.join(', ')}`);
} else {
  ok(`CATEGORY_KEYS(${CATEGORY_KEYS.length}개)와 CATEGORIES 동기화됨`);
}

// =============================================================================
// 2. TEST_TO_CATEGORY vs TEST_META.category 일치성
// =============================================================================
console.log('\n--- 2. TEST_TO_CATEGORY vs TEST_META.category ---\n');

const testToCategory = Object.entries(TEST_TO_CATEGORY);
const testMeta = Object.entries(TEST_META);

let mismatchCount = 0;
for (const [testKey, category] of testToCategory) {
  const meta = TEST_META[testKey];
  if (meta && meta.category !== category) {
    warn(`${testKey}: TEST_TO_CATEGORY="${category}" vs TEST_META.category="${meta.category}"`);
    mismatchCount++;
  }
}

if (mismatchCount === 0) {
  ok('TEST_TO_CATEGORY와 TEST_META.category 일치');
} else {
  console.log(`   → ${mismatchCount}개 불일치 (의도적일 수 있음)`);
}

// TEST_META에 있지만 TEST_TO_CATEGORY에 없는 테스트
const missingInTestToCategory = testMeta
  .map(([k]) => k)
  .filter(k => !TEST_TO_CATEGORY[k]);

if (missingInTestToCategory.length) {
  warn(`TEST_META에만 있고 TEST_TO_CATEGORY에 없음: ${missingInTestToCategory.join(', ')}`);
}

// =============================================================================
// 3. CATEGORY_TO_TEST 검증
// =============================================================================
console.log('\n--- 3. CATEGORY_TO_TEST 자동 생성 검증 ---\n');

// 모든 카테고리가 CATEGORY_TO_TEST에 있는지
const categoriesInCategoryToTest = Object.keys(CATEGORY_TO_TEST);
const missingCategories = CATEGORY_KEYS.filter(k => !categoriesInCategoryToTest.includes(k));

if (missingCategories.length) {
  warn(`CATEGORY_TO_TEST에 없는 카테고리: ${missingCategories.join(', ')}`);
} else {
  ok('모든 카테고리가 CATEGORY_TO_TEST에 존재');
}

// TEST_TO_CATEGORY의 모든 테스트가 해당 카테고리의 CATEGORY_TO_TEST에 있는지
let reverseMapOk = true;
for (const [testKey, category] of testToCategory) {
  const testsInCategory = CATEGORY_TO_TEST[category] || [];
  if (!testsInCategory.includes(testKey as any)) {
    error(`${testKey}가 CATEGORY_TO_TEST["${category}"]에 없음`);
    reverseMapOk = false;
  }
}

if (reverseMapOk) {
  ok('TEST_TO_CATEGORY → CATEGORY_TO_TEST 역매핑 정상');
}

// =============================================================================
// 4. CATEGORY_EXTRA_TESTS 중복 점검
// =============================================================================
console.log('\n--- 4. CATEGORY_EXTRA_TESTS 중복 점검 ---\n');

// pet 카테고리 그룹 확인
const petCategories = ['pet', 'cat', 'dog', 'rabbit', 'hamster', 'fish', 'bird', 'reptile', 'smallPet'];
const petCategoryTests: Record<string, string[]> = {};

for (const cat of petCategories) {
  const tests = CATEGORY_TO_TEST[cat] || [];
  petCategoryTests[cat] = tests as string[];
}

console.log('반려동물 카테고리별 테스트 목록:');
for (const [cat, tests] of Object.entries(petCategoryTests)) {
  const hasPetMatch = tests.includes('petMatch');
  console.log(`  ${cat}: ${tests.length}개 ${hasPetMatch ? '(petMatch ✓)' : '(petMatch ✗)'}`);
}

// =============================================================================
// 5. 유효하지 않은 카테고리 참조 점검
// =============================================================================
console.log('\n--- 5. 유효하지 않은 카테고리 참조 ---\n');

const validCategories = new Set(CATEGORY_KEYS);

// TEST_TO_CATEGORY에서 유효하지 않은 카테고리
for (const [testKey, category] of testToCategory) {
  if (!validCategories.has(category)) {
    error(`TEST_TO_CATEGORY["${testKey}"] = "${category}" (유효하지 않음)`);
  }
}

// TEST_META.category에서 유효하지 않은 카테고리
for (const [testKey, meta] of testMeta) {
  if (!validCategories.has(meta.category as ContentCategory)) {
    error(`TEST_META["${testKey}"].category = "${meta.category}" (유효하지 않음)`);
  }
}

ok('유효하지 않은 카테고리 참조 없음');

// =============================================================================
// 결과 요약
// =============================================================================
console.log('\n========================================');
console.log(`점검 결과: ${errors} 에러, ${warnings} 경고`);
console.log('========================================\n');

if (errors > 0) {
  process.exit(1);
}
