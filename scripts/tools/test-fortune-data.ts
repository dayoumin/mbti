#!/usr/bin/env npx tsx
/**
 * 운세 콘텐츠 데이터 검증 스크립트 (의미론적 검증)
 *
 * TypeScript 모듈을 직접 import하여 실제 동작을 검증합니다.
 * 실행: npx tsx scripts/test-fortune-data.ts
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 모듈 import
import { getZodiacSign, getZodiacFortune, getAllZodiacFortunes, getCurrentYearTheme } from '../src/data/content/fortune/zodiac';
import { ZODIAC_POLLS } from '../src/data/content/fortune/zodiac-polls';
import { CONSTELLATIONS } from '../src/data/content/fortune/constellations';
import { ALL_DAILY_MESSAGES } from '../src/data/content/fortune/daily-messages';

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
  'src/data/content/fortune/zodiac.ts',
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
// 2. 12지신 데이터 검증 (실제 함수 호출)
// ============================================================================
console.log('\n🐲 2. 12지신 데이터 검증');

const expectedSigns = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
                       'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;

const signEmojis: Record<string, string> = {
  rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐉', snake: '🐍',
  horse: '🐎', goat: '🐑', monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐷'
};

const signNames: Record<string, string> = {
  rat: '쥐', ox: '소', tiger: '호랑이', rabbit: '토끼', dragon: '용', snake: '뱀',
  horse: '말', goat: '양', monkey: '원숭이', rooster: '닭', dog: '개', pig: '돼지'
};

// 모든 띠 운세 데이터 확인
const allFortunes = getAllZodiacFortunes();
for (const sign of expectedSigns) {
  const fortune = allFortunes.find(f => f.sign === sign);
  if (fortune) {
    console.log(`   ✓ ${signEmojis[sign]} ${signNames[sign]}띠 (${sign}): 운세 데이터 있음`);
  } else {
    console.log(`   ✗ ${sign}: 운세 데이터 없음`);
    errors++;
  }
}

// 테마 확인
const theme = getCurrentYearTheme();
if (theme && theme.name) {
  console.log(`\n   📅 올해 테마: ${theme.name} (${theme.animalKo}의 해)`);
} else {
  console.log(`\n   ⚠ 연도 테마 없음`);
  warnings++;
}

// ============================================================================
// 3. 띠 계산 로직 검증 (실제 함수 호출)
// ============================================================================
console.log('\n🧪 3. 띠 계산 로직 검증');

const testCases = [
  { year: 1996, expected: 'rat' },
  { year: 1997, expected: 'ox' },
  { year: 2000, expected: 'dragon' },
  { year: 2001, expected: 'snake' },
  { year: 2024, expected: 'dragon' },
  { year: 2025, expected: 'snake' },
  { year: 2032, expected: 'rat' },
  { year: 2033, expected: 'ox' },
  { year: 1955, expected: 'goat' },
];

for (const tc of testCases) {
  const calculated = getZodiacSign(tc.year);
  if (calculated === tc.expected) {
    console.log(`   ✓ ${tc.year}년 → ${signEmojis[tc.expected]} ${signNames[tc.expected]}띠`);
  } else {
    console.log(`   ✗ ${tc.year}년: ${tc.expected} 예상, ${calculated} 계산됨`);
    errors++;
  }
}

// 운세 조회도 확인
console.log('\n   운세 조회 테스트:');
const fortune2025 = getZodiacFortune('snake');
if (fortune2025 && fortune2025.name) {
  console.log(`   ✓ 뱀띠 운세 조회 성공: ${fortune2025.name}`);
} else {
  console.log(`   ✗ 뱀띠 운세 조회 실패`);
  errors++;
}

// ============================================================================
// 4. 투표 게임 데이터 검증
// ============================================================================
console.log('\n🗳️ 4. 별자리/띠 투표 게임 검증');

if (ZODIAC_POLLS && ZODIAC_POLLS.length > 0) {
  console.log(`   ✓ ZODIAC_POLLS: ${ZODIAC_POLLS.length}개 투표`);

  // 각 투표의 필수 필드 확인
  let validPolls = 0;
  for (const poll of ZODIAC_POLLS) {
    if (poll.id && poll.question && poll.options && poll.options.length >= 2) {
      validPolls++;
    }
  }

  if (validPolls === ZODIAC_POLLS.length) {
    console.log(`   ✓ 모든 투표 데이터 구조 정상`);
  } else {
    console.log(`   ⚠ 불완전한 투표: ${ZODIAC_POLLS.length - validPolls}개`);
    warnings++;
  }
} else {
  console.log(`   ✗ ZODIAC_POLLS 배열 없음 또는 비어있음`);
  errors++;
}

// ============================================================================
// 5. 별자리 데이터 검증
// ============================================================================
console.log('\n⭐ 5. 황도 12궁 데이터 검증');

const expectedConstellations = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

if (CONSTELLATIONS && CONSTELLATIONS.length === 12) {
  console.log(`   ✓ CONSTELLATIONS: ${CONSTELLATIONS.length}개 별자리`);

  for (const expected of expectedConstellations) {
    const found = CONSTELLATIONS.find(c => c.id === expected);
    if (found) {
      console.log(`   ✓ ${found.emoji} ${found.nameKo} (${expected})`);
    } else {
      console.log(`   ✗ ${expected}: 데이터 없음`);
      errors++;
    }
  }
} else {
  console.log(`   ✗ CONSTELLATIONS 개수 불일치: ${CONSTELLATIONS?.length || 0}개 (12개 필요)`);
  errors++;
}

// ============================================================================
// 6. 일일 메시지 검증
// ============================================================================
console.log('\n💬 6. 일일 메시지 검증');

if (ALL_DAILY_MESSAGES && ALL_DAILY_MESSAGES.length > 0) {
  console.log(`   ✓ ALL_DAILY_MESSAGES: ${ALL_DAILY_MESSAGES.length}개 메시지`);

  // 카테고리별 분류
  const categories: Record<string, number> = {};
  for (const msg of ALL_DAILY_MESSAGES) {
    categories[msg.category] = (categories[msg.category] || 0) + 1;
  }

  for (const [cat, count] of Object.entries(categories)) {
    console.log(`      - ${cat}: ${count}개`);
  }
} else {
  console.log(`   ✗ ALL_DAILY_MESSAGES 없음`);
  errors++;
}

// ============================================================================
// 7. 콘텐츠 가이드라인 준수 확인
// ============================================================================
console.log('\n📋 7. 콘텐츠 가이드라인 준수 확인');

// 실제 콘텐츠 문자열 추출
const allContent: string[] = [];

// 별자리 콘텐츠
for (const c of CONSTELLATIONS) {
  allContent.push(c.personality.summary);
  allContent.push(c.personality.growthPoint);
  allContent.push(...c.memes.traits);
  allContent.push(...c.memes.situations);
}

// 일일 메시지
for (const m of ALL_DAILY_MESSAGES) {
  allContent.push(m.message);
}

// 운세 데이터
for (const f of allFortunes) {
  if (f.yearly?.message) allContent.push(f.yearly.message);
  // personality 관련 문자열도 추가
  if (f.personality?.strengths) allContent.push(...f.personality.strengths);
  if (f.personality?.growth) allContent.push(...f.personality.growth);
}

const contentText = allContent.join('\n');

const forbiddenPatterns = [
  { pattern: /죽음|죽을|죽는|사망|단명|희생/, name: '죽음 관련', examples: [] as string[] },
  { pattern: /(?<![함변])수명/, name: '수명 관련', examples: [] as string[] },
  { pattern: /암|당뇨|우울증|공황/, name: '질병 관련', examples: [] as string[] },
  { pattern: /주식|코인|로또|투자/, name: '금융 투자 관련', examples: [] as string[] },
  { pattern: /소송|감옥|구속/, name: '법률 관련', examples: [] as string[] },
  { pattern: /100%|확실히|반드시|틀림없이/, name: '단정적 표현', examples: [] as string[] },
];

let guidelineViolations = 0;
for (const fp of forbiddenPatterns) {
  const matches = contentText.match(new RegExp(`[^\\n]*${fp.pattern.source}[^\\n]*`, 'g'));
  if (matches && matches.length > 0) {
    console.log(`   ⚠ ${fp.name} 표현 발견 (${matches.length}건)`);
    // 예시 1개만 출력
    console.log(`      예: "${matches[0].trim().substring(0, 50)}..."`);
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

console.log(`\n   12지신 운세: ${allFortunes.length}개`);
console.log(`   별자리 투표: ${ZODIAC_POLLS.length}개`);
console.log(`   황도 12궁: ${CONSTELLATIONS.length}개`);
console.log(`   일일 메시지: ${ALL_DAILY_MESSAGES.length}개`);
console.log(`\n   에러: ${errors}개`);
console.log(`   경고: ${warnings}개`);

if (errors === 0) {
  console.log('\n✅ 운세 콘텐츠 검증 완료 - 문제 없음!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors}개 에러 발견 - 수정 필요\n`);
  process.exit(1);
}
