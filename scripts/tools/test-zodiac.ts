/**
 * Zodiac Utility Test Script
 *
 * 실행 방법:
 *   npx tsx scripts/test-zodiac.ts
 */
import {
  getNewYearInfo,
  getZodiacAnimal,
  getGanjiName,
  getZodiacName,
  getColoredZodiacName,
  getCurrentYear,
  ZODIAC_ANIMALS,
} from '@/utils/zodiac';

console.log('=== Zodiac Utility Test ===\n');

// Test 1: getCurrentYear
console.log('1. getCurrentYear()');
console.log('   Normal:', getCurrentYear(false));
console.log('   ForNewYear (12월이면 다음해):', getCurrentYear(true));

// Test 2: getNewYearInfo
console.log('\n2. getNewYearInfo()');
const info = getNewYearInfo();
console.log('   Year:', info.year);
console.log('   간지:', info.ganjiName);
console.log('   띠:', info.zodiacName);
console.log('   색상+띠:', info.coloredName);
console.log('   이모지:', info.emoji);
console.log('   동물:', info.animal.name);

// Test 3: 연도별 검증 (2024-2028)
console.log('\n3. 연도별 검증 (기준: 2020년=경자년 쥐띠)');
const expectedData = [
  { year: 2020, animal: '쥐', ganji: '경자년(庚子年)' },
  { year: 2021, animal: '소', ganji: '신축년(辛丑年)' },
  { year: 2022, animal: '호랑이', ganji: '임인년(壬寅年)' },
  { year: 2023, animal: '토끼', ganji: '계묘년(癸卯年)' },
  { year: 2024, animal: '용', ganji: '갑진년(甲辰年)' },
  { year: 2025, animal: '뱀', ganji: '을사년(乙巳年)' },
  { year: 2026, animal: '말', ganji: '병오년(丙午年)' },
  { year: 2027, animal: '양', ganji: '정미년(丁未年)' },
  { year: 2028, animal: '원숭이', ganji: '무신년(戊申年)' },
];

let allPassed = true;
expectedData.forEach(({ year, animal: expectedAnimal, ganji: expectedGanji }) => {
  const actualAnimal = getZodiacAnimal(year);
  const actualGanji = getGanjiName(year);
  const animalMatch = actualAnimal.name === expectedAnimal;
  const ganjiMatch = actualGanji === expectedGanji;

  if (animalMatch && ganjiMatch) {
    console.log(`   ✅ ${year}년: ${actualGanji} - ${actualAnimal.name}띠 ${actualAnimal.emoji}`);
  } else {
    console.log(`   ❌ ${year}년: 기대(${expectedGanji}, ${expectedAnimal}) vs 실제(${actualGanji}, ${actualAnimal.name})`);
    allPassed = false;
  }
});

// Test 4: 색상 테스트
console.log('\n4. 색상+띠 검증');
const colorTests = [
  { year: 2024, expected: '푸른 용' },  // 갑(목/청)
  { year: 2025, expected: '푸른 뱀' },  // 을(목/청)
  { year: 2026, expected: '붉은 말' },  // 병(화/적)
];

colorTests.forEach(({ year, expected }) => {
  const actual = getColoredZodiacName(year);
  if (actual === expected) {
    console.log(`   ✅ ${year}년: ${actual}`);
  } else {
    console.log(`   ❌ ${year}년: 기대(${expected}) vs 실제(${actual})`);
    allPassed = false;
  }
});

// Test 5: 상수 데이터 검증
console.log('\n5. 상수 데이터 검증');
console.log('   12지신:', ZODIAC_ANIMALS.length === 12 ? '✅ 12개' : '❌ ' + ZODIAC_ANIMALS.length + '개');

if (ZODIAC_ANIMALS.length !== 12) allPassed = false;

console.log('\n' + (allPassed ? '=== All Tests Passed ===' : '=== Some Tests Failed ==='));
process.exit(allPassed ? 0 : 1);
