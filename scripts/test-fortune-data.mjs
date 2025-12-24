#!/usr/bin/env node
/**
 * 운세 콘텐츠 데이터 검증 스크립트
 *
 * TypeScript 파일을 직접 import하지 않고 정적 분석으로 검증
 * (ts-node/tsx 의존성 없이 실행 가능)
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔮 운세 콘텐츠 데이터 검증 시작...\n');

let errors = 0;
let warnings = 0;

// ============================================================================
// 1. 파일 존재 확인
// ============================================================================
console.log('📁 1. 파일 존재 확인');

const requiredFiles = [
  'src/data/content/fortune/index.ts',
  'src/data/content/fortune/zodiac-2025.ts',
  'src/data/content/fortune/zodiac-polls.ts',
  'src/data/content/fortune/constellations.ts',
  'src/data/content/fortune/daily-messages.ts',
];

for (const file of requiredFiles) {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - 파일 없음`);
    errors++;
  }
}

// ============================================================================
// 2. 파일 내용 읽기 및 정적 분석
// ============================================================================
console.log('\n📦 2. 파일 내용 분석');

let zodiacContent = '';
let pollsContent = '';
let constellationsContent = '';
let dailyMessagesContent = '';

try {
  zodiacContent = readFileSync(join(projectRoot, 'src/data/content/fortune/zodiac-2025.ts'), 'utf-8');
  console.log(`   ✓ zodiac-2025.ts 읽기 성공`);
} catch (e) {
  console.log(`   ✗ zodiac-2025.ts 읽기 실패: ${e.message}`);
  errors++;
}

try {
  pollsContent = readFileSync(join(projectRoot, 'src/data/content/fortune/zodiac-polls.ts'), 'utf-8');
  console.log(`   ✓ zodiac-polls.ts 읽기 성공`);
} catch (e) {
  console.log(`   ✗ zodiac-polls.ts 읽기 실패: ${e.message}`);
  errors++;
}

try {
  constellationsContent = readFileSync(join(projectRoot, 'src/data/content/fortune/constellations.ts'), 'utf-8');
  console.log(`   ✓ constellations.ts 읽기 성공`);
} catch (e) {
  console.log(`   ✗ constellations.ts 읽기 실패: ${e.message}`);
  errors++;
}

try {
  dailyMessagesContent = readFileSync(join(projectRoot, 'src/data/content/fortune/daily-messages.ts'), 'utf-8');
  console.log(`   ✓ daily-messages.ts 읽기 성공`);
} catch (e) {
  console.log(`   ✗ daily-messages.ts 읽기 실패: ${e.message}`);
  errors++;
}

// ============================================================================
// 3. 12지신 데이터 검증 (정적 분석)
// ============================================================================
console.log('\n🐲 3. 12지신 데이터 검증');

const expectedSigns = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
                       'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

const signEmojis = {
  rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐉', snake: '🐍',
  horse: '🐎', goat: '🐑', monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐷'
};

const signNames = {
  rat: '쥐', ox: '소', tiger: '호랑이', rabbit: '토끼', dragon: '용', snake: '뱀',
  horse: '말', goat: '양', monkey: '원숭이', rooster: '닭', dog: '개', pig: '돼지'
};

for (const sign of expectedSigns) {
  // sign이 파일에 존재하는지 정규식으로 확인
  const signPattern = new RegExp(`sign:\\s*['"]${sign}['"]`);
  if (signPattern.test(zodiacContent)) {
    console.log(`   ✓ ${signEmojis[sign]} ${signNames[sign]}띠 (${sign}): 정상`);
  } else {
    console.log(`   ✗ ${sign}: 데이터 없음`);
    errors++;
  }
}

// ZODIAC_2025_THEME 존재 확인
if (/ZODIAC_2025_THEME/.test(zodiacContent)) {
  console.log(`\n   📅 2025 테마: 확인됨`);
} else {
  console.log(`\n   ⚠ 2025 테마 상수 없음`);
  warnings++;
}

// ============================================================================
// 4. 띠 계산 함수 존재 확인
// ============================================================================
console.log('\n🧮 4. 띠 계산 함수 확인');

const requiredFunctions = [
  { name: 'calculateZodiacSign', desc: '출생연도로 띠 계산' },
  { name: 'getZodiacByBirthYear', desc: '출생연도로 띠 찾기' },
  { name: 'getZodiacFortuneBySign', desc: '띠로 운세 찾기' },
];

for (const fn of requiredFunctions) {
  const fnPattern = new RegExp(`export\\s+function\\s+${fn.name}`);
  if (fnPattern.test(zodiacContent)) {
    console.log(`   ✓ ${fn.name}() - ${fn.desc}`);
  } else {
    console.log(`   ✗ ${fn.name}() 함수 없음`);
    errors++;
  }
}

// getZodiacByBirthYear에 fallback 로직이 있는지 확인
if (/calculateZodiacSign/.test(zodiacContent.match(/getZodiacByBirthYear[\s\S]*?(?=export|$)/)?.[0] || '')) {
  console.log(`   ✓ getZodiacByBirthYear에 fallback 로직 있음`);
} else {
  console.log(`   ⚠ getZodiacByBirthYear에 fallback 없음 - 범위 외 연도 미지원 가능`);
  warnings++;
}

// ============================================================================
// 5. 띠 계산 로직 검증 (테스트 케이스)
// ============================================================================
console.log('\n🧪 5. 띠 계산 로직 검증');

// signs 배열 순서 확인 (파일에서 추출)
const signsMatch = zodiacContent.match(/const signs.*?=\s*\[([\s\S]*?)\]/);
if (signsMatch) {
  const signsStr = signsMatch[1];
  const signs = signsStr.match(/'(\w+)'/g)?.map(s => s.replace(/'/g, '')) || [];

  // 테스트 케이스
  const testCases = [
    { year: 1996, expected: 'rat' },
    { year: 1997, expected: 'ox' },
    { year: 2000, expected: 'dragon' },
    { year: 2001, expected: 'snake' },
    { year: 2025, expected: 'snake' },
    { year: 2032, expected: 'rat' },      // years 배열에 없는 미래 연도
    { year: 2033, expected: 'ox' },       // years 배열에 없는 미래 연도
    { year: 1955, expected: 'goat' },     // years 배열에 없는 과거 연도
  ];

  for (const tc of testCases) {
    const index = tc.year % 12;
    const calculatedSign = signs[index];
    if (calculatedSign === tc.expected) {
      console.log(`   ✓ ${tc.year}년 → ${signEmojis[tc.expected]} ${signNames[tc.expected]}띠`);
    } else {
      console.log(`   ✗ ${tc.year}년: ${tc.expected} 예상, ${calculatedSign} 계산됨`);
      errors++;
    }
  }
} else {
  console.log(`   ⚠ signs 배열을 찾을 수 없음 - 로직 검증 스킵`);
  warnings++;
}

// ============================================================================
// 6. 투표 게임 데이터 검증
// ============================================================================
console.log('\n🗳️ 6. 별자리/띠 투표 게임 검증');

// ZODIAC_POLLS 배열 존재 확인
if (/export\s+(const|let)\s+ZODIAC_POLLS/.test(pollsContent)) {
  // 투표 개수 추정 (zodiac-poll-XXX 형식의 id만 카운트)
  const pollIds = pollsContent.match(/id:\s*['"]zodiac-poll-\d+['"]/g) || [];
  console.log(`   ✓ ZODIAC_POLLS: ${pollIds.length}개 투표 발견`);

  // type: 'zodiac-poll' 확인
  const typeMatches = pollsContent.match(/type:\s*['"]zodiac-poll['"]/g) || [];
  if (typeMatches.length === pollIds.length) {
    console.log(`   ✓ 모든 투표에 type: 'zodiac-poll' 설정됨`);
  } else {
    console.log(`   ⚠ type 불일치: ${typeMatches.length}/${pollIds.length}`);
    warnings++;
  }
} else {
  console.log(`   ✗ ZODIAC_POLLS 배열 없음`);
  errors++;
}

// ============================================================================
// 7. 콘텐츠 가이드라인 준수 확인
// ============================================================================
console.log('\n📋 7. 콘텐츠 가이드라인 준수 확인');

const forbiddenPatterns = [
  { pattern: /죽|사망|수명|단명/, name: '죽음/수명 관련' },
  { pattern: /암|당뇨|우울증|공황/, name: '질병 관련' },
  { pattern: /주식|코인|로또|투자/, name: '금융 투자 관련' },
  { pattern: /소송|감옥|구속/, name: '법률 관련' },
  { pattern: /100%|확실히|반드시|틀림없/, name: '단정적 표현' },
];

let guidelineViolations = 0;
const contentToCheck = zodiacContent + pollsContent + constellationsContent + dailyMessagesContent;

for (const fp of forbiddenPatterns) {
  if (fp.pattern.test(contentToCheck)) {
    console.log(`   ⚠ ${fp.name} 표현 발견`);
    guidelineViolations++;
    warnings++;
  }
}

if (guidelineViolations === 0) {
  console.log('   ✓ 금지 표현 없음 - 가이드라인 준수');
}

// ============================================================================
// 결과 요약
// ============================================================================
console.log('\n' + '='.repeat(50));
console.log('📊 검증 결과 요약');
console.log('='.repeat(50));

// 통계 추출 시도
const fortuneCount = (zodiacContent.match(/id:\s*['"]zodiac-[^'"]+['"]/g) || []).length;
const pollCount = (pollsContent.match(/id:\s*['"]zodiac-poll-\d+['"]/g) || []).length;
const constellationCount = (constellationsContent.match(/id:\s*['"]\w+['"]/g) || []).length;
const dailyMessageCount = (dailyMessagesContent.match(/id:\s*['"][^'"]+['"]/g) || []).length;

console.log(`\n   12지신 운세: ${fortuneCount}개`);
console.log(`   별자리 투표: ${pollCount}개`);
console.log(`   황도 12궁: ${constellationCount}개`);
console.log(`   일일 메시지: ${dailyMessageCount}개`);
console.log(`\n   에러: ${errors}개`);
console.log(`   경고: ${warnings}개`);

if (errors === 0) {
  console.log('\n✅ 운세 콘텐츠 검증 완료 - 문제 없음!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors}개 에러 발견 - 수정 필요\n`);
  process.exit(1);
}
