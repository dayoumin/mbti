#!/usr/bin/env node
/**
 * 띠 운세 로직 테스트 (순수 JS)
 */

console.log('🐉 띠 운세 로직 테스트\n');

// 12지신 순서
const ZODIAC_ORDER = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

const ZODIAC_NAMES = {
  rat: '쥐', ox: '소', tiger: '호랑이', rabbit: '토끼',
  dragon: '용', snake: '뱀', horse: '말', goat: '양',
  monkey: '원숭이', rooster: '닭', dog: '개', pig: '돼지'
};

// 천간
const HEAVENLY_STEMS = [
  { name: '갑', element: 'wood' },
  { name: '을', element: 'wood' },
  { name: '병', element: 'fire' },
  { name: '정', element: 'fire' },
  { name: '무', element: 'earth' },
  { name: '기', element: 'earth' },
  { name: '경', element: 'metal' },
  { name: '신', element: 'metal' },
  { name: '임', element: 'water' },
  { name: '계', element: 'water' },
];

// 지지
const EARTHLY_BRANCHES = [
  { name: '자', animal: 'rat' },
  { name: '축', animal: 'ox' },
  { name: '인', animal: 'tiger' },
  { name: '묘', animal: 'rabbit' },
  { name: '진', animal: 'dragon' },
  { name: '사', animal: 'snake' },
  { name: '오', animal: 'horse' },
  { name: '미', animal: 'goat' },
  { name: '신', animal: 'monkey' },
  { name: '유', animal: 'rooster' },
  { name: '술', animal: 'dog' },
  { name: '해', animal: 'pig' },
];

function getYearInfo(year) {
  const baseYear = 1984; // 갑자년
  const diff = year - baseYear;
  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    year,
    name: `${stem.name}${branch.name}년`,
    animal: branch.animal,
    animalKo: ZODIAC_NAMES[branch.animal],
    element: stem.element,
  };
}

function getZodiacSign(birthYear) {
  const baseYear = 1984;
  const diff = birthYear - baseYear;
  const index = ((diff % 12) + 12) % 12;
  return ZODIAC_ORDER[index];
}

let errors = 0;

// === 테스트 1: 연도별 천간지지 ===
console.log('=== 1. 연도별 천간지지 계산 ===');
const yearTests = [
  { year: 2024, expected: { name: '갑진년', animal: 'dragon' } },
  { year: 2025, expected: { name: '을사년', animal: 'snake' } },
  { year: 2026, expected: { name: '병오년', animal: 'horse' } },
  { year: 2027, expected: { name: '정미년', animal: 'goat' } },
  { year: 2028, expected: { name: '무신년', animal: 'monkey' } },
];

for (const test of yearTests) {
  const result = getYearInfo(test.year);
  const pass = result.name === test.expected.name && result.animal === test.expected.animal;
  if (pass) {
    console.log(`   ✓ ${test.year}년: ${result.name} (${result.animalKo}띠)`);
  } else {
    console.log(`   ✗ ${test.year}년: 예상 ${test.expected.name}, 실제 ${result.name}`);
    errors++;
  }
}

// === 테스트 2: 출생연도 → 띠 ===
console.log('\n=== 2. 출생연도 → 띠 계산 ===');
const signTests = [
  { year: 1996, expected: 'rat' },
  { year: 1997, expected: 'ox' },
  { year: 2000, expected: 'dragon' },
  { year: 2001, expected: 'snake' },
  { year: 2025, expected: 'snake' },
  { year: 2032, expected: 'rat' },
  { year: 1955, expected: 'goat' },
  { year: 1984, expected: 'rat' },  // 기준년
];

for (const test of signTests) {
  const result = getZodiacSign(test.year);
  const pass = result === test.expected;
  if (pass) {
    console.log(`   ✓ ${test.year}년생 → ${ZODIAC_NAMES[result]}띠 (${result})`);
  } else {
    console.log(`   ✗ ${test.year}년생: 예상 ${test.expected}, 실제 ${result}`);
    errors++;
  }
}

// === 테스트 3: 60갑자 순환 확인 ===
console.log('\n=== 3. 60갑자 순환 확인 ===');
const year1984 = getYearInfo(1984);
const year2044 = getYearInfo(2044);
if (year1984.name === year2044.name) {
  console.log(`   ✓ 1984년과 2044년 모두 ${year1984.name} (60년 주기)`);
} else {
  console.log(`   ✗ 60갑자 순환 오류: 1984=${year1984.name}, 2044=${year2044.name}`);
  errors++;
}

// === 테스트 4: 연속 연도 확인 ===
console.log('\n=== 4. 2025~2036 연속 확인 (12지신 한 바퀴) ===');
const animals2025to2036 = [];
for (let y = 2025; y <= 2036; y++) {
  const info = getYearInfo(y);
  animals2025to2036.push(info.animal);
}
const expectedOrder = ['snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon'];
const orderMatch = JSON.stringify(animals2025to2036) === JSON.stringify(expectedOrder);
if (orderMatch) {
  console.log('   ✓ 2025~2036년 12지신 순서 정확');
} else {
  console.log('   ✗ 순서 불일치');
  console.log('     예상:', expectedOrder.join(', '));
  console.log('     실제:', animals2025to2036.join(', '));
  errors++;
}

// === 결과 ===
console.log('\n' + '='.repeat(50));
console.log('📊 테스트 결과');
console.log('='.repeat(50));
console.log(`\n   에러: ${errors}개`);

if (errors === 0) {
  console.log('\n✅ 모든 테스트 통과!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors}개 테스트 실패\n`);
  process.exit(1);
}
