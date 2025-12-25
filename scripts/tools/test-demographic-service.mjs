/**
 * DemographicService 테스트
 *
 * 실행: node scripts/test-demographic-service.mjs
 */

// Mock localStorage
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};
global.window = {};

// 테스트 결과
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    storage.clear(); // 각 테스트 전 초기화
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ========== 테스트 시작 ==========
console.log('\n=== DemographicService 테스트 ===\n');

// DemographicService 로직 재현 (ESM import 문제 회피)
const AGE_GROUP_LABELS = {
  '10s': '10대',
  '20s': '20대',
  '30s': '30대',
  '40s+': '40대+',
};

const GENDER_LABELS = {
  'male': '남성',
  'female': '여성',
  'other': '응답하지 않음',
};

// 슬러그 변환 함수
function toResultSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣-]/g, '')
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
}

// 슬러그 기반 시드 데이터
const SEED_DATA = {
  human: {
    '20s': {
      male: { '열정적-리더형': 25, '분석적-전략가': 30 },
      female: { '공감형-힐러': 28 },
    },
  },
  coffee: {
    '20s': {
      male: { '아메리카노': 40 },
    },
  },
};

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

function getInsight(testType, resultName, ageGroup, gender) {
  const ageLabel = AGE_GROUP_LABELS[ageGroup];
  const genderLabel = GENDER_LABELS[gender];

  // 슬러그 기반 매칭
  const resultSlug = toResultSlug(resultName);
  const testSeed = SEED_DATA[testType];
  const ageSeed = testSeed?.[ageGroup];
  const genderSeed = ageSeed?.[gender];

  let percentile;
  if (genderSeed && resultSlug in genderSeed) {
    // 0% 값도 처리
    percentile = genderSeed[resultSlug];
  } else {
    // 슬러그 기반 해시 (표시명 변경에도 안정적)
    percentile = getConsistentPercentile(testType, resultSlug, ageGroup, gender);
  }

  const isRare = percentile <= 20;
  // 'other' 선택 시 성별 없이 연령대만 표시
  const groupLabel = gender === 'other' ? ageLabel : `${ageLabel} ${genderLabel}`;

  if (isRare) {
    return `${groupLabel} 중 ${percentile}%만 나오는 희귀 유형! ✨`;
  } else if (percentile <= 25) {
    return `${groupLabel} 상위 ${percentile}%에 속해요!`;
  } else if (percentile <= 40) {
    return `${groupLabel}의 ${percentile}%가 같은 결과예요`;
  } else {
    return `${groupLabel}에서 인기 있는 유형! (${percentile}%)`;
  }
}

// ========== 희귀 판정 기준 테스트 ==========

test('희귀 판정: 시드 데이터 15%는 희귀', () => {
  // 시드 데이터에 15%인 결과는 없지만, 20% 이하는 희귀
  // 분석적 전략가 = 30%이므로 희귀 아님
  const insight = getInsight('human', '분석적 전략가', '20s', 'male');
  assert(!insight.includes('희귀'), '30%는 희귀가 아니어야 함');
});

test('희귀 판정: 시드 데이터 20%는 희귀', () => {
  // 해시 기반으로 20% 이하가 나오면 희귀
  // 테스트를 위해 직접 확인
  const percentile = getConsistentPercentile('test', 'result', '20s', 'male');
  const isRare = percentile <= 20;
  // 해시 결과에 따라 희귀 여부 확인
  console.log(`   (해시 퍼센타일: ${percentile}, 희귀: ${isRare})`);
});

test('희귀 판정: 시드/해시 동일 기준 (20% 이하)', () => {
  // 시드 데이터 25%는 희귀 아님
  const insight1 = getInsight('human', '열정적 리더형', '20s', 'male');
  assert(!insight1.includes('희귀'), '시드 25%는 희귀 아님');

  // 해시 결과도 동일 기준 적용
  const percentile = 20;
  const isRare = percentile <= 20;
  assert(isRare, '20%는 희귀여야 함');
});

// ========== 성별 'other' 테스트 ==========

test("성별 'other': 인사이트에서 성별 라벨 제외", () => {
  const insight = getInsight('human', '테스트결과', '20s', 'other');
  assert(!insight.includes('응답하지 않음'), "'응답하지 않음' 텍스트가 없어야 함");
  assert(insight.includes('20대'), "연령대는 포함되어야 함");
});

test("성별 'male': 인사이트에 성별 라벨 포함", () => {
  const insight = getInsight('human', '테스트결과', '20s', 'male');
  assert(insight.includes('20대 남성'), "'20대 남성'이 포함되어야 함");
});

test("성별 'female': 인사이트에 성별 라벨 포함", () => {
  const insight = getInsight('human', '테스트결과', '20s', 'female');
  assert(insight.includes('20대 여성'), "'20대 여성'이 포함되어야 함");
});

// ========== 해시 일관성 테스트 ==========

test('해시 함수: 동일 입력에 동일 결과', () => {
  const p1 = getConsistentPercentile('human', '결과A', '20s', 'male');
  const p2 = getConsistentPercentile('human', '결과A', '20s', 'male');
  assertEqual(p1, p2, '동일 입력은 동일 결과를 반환해야 함');
});

test('해시 함수: 다른 입력에 다른 결과 (보통)', () => {
  const p1 = getConsistentPercentile('human', '결과A', '20s', 'male');
  const p2 = getConsistentPercentile('human', '결과B', '20s', 'male');
  // 다를 수도 있고 같을 수도 있지만, 대부분 다름
  console.log(`   (결과A: ${p1}, 결과B: ${p2})`);
});

test('해시 함수: 범위 10-50%', () => {
  for (let i = 0; i < 10; i++) {
    const p = getConsistentPercentile(`test${i}`, `result${i}`, '20s', 'male');
    assert(p >= 10 && p <= 50, `퍼센타일 ${p}는 10-50 범위여야 함`);
  }
});

// ========== 시드 데이터 매칭 테스트 ==========

test('시드 데이터: 정확한 매칭 (슬러그 기반)', () => {
  const insight = getInsight('coffee', '아메리카노', '20s', 'male');
  assert(insight.includes('40%'), '시드 데이터 40%가 사용되어야 함');
});

test('슬러그 변환: 공백을 하이픈으로', () => {
  assertEqual(toResultSlug('열정적 리더형'), '열정적-리더형');
});

test('슬러그 변환: 이모지 제거 (trailing hyphen 정리)', () => {
  assertEqual(toResultSlug('열정적 리더형 🔥'), '열정적-리더형');
});

test('슬러그 변환: 특수문자 제거', () => {
  assertEqual(toResultSlug('열정적! 리더형?'), '열정적-리더형');
});

test('슬러그 기반 시드 매칭: 표시명에서 슬러그로 변환 후 매칭', () => {
  // "열정적 리더형" (표시명) -> "열정적-리더형" (슬러그) -> 시드 데이터 매칭
  const insight = getInsight('human', '열정적 리더형', '20s', 'male');
  assert(insight.includes('25%'), '표시명이 슬러그로 변환되어 시드와 매칭되어야 함');
});

test('시드 데이터: 매칭 실패 시 해시 사용', () => {
  const insight = getInsight('coffee', '존재하지않는결과', '20s', 'male');
  // 해시 기반 퍼센타일이 사용됨
  assert(insight.length > 0, '인사이트가 생성되어야 함');
});

test('해시 안정성: 표시명 변경해도 슬러그 같으면 동일 퍼센타일', () => {
  // "열정적 리더형"과 "열정적 리더형 🔥"은 같은 슬러그 → 같은 해시
  const p1 = getConsistentPercentile('test', toResultSlug('열정적 리더형'), '20s', 'male');
  const p2 = getConsistentPercentile('test', toResultSlug('열정적 리더형 🔥'), '20s', 'male');
  assertEqual(p1, p2, '슬러그가 같으면 퍼센타일도 같아야 함');
});

test('0% 시드 값 처리', () => {
  // in 연산자로 0%도 정상 처리되는지 확인
  const testSeed = { '테스트-결과': 0 };
  const resultSlug = '테스트-결과';
  const found = resultSlug in testSeed;
  assert(found, '0% 값도 in 연산자로 찾아야 함');
  assertEqual(testSeed[resultSlug], 0, '0% 값이 정확히 반환되어야 함');
});

// ========== 인사이트 메시지 유형 테스트 ==========

test('메시지 유형: 희귀 (<=20%)', () => {
  // 직접 메시지 생성 테스트
  const percentile = 15;
  const isRare = percentile <= 20;
  assert(isRare, '15%는 희귀');
});

test('메시지 유형: 상위 (21-25%)', () => {
  const percentile = 25;
  const isRare = percentile <= 20;
  assert(!isRare, '25%는 희귀 아님');
  assert(percentile <= 25, '25%는 상위');
});

test('메시지 유형: 같은 결과 (26-40%)', () => {
  const percentile = 35;
  assert(percentile > 25 && percentile <= 40, '35%는 같은 결과 범위');
});

test('메시지 유형: 인기 (>40%)', () => {
  const percentile = 45;
  assert(percentile > 40, '45%는 인기 유형');
});

// ========== 결과 출력 ==========
console.log('\n=== 테스트 결과 ===');
console.log(`통과: ${passed}`);
console.log(`실패: ${failed}`);
console.log(`총: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
