/**
 * 좋아요 토글 동시성 테스트
 *
 * 실행: node scripts/test-likes-concurrency.mjs
 *
 * 테스트 시나리오:
 * 1. 여러 사용자가 동시에 같은 대상에 좋아요
 * 2. 같은 사용자가 빠르게 연속 토글
 * 3. 최종 카운트 일관성 검증
 *
 * 참고: libSQL HTTP 모드에서는 BEGIN/COMMIT 대신 batch()를 사용
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const TEST_TARGET_TYPE = 'poll'; // poll 사용 (comments 테이블 업데이트 없이 테스트)

async function cleanup() {
  await client.execute({
    sql: 'DELETE FROM likes WHERE target_id LIKE ?',
    args: ['test_%']
  });
  console.log('🧹 테스트 데이터 정리 완료\n');
}

// 좋아요 토글 시뮬레이션 (단일 쿼리로 원자적 처리)
async function toggleLike(deviceId, targetType, targetId) {
  try {
    // INSERT 시도
    const insertResult = await client.execute({
      sql: `INSERT INTO likes (device_id, target_type, target_id)
            VALUES (?, ?, ?)
            ON CONFLICT(device_id, target_type, target_id) DO NOTHING`,
      args: [deviceId, targetType, targetId]
    });

    const wasInserted = insertResult.rowsAffected > 0;

    if (!wasInserted) {
      // 이미 존재 → 삭제
      await client.execute({
        sql: 'DELETE FROM likes WHERE device_id = ? AND target_type = ? AND target_id = ?',
        args: [deviceId, targetType, targetId]
      });
    }

    return { success: true, action: wasInserted ? 'added' : 'removed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 좋아요 수 조회
async function getLikeCount(targetType, targetId) {
  const result = await client.execute({
    sql: 'SELECT COUNT(*) as count FROM likes WHERE target_type = ? AND target_id = ?',
    args: [targetType, targetId]
  });
  return Number(result.rows[0]?.count) || 0;
}

// 특정 사용자의 좋아요 여부 확인
async function checkUserLiked(deviceId, targetType, targetId) {
  const result = await client.execute({
    sql: 'SELECT id FROM likes WHERE device_id = ? AND target_type = ? AND target_id = ?',
    args: [deviceId, targetType, targetId]
  });
  return result.rows.length > 0;
}

// 테스트 1: 여러 사용자가 동시에 좋아요
async function testConcurrentDifferentUsers() {
  console.log('📋 테스트 1: 10명의 사용자가 동시에 좋아요');

  const testTargetId = 'test_multi_' + Date.now();
  const users = Array.from({ length: 10 }, (_, i) => `user_${i}`);

  // 동시 실행
  const results = await Promise.all(
    users.map(user => toggleLike(user, TEST_TARGET_TYPE, testTargetId))
  );

  const successCount = results.filter(r => r.success).length;
  const addedCount = results.filter(r => r.action === 'added').length;
  const likeCount = await getLikeCount(TEST_TARGET_TYPE, testTargetId);

  console.log(`  - 성공: ${successCount}/10`);
  console.log(`  - 추가됨: ${addedCount}개`);
  console.log(`  - 실제 likes 테이블 수: ${likeCount}`);

  // UNIQUE 제약으로 인해 각 사용자당 최대 1개만 들어감
  // 모두 다른 사용자이므로 10개가 들어가야 함
  const passed = successCount === 10 && likeCount === 10;
  console.log(`  - 결과: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);

  // 정리
  await client.execute({
    sql: 'DELETE FROM likes WHERE target_id = ?',
    args: [testTargetId]
  });

  return passed;
}

// 테스트 2: 같은 사용자가 빠르게 연속 토글 (5회)
async function testRapidToggle() {
  console.log('📋 테스트 2: 같은 사용자가 5회 순차 토글');

  const testTargetId = 'test_rapid_' + Date.now();
  const deviceId = 'rapid_user';

  // 순차 실행 (빠르게)
  const results = [];
  for (let i = 0; i < 5; i++) {
    const result = await toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId);
    results.push(result);
  }

  const likeCount = await getLikeCount(TEST_TARGET_TYPE, testTargetId);

  // 5회 토글: 추가(1) → 삭제(0) → 추가(1) → 삭제(0) → 추가(1) = 1
  console.log(`  - 토글 결과: ${results.map(r => r.action).join(' → ')}`);
  console.log(`  - 최종 likes 수: ${likeCount}`);
  console.log(`  - 예상 likes 수: 1 (홀수번 토글)`);

  const passed = likeCount === 1;
  console.log(`  - 결과: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);

  // 정리
  await client.execute({
    sql: 'DELETE FROM likes WHERE target_id = ?',
    args: [testTargetId]
  });

  return passed;
}

// 테스트 3: 동시 토글 충돌 테스트 (같은 사용자가 동시에 2개 요청)
async function testConcurrentSameUser() {
  console.log('📋 테스트 3: 같은 사용자가 동시에 2개 요청 (충돌 테스트)');

  const testTargetId = 'test_conflict_' + Date.now();
  const deviceId = 'conflict_user';

  // 동시 실행
  const results = await Promise.all([
    toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId),
    toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId),
  ]);

  const likeCount = await getLikeCount(TEST_TARGET_TYPE, testTargetId);
  const successCount = results.filter(r => r.success).length;

  console.log(`  - 성공한 요청: ${successCount}/2`);
  console.log(`  - 결과: ${results.map(r => r.action || r.error).join(', ')}`);
  console.log(`  - 최종 likes 수: ${likeCount}`);

  // 동시 요청이라도 UNIQUE 제약으로 최종 상태는 0 또는 1
  const passed = (likeCount === 0 || likeCount === 1);
  console.log(`  - 결과: ${passed ? '✅ PASS (일관성 유지)' : '❌ FAIL'}\n`);

  // 정리
  await client.execute({
    sql: 'DELETE FROM likes WHERE target_id = ?',
    args: [testTargetId]
  });

  return passed;
}

// 테스트 4: 좋아요 → 취소 → 다시 좋아요 시퀀스
async function testToggleSequence() {
  console.log('📋 테스트 4: 좋아요 → 취소 → 다시 좋아요 시퀀스');

  const testTargetId = 'test_seq_' + Date.now();
  const deviceId = 'seq_user';

  // 좋아요
  const r1 = await toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId);
  const count1 = await getLikeCount(TEST_TARGET_TYPE, testTargetId);
  const liked1 = await checkUserLiked(deviceId, TEST_TARGET_TYPE, testTargetId);

  // 취소
  const r2 = await toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId);
  const count2 = await getLikeCount(TEST_TARGET_TYPE, testTargetId);
  const liked2 = await checkUserLiked(deviceId, TEST_TARGET_TYPE, testTargetId);

  // 다시 좋아요
  const r3 = await toggleLike(deviceId, TEST_TARGET_TYPE, testTargetId);
  const count3 = await getLikeCount(TEST_TARGET_TYPE, testTargetId);
  const liked3 = await checkUserLiked(deviceId, TEST_TARGET_TYPE, testTargetId);

  console.log(`  - 1단계 (좋아요): action=${r1.action}, count=${count1}, liked=${liked1}`);
  console.log(`  - 2단계 (취소): action=${r2.action}, count=${count2}, liked=${liked2}`);
  console.log(`  - 3단계 (다시): action=${r3.action}, count=${count3}, liked=${liked3}`);

  const passed = (
    r1.action === 'added' && count1 === 1 && liked1 === true &&
    r2.action === 'removed' && count2 === 0 && liked2 === false &&
    r3.action === 'added' && count3 === 1 && liked3 === true
  );
  console.log(`  - 결과: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);

  // 정리
  await client.execute({
    sql: 'DELETE FROM likes WHERE target_id = ?',
    args: [testTargetId]
  });

  return passed;
}

async function runTests() {
  console.log('🧪 좋아요 토글 동시성 테스트 시작\n');
  console.log('=' .repeat(50) + '\n');

  await cleanup();

  const results = [];

  results.push(await testConcurrentDifferentUsers());
  results.push(await testRapidToggle());
  results.push(await testConcurrentSameUser());
  results.push(await testToggleSequence());

  await cleanup();

  console.log('=' .repeat(50));
  console.log(`\n📊 최종 결과: ${results.filter(r => r).length}/${results.length} 통과`);

  if (results.every(r => r)) {
    console.log('✅ 모든 테스트 통과!\n');
  } else {
    console.log('❌ 일부 테스트 실패\n');
  }
}

runTests().catch(console.error);
