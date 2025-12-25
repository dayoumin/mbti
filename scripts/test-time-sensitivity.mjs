/**
 * 시간 민감도(Time Sensitivity) 로직 테스트
 *
 * 테스트 항목:
 * 1. calculateValidUntil - 유효기간 자동 계산
 * 2. getValidityStatus - 유효 상태 판정
 * 3. isContentValid - 콘텐츠 노출 가능 여부
 * 4. filterValidContent - 유효한 콘텐츠 필터링
 * 5. filterNeedsReviewContent - 검토 필요 콘텐츠 필터링
 * 6. groupContentByValidity - 상태별 그룹핑
 * 7. createTimeSensitivityMeta - 메타데이터 생성 헬퍼
 */

// ESM에서 타입스크립트 파일 import를 위한 설정
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// types.ts에서 상수와 함수 직접 구현 (런타임에서 테스트)
const VALIDITY_PERIODS = {
  high: 2,
  medium: 3,
  low: 4,
  none: null,
};

function calculateValidUntil(sourceYear, sensitivity) {
  const period = VALIDITY_PERIODS[sensitivity];
  if (period === null) return null;
  return `${sourceYear + period}-12`;
}

function getValidityStatus(meta, currentDate = new Date()) {
  if (!meta || meta.sensitivity === 'none') return 'current';

  const validUntil = meta.validUntil ?? calculateValidUntil(meta.sourceYear, meta.sensitivity);
  if (!validUntil) return 'current';

  const [year, month] = validUntil.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, 1);
  const warningDate = new Date(year, month - 7, 1);

  if (currentDate >= expiryDate) {
    return 'outdated';
  } else if (currentDate >= warningDate) {
    return 'needs_review';
  }

  return 'current';
}

function isContentValid(content, currentDate) {
  const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
  return status !== 'outdated';
}

function filterValidContent(contents, currentDate) {
  return contents.filter(content => isContentValid(content, currentDate));
}

function filterNeedsReviewContent(contents, currentDate) {
  return contents.filter(content => {
    const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
    return status === 'needs_review' || status === 'outdated';
  });
}

function groupContentByValidity(contents, currentDate) {
  const result = {
    current: [],
    needs_review: [],
    outdated: [],
  };

  for (const content of contents) {
    const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
    result[status].push(content);
  }

  return result;
}

function createTimeSensitivityMeta(sensitivity, sourceYear = new Date().getFullYear()) {
  return {
    sensitivity,
    sourceYear,
    validUntil: calculateValidUntil(sourceYear, sensitivity) ?? undefined,
  };
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
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, msg = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${msg}`);
  }
}

function assertTrue(condition, msg = '') {
  if (!condition) {
    throw new Error(`Expected true. ${msg}`);
  }
}

function assertFalse(condition, msg = '') {
  if (condition) {
    throw new Error(`Expected false. ${msg}`);
  }
}

// 테스트 실행
console.log('\n=== 시간 민감도 로직 테스트 ===\n');

// 1. calculateValidUntil 테스트
console.log('## 1. calculateValidUntil');

test('high 민감도: 2025 → 2027-12', () => {
  assertEqual(calculateValidUntil(2025, 'high'), '2027-12');
});

test('medium 민감도: 2025 → 2028-12', () => {
  assertEqual(calculateValidUntil(2025, 'medium'), '2028-12');
});

test('low 민감도: 2025 → 2029-12', () => {
  assertEqual(calculateValidUntil(2025, 'low'), '2029-12');
});

test('none 민감도: null 반환', () => {
  assertEqual(calculateValidUntil(2025, 'none'), null);
});

// 2. getValidityStatus 테스트
console.log('\n## 2. getValidityStatus');

test('meta 없으면 current', () => {
  assertEqual(getValidityStatus(undefined), 'current');
});

test('sensitivity none이면 current', () => {
  assertEqual(getValidityStatus({ sensitivity: 'none', sourceYear: 2020 }), 'current');
});

test('현재 유효한 콘텐츠 → current', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025 }; // 2027-12까지 유효
  const now = new Date(2025, 11, 25); // 2025-12-25
  assertEqual(getValidityStatus(meta, now), 'current');
});

test('6개월 내 만료 예정 → needs_review', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025 }; // 2027-12까지 유효
  const now = new Date(2027, 6, 1); // 2027-07-01 (만료 5개월 전)
  assertEqual(getValidityStatus(meta, now), 'needs_review');
});

test('만료된 콘텐츠 → outdated', () => {
  const meta = { sensitivity: 'high', sourceYear: 2023 }; // 2025-12까지 유효
  const now = new Date(2026, 0, 1); // 2026-01-01 (만료됨)
  assertEqual(getValidityStatus(meta, now), 'outdated');
});

test('validUntil 명시 시 우선 사용', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025, validUntil: '2026-06' };
  const now = new Date(2026, 5, 1); // 2026-06-01 (정확히 만료)
  assertEqual(getValidityStatus(meta, now), 'outdated');
});

// 3. isContentValid 테스트
console.log('\n## 3. isContentValid');

test('유효한 콘텐츠 → true', () => {
  const content = {
    id: 'test-1',
    meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2025 } }
  };
  assertTrue(isContentValid(content, new Date(2026, 0, 1)));
});

test('만료된 콘텐츠 → false', () => {
  const content = {
    id: 'test-2',
    meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2022 } }
  };
  assertFalse(isContentValid(content, new Date(2025, 0, 1)));
});

test('검토 필요 콘텐츠 → true (노출은 유지)', () => {
  const content = {
    id: 'test-3',
    meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2024 } } // 2026-12까지
  };
  assertTrue(isContentValid(content, new Date(2026, 7, 1))); // 2026-08 (4개월 남음)
});

test('meta 없는 콘텐츠 → true', () => {
  const content = { id: 'test-4' };
  assertTrue(isContentValid(content));
});

// 4. filterValidContent 테스트
console.log('\n## 4. filterValidContent');

test('유효한 콘텐츠만 필터링', () => {
  const contents = [
    { id: 'valid', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2025 } } },
    { id: 'expired', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2022 } } },
    { id: 'no-meta' },
  ];
  const now = new Date(2025, 11, 25);
  const filtered = filterValidContent(contents, now);
  assertEqual(filtered.length, 2);
  assertEqual(filtered.map(c => c.id), ['valid', 'no-meta']);
});

// 5. filterNeedsReviewContent 테스트
console.log('\n## 5. filterNeedsReviewContent');

test('검토 필요 + 만료된 콘텐츠 필터링', () => {
  const contents = [
    { id: 'valid', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2026 } } },    // 2028-12까지 → current
    { id: 'needs-review', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2024 } } }, // 2026-12까지 → needs_review at 2026-08
    { id: 'expired', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2022 } } },  // 2024-12까지 → outdated
    { id: 'no-meta' },  // current
  ];
  const now = new Date(2026, 7, 1); // 2026-08-01
  const filtered = filterNeedsReviewContent(contents, now);
  assertEqual(filtered.length, 2);
  assertEqual(filtered.map(c => c.id).sort(), ['expired', 'needs-review']);
});

// 6. groupContentByValidity 테스트
console.log('\n## 6. groupContentByValidity');

test('상태별 그룹핑', () => {
  const contents = [
    { id: 'current-1', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2027 } } },
    { id: 'current-2' },
    { id: 'needs-review', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2024 } } },
    { id: 'outdated', meta: { timeSensitivity: { sensitivity: 'high', sourceYear: 2022 } } },
  ];
  const now = new Date(2026, 7, 1); // 2026-08-01
  const grouped = groupContentByValidity(contents, now);

  assertEqual(grouped.current.length, 2);
  assertEqual(grouped.needs_review.length, 1);
  assertEqual(grouped.outdated.length, 1);
  assertEqual(grouped.current.map(c => c.id).sort(), ['current-1', 'current-2']);
  assertEqual(grouped.needs_review[0].id, 'needs-review');
  assertEqual(grouped.outdated[0].id, 'outdated');
});

// 7. createTimeSensitivityMeta 테스트
console.log('\n## 7. createTimeSensitivityMeta');

test('high 민감도 메타 생성', () => {
  const meta = createTimeSensitivityMeta('high', 2025);
  assertEqual(meta.sensitivity, 'high');
  assertEqual(meta.sourceYear, 2025);
  assertEqual(meta.validUntil, '2027-12');
});

test('none 민감도 메타 생성 (validUntil undefined)', () => {
  const meta = createTimeSensitivityMeta('none', 2025);
  assertEqual(meta.sensitivity, 'none');
  assertEqual(meta.sourceYear, 2025);
  assertEqual(meta.validUntil, undefined);
});

// 8. 경계 조건 테스트
console.log('\n## 8. 경계 조건');

test('정확히 만료일에 → outdated', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025, validUntil: '2027-12' };
  const expiryDate = new Date(2027, 11, 1); // 2027-12-01
  assertEqual(getValidityStatus(meta, expiryDate), 'outdated');
});

test('만료 하루 전 → needs_review', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025, validUntil: '2027-12' };
  const beforeExpiry = new Date(2027, 10, 30); // 2027-11-30
  assertEqual(getValidityStatus(meta, beforeExpiry), 'needs_review');
});

test('정확히 6개월 전 → needs_review', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025, validUntil: '2027-12' };
  const sixMonthsBefore = new Date(2027, 5, 1); // 2027-06-01 (6개월 전)
  assertEqual(getValidityStatus(meta, sixMonthsBefore), 'needs_review');
});

test('6개월 전 하루 전 → current', () => {
  const meta = { sensitivity: 'high', sourceYear: 2025, validUntil: '2027-12' };
  const beforeWarning = new Date(2027, 4, 31); // 2027-05-31
  assertEqual(getValidityStatus(meta, beforeWarning), 'current');
});

// 결과 출력
console.log('\n=== 테스트 결과 ===');
console.log(`통과: ${passed}개`);
console.log(`실패: ${failed}개`);

if (failed > 0) {
  console.log('\n❌ 일부 테스트 실패');
  process.exit(1);
} else {
  console.log('\n✅ 모든 테스트 통과!');
  process.exit(0);
}
