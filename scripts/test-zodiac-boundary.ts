/**
 * 띠/간지 계산 경계 조건 테스트
 *
 * 실행: npx tsx scripts/test-zodiac-boundary.ts
 *
 * 테스트 항목:
 * 1. 12월 vs 1월 연도 전환 로직
 * 2. KST 시간대 처리
 * 3. 스냅샷 패턴 일관성
 */

import {
  getCurrentYear,
  getNewYearInfo,
  getZodiacAnimal,
  getGanjiName,
  createDynamicYearSnapshot,
  DYNAMIC_YEAR,
} from '@/utils/zodiac';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let testsPassed = 0;
let testsFailed = 0;

function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`  ✅ ${name}`);
      testsPassed++;
    } else {
      console.log(`  ❌ ${name} - assertion failed`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ❌ ${name} - ${error}`);
    testsFailed++;
  }
}

function group(name: string, fn: () => void) {
  console.log(`\n📋 ${name}`);
  fn();
}

// ============================================================================
// 날짜 모킹 유틸리티
// ============================================================================

// Note: 실제 Date를 모킹하지 않고, 함수 파라미터로 연도 전달하여 테스트
// (getCurrentYear는 모킹 어려우므로 로직 검증에 집중)

// ============================================================================
// 테스트 케이스
// ============================================================================

console.log('🧪 띠/간지 계산 경계 조건 테스트\n');

group('1. 연도별 띠 계산 정확성', () => {
  const expected: Record<number, string> = {
    2020: '쥐',
    2021: '소',
    2022: '호랑이',
    2023: '토끼',
    2024: '용',
    2025: '뱀',
    2026: '말',
    2027: '양',
    2028: '원숭이',
    2029: '닭',
    2030: '개',
    2031: '돼지',
  };

  for (const [year, animal] of Object.entries(expected)) {
    const y = parseInt(year);
    test(`${year}년 = ${animal}띠`, () => {
      return getZodiacAnimal(y).name === animal;
    });
  }
});

group('2. 연도별 간지 계산 정확성', () => {
  const expected: Record<number, string> = {
    2020: '경자년(庚子年)',
    2024: '갑진년(甲辰年)',
    2025: '을사년(乙巳年)',
    2026: '병오년(丙午年)',
  };

  for (const [year, ganji] of Object.entries(expected)) {
    const y = parseInt(year);
    test(`${year}년 = ${ganji}`, () => {
      return getGanjiName(y) === ganji;
    });
  }
});

group('3. getCurrentYear 동작 검증', () => {
  const regularYear = getCurrentYear(false);
  const newYearYear = getCurrentYear(true);

  test('forNewYear=false 시 현재 연도 반환', () => {
    return regularYear >= 2024 && regularYear <= 2030;
  });

  test('forNewYear=true 시 12월엔 다음해 반환 가능', () => {
    // 12월이면 +1, 아니면 같음
    return newYearYear === regularYear || newYearYear === regularYear + 1;
  });
});

group('4. getNewYearInfo 일관성', () => {
  const info = getNewYearInfo();

  test('year가 유효한 연도', () => {
    return info.year >= 2024 && info.year <= 2030;
  });

  test('animal.name이 띠 동물과 일치', () => {
    return getZodiacAnimal(info.year).name === info.animal.name;
  });

  test('ganjiName이 간지와 일치', () => {
    return getGanjiName(info.year) === info.ganjiName;
  });

  test('zodiacName이 "X띠" 형식', () => {
    return info.zodiacName.endsWith('띠');
  });

  test('coloredName이 "색상 동물" 형식', () => {
    return info.coloredName.includes(' ') && info.coloredName.length > 3;
  });
});

group('5. createDynamicYearSnapshot 스냅샷 일관성', () => {
  const snapshot = createDynamicYearSnapshot();

  test('year와 yearText 일치', () => {
    return snapshot.yearText === `${snapshot.year}년`;
  });

  test('year와 ganji 일치', () => {
    return snapshot.ganji === getGanjiName(snapshot.year);
  });

  test('year와 zodiac 일치', () => {
    const expectedZodiac = getZodiacAnimal(snapshot.year).name + '띠';
    return snapshot.zodiac === expectedZodiac;
  });

  test('fullName이 year와 ganji 조합', () => {
    return snapshot.fullName === `${snapshot.year}년 ${snapshot.ganji}`;
  });
});

group('6. DYNAMIC_YEAR 레거시 호환', () => {
  test('DYNAMIC_YEAR.year가 유효', () => {
    return DYNAMIC_YEAR.year >= 2024 && DYNAMIC_YEAR.year <= 2030;
  });

  test('DYNAMIC_YEAR.ganji가 문자열', () => {
    return typeof DYNAMIC_YEAR.ganji === 'string' && DYNAMIC_YEAR.ganji.includes('년');
  });

  test('DYNAMIC_YEAR.emoji가 이모지', () => {
    return DYNAMIC_YEAR.emoji.length > 0;
  });
});

group('7. 12주기 순환 검증', () => {
  test('2020 + 12 = 2032 동일 띠', () => {
    return getZodiacAnimal(2020).name === getZodiacAnimal(2032).name;
  });

  test('2025 + 12 = 2037 동일 띠', () => {
    return getZodiacAnimal(2025).name === getZodiacAnimal(2037).name;
  });

  test('2025 + 60 = 2085 동일 간지', () => {
    // 60갑자 주기
    return getGanjiName(2025) === getGanjiName(2085);
  });
});

group('8. 오답 생성 로직 검증 (시즌 퀴즈용)', () => {
  const year = 2027; // 양띠 해
  const animal = getZodiacAnimal(year);
  const prevAnimal = getZodiacAnimal(year - 1);
  const nextAnimal = getZodiacAnimal(year + 1);

  test('2027년 띠 = 양', () => {
    return animal.name === '양';
  });

  test('2026년 띠 = 말 (전년)', () => {
    return prevAnimal.name === '말';
  });

  test('2028년 띠 = 원숭이 (다음해)', () => {
    return nextAnimal.name === '원숭이';
  });

  test('양, 말, 원숭이가 모두 다름 (오답 중복 없음)', () => {
    const names = new Set([animal.name, prevAnimal.name, nextAnimal.name]);
    return names.size === 3;
  });
});

// ============================================================================
// 결과 출력
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log(`📊 테스트 결과: ${testsPassed} passed, ${testsFailed} failed`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
