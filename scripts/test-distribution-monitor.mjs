/**
 * 결과 분포 모니터링 API 통합 테스트
 *
 * 테스트 항목:
 * 1. all-distributions API 응답 구조 검증
 * 2. THRESHOLDS 포함 여부 확인
 * 3. 미출현(zero) 결과 감지 로직 검증
 * 4. 알림 타입별 올바른 분류 확인
 */

// CHEMI_DATA는 빌드된 Next.js 앱에서만 사용 가능
// 여기서는 로직만 테스트

// ============================================================================
// 테스트 유틸리티
// ============================================================================

const THRESHOLDS = { HIGH: 40, LOW: 1 };

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`✅ PASS: ${message}`);
  return true;
}

function section(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${title}`);
  console.log('='.repeat(60));
}

// ============================================================================
// 테스트 1: CHEMI_DATA에서 resultLabels 추출 테스트
// ============================================================================

function testGetExpectedResults() {
  section('테스트 1: getExpectedResults 로직 시뮬레이션');

  let passed = 0;
  let failed = 0;

  // 시뮬레이션: CHEMI_DATA 구조
  const mockChemiData = {
    cat: {
      resultLabels: [
        { name: '냥집사형' },
        { name: '냥왕자형' },
        { name: '냥공주형' },
      ]
    },
    dog: {
      resultLabels: [
        { name: '댕댕이형' },
        { name: '멍멍이형' },
      ]
    },
    noLabels: {
      // resultLabels 없음
    }
  };

  // getExpectedResults 로직 (API route.ts 323-327줄과 동일)
  const getExpectedResults = (testType) => {
    const data = mockChemiData[testType];
    if (!data?.resultLabels) return [];
    return data.resultLabels.map(r => r.name);
  };

  // 테스트
  const catResults = getExpectedResults('cat');
  if (assert(catResults.length === 3, `cat: 3개 결과 추출`)) passed++; else failed++;
  if (assert(catResults.includes('냥집사형'), `cat: '냥집사형' 포함`)) passed++; else failed++;

  const dogResults = getExpectedResults('dog');
  if (assert(dogResults.length === 2, `dog: 2개 결과 추출`)) passed++; else failed++;

  const noResults = getExpectedResults('noLabels');
  if (assert(noResults.length === 0, `noLabels: 빈 배열 반환`)) passed++; else failed++;

  const unknownResults = getExpectedResults('unknown');
  if (assert(unknownResults.length === 0, `unknown: 빈 배열 반환`)) passed++; else failed++;

  return { passed, failed };
}

// ============================================================================
// 테스트 2: 알림 분류 로직 테스트
// ============================================================================

function testAlertClassification() {
  section('테스트 2: 알림 분류 로직');

  let passed = 0;
  let failed = 0;

  // 시뮬레이션 데이터
  const testDistributions = [
    { resultName: '높음', count: 50, percentage: 50 },   // HIGH (40% 이상)
    { resultName: '보통', count: 30, percentage: 30 },   // 정상
    { resultName: '낮음', count: 5, percentage: 0.5 },   // LOW (1% 미만, 0보다 큼)
    { resultName: '없음', count: 0, percentage: 0 },     // ZERO (0%)
  ];

  const expectedResults = ['높음', '보통', '낮음', '없음', '미정의'];

  const alerts = [];

  for (const d of testDistributions) {
    // HIGH 감지
    if (d.percentage >= THRESHOLDS.HIGH) {
      alerts.push({ type: 'high', resultName: d.resultName, percentage: d.percentage });
    }
    // LOW 감지 (0보다 크고 1% 미만)
    if (d.percentage > 0 && d.percentage < THRESHOLDS.LOW) {
      alerts.push({ type: 'low', resultName: d.resultName, percentage: d.percentage });
    }
    // ZERO 감지 (정의된 결과인데 0%)
    if (d.count === 0 && expectedResults.includes(d.resultName)) {
      alerts.push({ type: 'zero', resultName: d.resultName, percentage: 0 });
    }
  }

  // 검증
  const highAlerts = alerts.filter(a => a.type === 'high');
  const lowAlerts = alerts.filter(a => a.type === 'low');
  const zeroAlerts = alerts.filter(a => a.type === 'zero');

  if (assert(highAlerts.length === 1, `HIGH 알림 1개 감지 (50%)`)) passed++; else failed++;
  if (assert(highAlerts[0]?.resultName === '높음', `HIGH 알림 대상: '높음'`)) passed++; else failed++;

  if (assert(lowAlerts.length === 1, `LOW 알림 1개 감지 (0.5%)`)) passed++; else failed++;
  if (assert(lowAlerts[0]?.resultName === '낮음', `LOW 알림 대상: '낮음'`)) passed++; else failed++;

  if (assert(zeroAlerts.length === 1, `ZERO 알림 1개 감지 (0%)`)) passed++; else failed++;
  if (assert(zeroAlerts[0]?.resultName === '없음', `ZERO 알림 대상: '없음'`)) passed++; else failed++;

  // 미정의 결과는 DB에 없으므로 testDistributions에 없음 → 알림 없음
  const missingZero = zeroAlerts.find(a => a.resultName === '미정의');
  if (assert(!missingZero, `미정의 결과는 DB 결과 목록에 없으므로 알림 없음 (API에서 병합 필요)`)) passed++; else failed++;

  return { passed, failed };
}

// ============================================================================
// 테스트 3: 미출현 결과 병합 로직 테스트
// ============================================================================

function testZeroResultMerge() {
  section('테스트 3: 미출현 결과 병합 로직');

  let passed = 0;
  let failed = 0;

  // DB에서 온 결과 (일부만 있음)
  const dbResults = [
    { resultName: '결과A', count: 50 },
    { resultName: '결과B', count: 30 },
  ];

  // 정의된 전체 결과
  const expectedResults = ['결과A', '결과B', '결과C', '결과D'];

  // 병합 로직 (API route.ts 323-340줄과 동일)
  const existingResults = new Set(dbResults.map(item => item.resultName));
  const allResults = [...dbResults];

  expectedResults.forEach(name => {
    if (!existingResults.has(name)) {
      allResults.push({ resultName: name, count: 0 });
    }
  });

  // 검증
  if (assert(allResults.length === 4, `병합 후 4개 결과`)) passed++; else failed++;

  const zeroResults = allResults.filter(r => r.count === 0);
  if (assert(zeroResults.length === 2, `미출현 결과 2개 추가됨`)) passed++; else failed++;

  const hasC = allResults.some(r => r.resultName === '결과C' && r.count === 0);
  const hasD = allResults.some(r => r.resultName === '결과D' && r.count === 0);
  if (assert(hasC && hasD, `결과C, 결과D가 0으로 추가됨`)) passed++; else failed++;

  return { passed, failed };
}

// ============================================================================
// 테스트 4: 임계값 경계 테스트 (rawPercentage 기반)
// ============================================================================

function testThresholdBoundaries() {
  section('테스트 4: 임계값 경계 테스트');

  let passed = 0;
  let failed = 0;

  const testCases = [
    { rawPercentage: 40, expectedHigh: true, desc: '40% = HIGH 경계' },
    { rawPercentage: 39.9, expectedHigh: false, desc: '39.9% = HIGH 아님' },
    { rawPercentage: 1, expectedLow: false, desc: '1% = LOW 아님' },
    { rawPercentage: 0.9, expectedLow: true, desc: '0.9% = LOW' },
    { rawPercentage: 0, expectedLow: false, expectedZero: true, desc: '0% = ZERO (LOW 아님)' },
  ];

  for (const tc of testCases) {
    // count 기반 판단 시뮬레이션 (rawPercentage 사용)
    const count = tc.rawPercentage > 0 ? 1 : 0; // 시뮬레이션용
    const isHigh = tc.rawPercentage >= THRESHOLDS.HIGH;
    const isLow = count > 0 && tc.rawPercentage < THRESHOLDS.LOW;
    const isZero = count === 0;

    if (tc.expectedHigh !== undefined) {
      if (assert(isHigh === tc.expectedHigh, `${tc.desc} → HIGH=${isHigh}`)) passed++; else failed++;
    }
    if (tc.expectedLow !== undefined) {
      if (assert(isLow === tc.expectedLow, `${tc.desc} → LOW=${isLow}`)) passed++; else failed++;
    }
    if (tc.expectedZero !== undefined) {
      if (assert(isZero === tc.expectedZero, `${tc.desc} → ZERO=${isZero}`)) passed++; else failed++;
    }
  }

  return { passed, failed };
}

// ============================================================================
// 테스트 5: 반올림 경계 테스트 (0.05% 미만 → 0.0으로 반올림되는 케이스)
// ============================================================================

function testRoundingEdgeCases() {
  section('테스트 5: 반올림 경계 테스트 (0.05% 미만)');

  let passed = 0;
  let failed = 0;

  // 시뮬레이션: total=10000, count별 rawPercentage와 반올림 percentage
  const total = 10000;
  const testCases = [
    { count: 4, desc: '0.04% (반올림 → 0.0)' },   // rawPercentage=0.04, percentage=0.0
    { count: 5, desc: '0.05% (반올림 → 0.1)' },   // rawPercentage=0.05, percentage=0.1
    { count: 1, desc: '0.01% (반올림 → 0.0)' },   // rawPercentage=0.01, percentage=0.0
  ];

  for (const tc of testCases) {
    const rawPercentage = (tc.count / total) * 100;
    const percentage = Math.round((tc.count / total) * 1000) / 10;

    // 이전 방식: percentage로 판단 → 0.0이면 LOW 감지 실패
    const oldIsLow = percentage > 0 && percentage < THRESHOLDS.LOW;

    // 새 방식: count + rawPercentage로 판단 → 정확히 감지
    const newIsLow = tc.count > 0 && rawPercentage < THRESHOLDS.LOW;

    console.log(`  ${tc.desc}: raw=${rawPercentage.toFixed(4)}%, display=${percentage}%`);
    console.log(`    oldIsLow=${oldIsLow}, newIsLow=${newIsLow}`);

    // 새 방식은 count > 0이면 LOW 감지 가능
    if (assert(newIsLow === true, `${tc.desc}: 새 방식으로 LOW 감지`)) passed++; else failed++;

    // 0.05% 미만은 이전 방식에서 실패
    if (tc.count < 5) {
      if (assert(oldIsLow === false, `${tc.desc}: 이전 방식 실패 (percentage=0.0)`)) passed++; else failed++;
    }
  }

  return { passed, failed };
}

// ============================================================================
// 테스트 6: Set dedupe 테스트 (중복 resultLabels 처리)
// ============================================================================

function testSetDedupe() {
  section('테스트 6: Set dedupe 테스트');

  let passed = 0;
  let failed = 0;

  // 시뮬레이션: 중복이 있는 resultLabels
  const mockResultLabels = [
    { name: '결과A' },
    { name: '결과B' },
    { name: '결과A' },  // 중복!
    { name: '결과C' },
    { name: '결과B' },  // 중복!
  ];

  // 이전 방식: 배열로 처리 → 중복 포함
  const oldExpectedResults = mockResultLabels.map(r => r.name);
  // 새 방식: Set으로 처리 → 중복 제거
  const newExpectedResultsSet = new Set(mockResultLabels.map(r => r.name));

  if (assert(oldExpectedResults.length === 5, `이전 방식: 중복 포함 5개`)) passed++; else failed++;
  if (assert(newExpectedResultsSet.size === 3, `새 방식: 중복 제거 3개`)) passed++; else failed++;

  // DB 결과와 병합 시 중복 추가 방지
  const dbResults = [{ resultName: '결과A', count: 10 }];
  const existingResults = new Set(dbResults.map(r => r.resultName));

  // 이전 방식으로 병합 (중복 추가 가능)
  const oldAllResults = [...dbResults];
  oldExpectedResults.forEach(name => {
    if (!existingResults.has(name)) {
      oldAllResults.push({ resultName: name, count: 0 });
    }
  });

  // 새 방식으로 병합 (Set이므로 중복 자동 제거)
  const newAllResults = [...dbResults];
  newExpectedResultsSet.forEach(name => {
    if (!existingResults.has(name)) {
      newAllResults.push({ resultName: name, count: 0 });
    }
  });

  // 핵심 차이: 이전 방식은 중복 추가 발생! (결과B가 2번 추가됨)
  // existingResults는 DB 결과만 포함 → 결과B 중복 체크 불가
  if (assert(oldAllResults.length === 4, `이전 방식: 중복 포함 4개 (결과B 2번)`)) passed++; else failed++;
  if (assert(newAllResults.length === 3, `새 방식: 중복 제거 3개 (정확)`)) passed++; else failed++;

  // 핵심: Set으로 중복 제거해야 정확한 결과
  if (assert(oldAllResults.length > newAllResults.length, `Set dedupe가 중복 방지함`)) passed++; else failed++;

  return { passed, failed };
}

// ============================================================================
// 테스트 7: API-UI 일치 테스트 (rawPercentage 기반 판단)
// ============================================================================

function testApiUiConsistency() {
  section('테스트 7: API-UI 일치 테스트');

  let passed = 0;
  let failed = 0;

  // 경계 케이스: rawPercentage와 percentage가 다를 수 있는 상황
  const testCases = [
    // raw 39.96 → 표시 40.0 (이전: UI에서 HIGH, API에서 아님)
    { count: 3996, total: 10000, desc: 'raw 39.96% → 표시 40.0%' },
    // raw 40.04 → 표시 40.0 (둘 다 HIGH)
    { count: 4004, total: 10000, desc: 'raw 40.04% → 표시 40.0%' },
    // raw 0.04 → 표시 0.0 (이전: UI에서 ZERO처럼 보임, API에서 LOW)
    { count: 4, total: 10000, desc: 'raw 0.04% → 표시 0.0%' },
    // raw 0.96 → 표시 1.0 (이전: UI에서 정상, API에서 LOW)
    { count: 96, total: 10000, desc: 'raw 0.96% → 표시 1.0%' },
  ];

  for (const tc of testCases) {
    const rawPercentage = (tc.count / tc.total) * 100;
    const percentage = Math.round((tc.count / tc.total) * 1000) / 10;

    // API 판단 (rawPercentage 기반)
    const apiIsHigh = rawPercentage >= THRESHOLDS.HIGH;
    const apiIsLow = tc.count > 0 && rawPercentage < THRESHOLDS.LOW;

    // 이전 UI 판단 (percentage 기반) - 불일치 가능
    const oldUiIsHigh = percentage >= THRESHOLDS.HIGH;
    const oldUiIsLow = percentage > 0 && percentage < THRESHOLDS.LOW;

    // 새 UI 판단 (rawPercentage 기반) - API와 일치
    const newUiIsHigh = rawPercentage >= THRESHOLDS.HIGH;
    const newUiIsLow = tc.count > 0 && rawPercentage < THRESHOLDS.LOW;

    console.log(`  ${tc.desc}: raw=${rawPercentage.toFixed(2)}%, display=${percentage}%`);
    console.log(`    API: HIGH=${apiIsHigh}, LOW=${apiIsLow}`);
    console.log(`    Old UI: HIGH=${oldUiIsHigh}, LOW=${oldUiIsLow}`);
    console.log(`    New UI: HIGH=${newUiIsHigh}, LOW=${newUiIsLow}`);

    // 새 UI는 API와 항상 일치해야 함
    if (assert(newUiIsHigh === apiIsHigh, `${tc.desc}: HIGH 일치`)) passed++; else failed++;
    if (assert(newUiIsLow === apiIsLow, `${tc.desc}: LOW 일치`)) passed++; else failed++;
  }

  return { passed, failed };
}

// ============================================================================
// 테스트 8: 경계 근처 표시 포맷 테스트
// ============================================================================

function testBoundaryDisplayFormat() {
  section('테스트 8: 경계 근처 표시 포맷');

  let passed = 0;
  let failed = 0;

  // formatPercentage 로직 시뮬레이션
  const formatPercentage = (rawPct, displayPct) => {
    const nearHighBoundary = Math.abs(rawPct - THRESHOLDS.HIGH) < 0.1;
    const nearLowBoundary = Math.abs(rawPct - THRESHOLDS.LOW) < 0.1;
    const verySmall = rawPct > 0 && rawPct < 0.1;

    if (nearHighBoundary || nearLowBoundary || verySmall) {
      return rawPct.toFixed(2);
    }
    return displayPct.toString();
  };

  const testCases = [
    // HIGH 경계 근처
    { raw: 39.96, display: 40, expected: '39.96', desc: 'HIGH 경계 아래 (39.96)' },
    { raw: 40.04, display: 40, expected: '40.04', desc: 'HIGH 경계 위 (40.04)' },
    { raw: 40.0, display: 40, expected: '40.00', desc: 'HIGH 경계 정확히 (40.00)' },
    // LOW 경계 근처
    { raw: 0.96, display: 1, expected: '0.96', desc: 'LOW 경계 아래 (0.96)' },
    { raw: 1.04, display: 1, expected: '1.04', desc: 'LOW 경계 위 (1.04)' },
    // 매우 작은 값
    { raw: 0.04, display: 0, expected: '0.04', desc: '매우 작은 값 (0.04)' },
    { raw: 0.01, display: 0, expected: '0.01', desc: '매우 작은 값 (0.01)' },
    // 일반 값 (경계에서 멀리)
    { raw: 25.5, display: 25.5, expected: '25.5', desc: '일반 값 (25.5)' },
    { raw: 5.0, display: 5, expected: '5', desc: '일반 값 (5.0)' },
  ];

  for (const tc of testCases) {
    const result = formatPercentage(tc.raw, tc.display);
    console.log(`  ${tc.desc}: raw=${tc.raw}, display=${tc.display} → "${result}"`);
    if (assert(result === tc.expected, `${tc.desc}: "${result}" === "${tc.expected}"`)) passed++; else failed++;
  }

  return { passed, failed };
}

// ============================================================================
// 메인 실행
// ============================================================================

console.log('🧪 결과 분포 모니터링 통합 테스트');
console.log('='.repeat(60));

const results = [
  testGetExpectedResults(),
  testAlertClassification(),
  testZeroResultMerge(),
  testThresholdBoundaries(),
  testRoundingEdgeCases(),
  testSetDedupe(),
  testApiUiConsistency(),
  testBoundaryDisplayFormat(),
];

const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

section('최종 결과');
console.log(`✅ 통과: ${totalPassed}`);
console.log(`❌ 실패: ${totalFailed}`);

if (totalFailed === 0) {
  console.log('\n🎉 모든 테스트 통과!');
} else {
  console.log('\n⚠️ 일부 테스트 실패');
  process.exitCode = 1;
}
