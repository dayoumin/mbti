/**
 * Ranking Votes API 테스트
 *
 * 테스트 실행: node tests/ranking-votes-api.test.ts
 * 또는: npx tsx tests/ranking-votes-api.test.ts
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
  const testSeasonId = '2024-Q4';
  const testCategoryId = 'most_active';
  const testResultKey = 'test-result';
  let savedVoteId: string;
  let passed = 0;
  let failed = 0;

  console.log(`\n🧪 Ranking Votes API 테스트`);
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  // Test 1: POST - 투표 저장 성공
  try {
    console.log('1. POST /api/ranking-votes - 투표 저장...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        categoryId: testCategoryId,
        resultKey: testResultKey,
        resultEmoji: '🎯',
        testType: 'human',
        seasonId: testSeasonId,
        seasonType: 'quarterly',
      }),
    });
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.success, true, 'success should be true');
    assertDefined(data.id, 'id');
    savedVoteId = data.id;
    console.log(`   ✅ PASS (id: ${savedVoteId})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 2: POST - 필수 필드 누락
  try {
    console.log('2. POST - 필수 필드 누락 시 400...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        resultKey: testResultKey,
        testType: 'human',
        seasonId: testSeasonId,
      }),
    });
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assertEqual(data.error, 'Missing required fields', 'error message');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 3: POST - 빈 deviceId
  try {
    console.log('3. POST - 빈 deviceId 시 400...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: '',
        categoryId: testCategoryId,
        resultKey: testResultKey,
        testType: 'human',
        seasonId: testSeasonId,
      }),
    });
    assertEqual(res.status, 400, 'status should be 400');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 3.5: POST - 잘못된 seasonType
  try {
    console.log('3.5. POST - 잘못된 seasonType 시 400...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: testDeviceId,
        categoryId: testCategoryId,
        resultKey: testResultKey,
        testType: 'human',
        seasonId: testSeasonId,
        seasonType: 'invalid-type',
      }),
    });
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assert(data.error.includes('Invalid seasonType'), 'error should mention Invalid seasonType');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 4: GET - 시즌 목록
  try {
    console.log('4. GET ?type=seasons - 시즌 목록...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes?type=seasons`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertDefined(data.seasons, 'seasons');
    assert(Array.isArray(data.seasons), 'seasons should be array');
    console.log(`   ✅ PASS (${data.seasons.length} seasons)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 5: GET - 통계
  try {
    console.log('5. GET ?type=stats&seasonId=... - 시즌 통계...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes?type=stats&seasonId=${testSeasonId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertEqual(data.seasonId, testSeasonId, 'seasonId');
    assertDefined(data.stats, 'stats');
    console.log(`   ✅ PASS (${Object.keys(data.stats).length} categories)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 6: GET - deviceId로 조회
  try {
    console.log('6. GET ?deviceId=... - 사용자별 조회...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes?deviceId=${testDeviceId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertDefined(data.votes, 'votes');
    assert(Array.isArray(data.votes), 'votes should be array');
    console.log(`   ✅ PASS (${data.votes.length} votes)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 7: GET - seasonId로 조회
  try {
    console.log('7. GET ?seasonId=... - 시즌별 조회...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes?seasonId=${testSeasonId}`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertDefined(data.votes, 'votes');
    console.log(`   ✅ PASS (${data.votes.length} votes)`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 8: GET - 전체 조회
  try {
    console.log('8. GET ?type=all&limit=10 - 전체 조회...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes?type=all&limit=10`);
    assertEqual(res.status, 200, 'status should be 200');
    const data = await res.json();
    assertDefined(data.votes, 'votes');
    assertDefined(data.totalCount, 'totalCount');
    console.log(`   ✅ PASS (total: ${data.totalCount})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 9: GET - 파라미터 없이 요청
  try {
    console.log('9. GET (no params) - 400 에러...');
    const res = await fetch(`${BASE_URL}/api/ranking-votes`);
    assertEqual(res.status, 400, 'status should be 400');
    const data = await res.json();
    assertEqual(data.error, 'Missing required parameters', 'error message');
    console.log(`   ✅ PASS`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 10: 시즌 정렬 테스트
  try {
    console.log('10. 시즌 정렬 (Q4 > Q3 > Q2 > Q1 > yearly)...');

    // 여러 시즌에 투표 추가
    const seasons = ['2024-Q1', '2024-Q4', '2024-Q2', '2024-yearly', '2024-Q3'];
    for (const seasonId of seasons) {
      await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: `sort-test-${Date.now()}-${Math.random()}`,
          categoryId: 'test-sort',
          resultKey: 'test',
          testType: 'human',
          seasonId,
          seasonType: seasonId.includes('yearly') ? 'yearly' : 'quarterly',
        }),
      });
    }

    const res = await fetch(`${BASE_URL}/api/ranking-votes?type=seasons`);
    const data = await res.json();
    const seasons2024 = data.seasons.filter((s: string) => s.startsWith('2024'));

    const q4Index = seasons2024.indexOf('2024-Q4');
    const q1Index = seasons2024.indexOf('2024-Q1');
    const yearlyIndex = seasons2024.indexOf('2024-yearly');

    if (q4Index !== -1 && q1Index !== -1) {
      assert(q4Index < q1Index, `Q4 should come before Q1 (Q4: ${q4Index}, Q1: ${q1Index})`);
    }
    if (q1Index !== -1 && yearlyIndex !== -1) {
      assert(q1Index < yearlyIndex, `Q1 should come before yearly (Q1: ${q1Index}, yearly: ${yearlyIndex})`);
    }
    console.log(`   ✅ PASS (order: ${seasons2024.slice(0, 5).join(', ')})`);
    passed++;
  } catch (e) {
    console.log(`   ${e}`);
    failed++;
  }

  // Test 11: 통계 캐시 업데이트
  try {
    console.log('11. 통계 캐시 업데이트...');
    const uniqueCategory = `test-stats-${Date.now()}`;

    // 첫 번째 투표
    await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: `stats-test-1-${Date.now()}`,
        categoryId: uniqueCategory,
        resultKey: 'result-a',
        testType: 'human',
        seasonId: testSeasonId,
        seasonType: 'quarterly',
      }),
    });

    // 두 번째 투표
    await fetch(`${BASE_URL}/api/ranking-votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: `stats-test-2-${Date.now()}`,
        categoryId: uniqueCategory,
        resultKey: 'result-a',
        testType: 'human',
        seasonId: testSeasonId,
        seasonType: 'quarterly',
      }),
    });

    const res = await fetch(`${BASE_URL}/api/ranking-votes?type=stats&seasonId=${testSeasonId}`);
    const data = await res.json();
    const categoryStats = data.stats[uniqueCategory];

    assertDefined(categoryStats, 'categoryStats');
    assert(categoryStats.votes['result-a'] >= 2, `vote count should be >= 2 (got ${categoryStats.votes['result-a']})`);
    assert(categoryStats.totalVotes >= 2, `totalVotes should be >= 2 (got ${categoryStats.totalVotes})`);
    console.log(`   ✅ PASS (votes: ${categoryStats.votes['result-a']}, total: ${categoryStats.totalVotes})`);
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

// Jest 호환용 (나중에 Jest 추가 시 사용)
/*
import { describe, it, expect, beforeAll } from '@jest/globals';

describe('Ranking Votes API', () => {
  const testDeviceId = `test-device-${Date.now()}`;
  const testSeasonId = '2024-Q4';
  const testCategoryId = 'most_active';
  const testResultKey = 'test-result';
  let savedVoteId: string;

  describe('POST /api/ranking-votes', () => {
    it('should save a vote successfully', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: testDeviceId,
          categoryId: testCategoryId,
          resultKey: testResultKey,
          resultEmoji: '🎯',
          testType: 'human',
          seasonId: testSeasonId,
          seasonType: 'quarterly',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
      savedVoteId = data.id;
    });

    it('should reject vote with missing required fields', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: testDeviceId,
          // categoryId missing
          resultKey: testResultKey,
          testType: 'human',
          seasonId: testSeasonId,
        }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle empty deviceId', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: '',
          categoryId: testCategoryId,
          resultKey: testResultKey,
          testType: 'human',
          seasonId: testSeasonId,
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/ranking-votes', () => {
    it('should get seasons list', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=seasons`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.seasons).toBeDefined();
      expect(Array.isArray(data.seasons)).toBe(true);
    });

    it('should get stats by seasonId', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=stats&seasonId=${testSeasonId}`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.seasonId).toBe(testSeasonId);
      expect(data.stats).toBeDefined();
    });

    it('should get votes by deviceId', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?deviceId=${testDeviceId}`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.votes).toBeDefined();
      expect(Array.isArray(data.votes)).toBe(true);
    });

    it('should get votes by seasonId', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?seasonId=${testSeasonId}`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.votes).toBeDefined();
    });

    it('should get all votes with type=all', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=all&limit=10`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.votes).toBeDefined();
      expect(data.totalCount).toBeDefined();
    });

    it('should respect limit parameter', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=all&limit=5`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.votes.length).toBeLessThanOrEqual(5);
    });

    it('should reject requests without required parameters', async () => {
      const res = await fetch(`${BASE_URL}/api/ranking-votes`);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBe('Missing required parameters');
    });
  });

  describe('Season sorting', () => {
    it('should sort seasons correctly (Q4 > Q3 > Q2 > Q1 > yearly)', async () => {
      // 여러 시즌에 투표 추가
      const seasons = ['2024-Q1', '2024-Q4', '2024-Q2', '2024-yearly', '2024-Q3'];

      for (const seasonId of seasons) {
        await fetch(`${BASE_URL}/api/ranking-votes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: `sort-test-${Date.now()}`,
            categoryId: 'test-sort',
            resultKey: 'test',
            testType: 'human',
            seasonId,
            seasonType: seasonId.includes('yearly') ? 'yearly' : 'quarterly',
          }),
        });
      }

      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=seasons`);
      const data = await res.json();

      // 2024 시즌만 필터링하여 순서 확인
      const seasons2024 = data.seasons.filter((s: string) => s.startsWith('2024'));

      // Q4가 Q1보다 앞에 있어야 함
      const q4Index = seasons2024.indexOf('2024-Q4');
      const q1Index = seasons2024.indexOf('2024-Q1');
      const yearlyIndex = seasons2024.indexOf('2024-yearly');

      if (q4Index !== -1 && q1Index !== -1) {
        expect(q4Index).toBeLessThan(q1Index);
      }

      if (q1Index !== -1 && yearlyIndex !== -1) {
        expect(q1Index).toBeLessThan(yearlyIndex);
      }
    });
  });

  describe('Stats cache', () => {
    it('should update vote count correctly', async () => {
      const uniqueCategory = `test-stats-${Date.now()}`;

      // 첫 번째 투표
      await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: `stats-test-1-${Date.now()}`,
          categoryId: uniqueCategory,
          resultKey: 'result-a',
          testType: 'human',
          seasonId: testSeasonId,
          seasonType: 'quarterly',
        }),
      });

      // 두 번째 투표 (같은 결과)
      await fetch(`${BASE_URL}/api/ranking-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: `stats-test-2-${Date.now()}`,
          categoryId: uniqueCategory,
          resultKey: 'result-a',
          testType: 'human',
          seasonId: testSeasonId,
          seasonType: 'quarterly',
        }),
      });

      // 통계 확인
      const res = await fetch(`${BASE_URL}/api/ranking-votes?type=stats&seasonId=${testSeasonId}`);
      const data = await res.json();

      const categoryStats = data.stats[uniqueCategory];
      expect(categoryStats).toBeDefined();
      expect(categoryStats.votes['result-a']).toBeGreaterThanOrEqual(2);
      expect(categoryStats.totalVotes).toBeGreaterThanOrEqual(2);
    });
  });
});
*/

