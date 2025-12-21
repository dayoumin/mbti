/**
 * Ranking API 입력 검증 로직 단위 테스트
 * Node.js로 직접 실행
 */

const VALID_AGE_GROUPS = ['10s', '20s', '30s', '40s+'];
const VALID_GENDERS = ['male', 'female', 'other'];

// route.ts의 limit 파싱 로직 복사
function parseLimitParam(limitParam) {
  const parsedLimit = limitParam ? parseInt(limitParam) : 10;
  return Number.isNaN(parsedLimit) ? 10 : Math.min(Math.max(parsedLimit, 1), 50);
}

function isValidAgeGroup(ageGroup) {
  return ageGroup !== null && VALID_AGE_GROUPS.includes(ageGroup);
}

function isValidGender(gender) {
  return gender !== null && VALID_GENDERS.includes(gender);
}

// 테스트 헬퍼
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    }
  };
}

console.log('\n=== limit 파라미터 검증 로직 ===\n');

test('null → 기본값 10', () => {
  expect(parseLimitParam(null)).toBe(10);
});

test('빈 문자열 → 기본값 10 (NaN)', () => {
  expect(parseLimitParam('')).toBe(10);
});

test('"abc" (NaN) → 기본값 10', () => {
  expect(parseLimitParam('abc')).toBe(10);
});

test('"10" → 10', () => {
  expect(parseLimitParam('10')).toBe(10);
});

test('"5" → 5', () => {
  expect(parseLimitParam('5')).toBe(5);
});

test('"0" → 최소값 1', () => {
  expect(parseLimitParam('0')).toBe(1);
});

test('"-5" → 최소값 1', () => {
  expect(parseLimitParam('-5')).toBe(1);
});

test('"100" → 최대값 50', () => {
  expect(parseLimitParam('100')).toBe(50);
});

test('"50" → 50 (경계값)', () => {
  expect(parseLimitParam('50')).toBe(50);
});

test('"51" → 50 (최대값 초과)', () => {
  expect(parseLimitParam('51')).toBe(50);
});

test('"1" → 1 (경계값)', () => {
  expect(parseLimitParam('1')).toBe(1);
});

console.log('\n=== ageGroup 검증 로직 ===\n');

test('null → false', () => {
  expect(isValidAgeGroup(null)).toBe(false);
});

test('"10s" → true', () => {
  expect(isValidAgeGroup('10s')).toBe(true);
});

test('"20s" → true', () => {
  expect(isValidAgeGroup('20s')).toBe(true);
});

test('"30s" → true', () => {
  expect(isValidAgeGroup('30s')).toBe(true);
});

test('"40s+" → true', () => {
  expect(isValidAgeGroup('40s+')).toBe(true);
});

test('"invalid" → false', () => {
  expect(isValidAgeGroup('invalid')).toBe(false);
});

test('"50s" → false', () => {
  expect(isValidAgeGroup('50s')).toBe(false);
});

console.log('\n=== gender 검증 로직 ===\n');

test('null → false', () => {
  expect(isValidGender(null)).toBe(false);
});

test('"male" → true', () => {
  expect(isValidGender('male')).toBe(true);
});

test('"female" → true', () => {
  expect(isValidGender('female')).toBe(true);
});

test('"other" → true', () => {
  expect(isValidGender('other')).toBe(true);
});

test('"invalid" → false', () => {
  expect(isValidGender('invalid')).toBe(false);
});

console.log('\n=== 응답 필터 표시 로직 ===\n');

test('유효하지 않은 ageGroup은 all로 표시', () => {
  const ageGroup = 'invalid';
  const hasAgeFilter = isValidAgeGroup(ageGroup);
  const responseAgeGroup = hasAgeFilter ? ageGroup : 'all';
  expect(responseAgeGroup).toBe('all');
});

test('유효한 ageGroup은 해당 값으로 표시', () => {
  const ageGroup = '20s';
  const hasAgeFilter = isValidAgeGroup(ageGroup);
  const responseAgeGroup = hasAgeFilter ? ageGroup : 'all';
  expect(responseAgeGroup).toBe('20s');
});

test('유효하지 않은 gender는 all로 표시', () => {
  const gender = 'invalid';
  const hasGenderFilter = isValidGender(gender);
  const responseGender = hasGenderFilter ? gender : 'all';
  expect(responseGender).toBe('all');
});

test('유효한 gender는 해당 값으로 표시', () => {
  const gender = 'female';
  const hasGenderFilter = isValidGender(gender);
  const responseGender = hasGenderFilter ? gender : 'all';
  expect(responseGender).toBe('female');
});

console.log(`\n=============================`);
console.log(`결과: ${passed} passed, ${failed} failed`);
console.log(`=============================\n`);

process.exit(failed > 0 ? 1 : 0);
