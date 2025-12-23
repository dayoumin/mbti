/**
 * Test Results API 테스트
 *
 * 테스트 실행: npx tsx tests/test-results-api.test.ts
 * 서버 실행 필요: npm run dev (별도 터미널)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// 간단한 assertion 함수
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ FAIL: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`❌ FAIL: ${message} (expected ${expected}, got ${actual})`);
  }
}

function assertDefined(value: unknown, message: string) {
  if (value === undefined || value === null) {
    throw new Error(`❌ FAIL: ${message} is undefined/null`);
  }
}

async function runTests() {
  const testDeviceId = `test-device-${Date.now()}`;
  const testType = 'human';
  const testResultName = 'Test Result';
  let passed = 0;
  let failed = 0;

  console.log(`\n🧪 Test Results API 테스트`);
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  // Test 1: POST - 결과 저장 성공
  try {
    console.log('1. POST /api/test-results - 결과 저장...');
    const res = await fetch(`${BASE_URL}/api/test-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        testType: testType,
        resultName: testResultName,
        resultEmoji: '🧠',
        scores: { inssa: 15, adventure: 12, empathy: 18, plan: 10, mental: 14 },
        isDeepMode: false,
      }),
    });
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.success, true, 'success should be true');
    assertDefined(data.id, 'id should be defined');
    console.log(`   ✅ PASS (id: ${data.id})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 2: POST - parentInfo 포함 저장
  try {
    console.log('2. POST - parentInfo 포함 저장...');
    const res = await fetch(`${BASE_URL}/api/test-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        testType: 'dogBreed',
        resultName: '골든 리트리버',
        resultEmoji: '🐕',
        scores: { energy: 20, humanLove: 25 },
        isDeepMode: false,
        parentInfo: { testType: 'petMatch', resultName: '강아지' },
      }),
    });
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.success, true, 'success should be true');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 3: POST - 필수 필드 누락
  try {
    console.log('3. POST - 필수 필드 누락 시 400...');
    const res = await fetch(`${BASE_URL}/api/test-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        // testType 누락
        resultName: testResultName,
      }),
    });
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assert(data.error.includes('required'), 'error should mention required');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 4: GET - 내 결과 조회
  try {
    console.log('4. GET ?type=my-results - 내 결과 조회...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=my-results&deviceId=${testDeviceId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertDefined(data.results, 'results should be defined');
    assert(Array.isArray(data.results), 'results should be array');
    assert(data.results.length >= 2, `should have at least 2 results (got ${data.results.length})`);
    console.log(`   ✅ PASS (${data.results.length} results)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 5: GET - 분포 조회
  try {
    console.log('5. GET ?type=distribution - 결과 분포 조회...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=distribution&testType=${testType}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.testType, testType, 'testType should match');
    assertDefined(data.distribution, 'distribution should be defined');
    assert(Array.isArray(data.distribution), 'distribution should be array');
    assertDefined(data.total, 'total should be defined');
    console.log(`   ✅ PASS (${data.distribution.length} results, total: ${data.total})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 6: GET - 분포 조회 (연령대 필터)
  try {
    console.log('6. GET ?type=distribution&ageGroup=20s - 연령대별 분포...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=distribution&testType=${testType}&ageGroup=20s`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    // demographics 테이블 없으면 폴백으로 'all' 반환 (정상 동작)
    assert(data.filter.ageGroup === '20s' || data.filter.ageGroup === 'all', 'ageGroup should be 20s or all (fallback)');
    assert(Array.isArray(data.distribution), 'distribution should be array');
    console.log(`   ✅ PASS (filter: ${data.filter.ageGroup}, results: ${data.distribution.length})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 7: GET - 내 결과 순위 조회
  try {
    console.log('7. GET ?type=my-rank - 내 결과 순위...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=my-rank&testType=${testType}&deviceId=${testDeviceId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.hasResult, true, 'hasResult should be true');
    assertDefined(data.rank, 'rank should be defined');
    assertDefined(data.percentage, 'percentage should be defined');
    console.log(`   ✅ PASS (rank: ${data.rank}, ${data.percentage}%)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 8: GET - 존재하지 않는 테스트의 순위
  try {
    console.log('8. GET ?type=my-rank - 결과 없는 경우...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=my-rank&testType=nonexistent&deviceId=${testDeviceId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.hasResult, false, 'hasResult should be false');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 9: GET - deviceId 없이 내 결과 조회
  try {
    console.log('9. GET ?type=my-results (no deviceId) - 400...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=my-results`);
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assert(data.error.includes('deviceId'), 'error should mention deviceId');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 10: GET - 분포에서 testType 없이 조회
  try {
    console.log('10. GET ?type=distribution (no testType) - 400...');
    const res = await fetch(`${BASE_URL}/api/test-results?type=distribution`);
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assert(data.error.includes('testType'), 'error should mention testType');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 11: 분포 순위 정렬 확인
  try {
    console.log('11. 분포 순위 정렬 확인...');
    // 여러 결과 추가
    for (let i = 0; i < 3; i++) {
      await fetch(`${BASE_URL}/api/test-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: `sort-test-${Date.now()}-${i}`,
          testType: testType,
          resultName: 'Popular Result',
          resultEmoji: '⭐',
          scores: { inssa: 20 },
        }),
      });
    }

    const res = await fetch(`${BASE_URL}/api/test-results?type=distribution&testType=${testType}`);
    const data = await res.json();

    // rank가 1부터 순차적으로 증가하는지 확인
    for (let i = 0; i < data.distribution.length; i++) {
      assertEqual(data.distribution[i].rank, i + 1, `rank at index ${i} should be ${i + 1}`);
    }

    // percentage 합계가 100% 이하인지 확인
    const totalPercentage = data.distribution.reduce((sum: number, d: { percentage: number }) => sum + d.percentage, 0);
    assert(totalPercentage <= 100 + data.distribution.length, 'total percentage should be <= 100 (allowing rounding)');

    console.log(`   ✅ PASS (${data.distribution.length} results sorted)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // 결과 출력
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 테스트 결과: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log(`✨ 모든 테스트 통과!`);
  } else {
    console.log(`⚠️  ${failed}개 테스트 실패`);
    process.exit(1);
  }
}

runTests().catch(console.error);
