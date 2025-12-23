/**
 * ContentService 테스트 스크립트
 *
 * 사용법: node scripts/test-content-service.mjs
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ TURSO_DATABASE_URL is not defined');
  process.exit(1);
}

const client = createClient({ url, authToken });

// 테스트 헬퍼
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
  }
}

async function test(name, fn) {
  console.log(`\n📋 ${name}`);
  try {
    await fn();
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    failed++;
  }
}

// ============================================================================
// 테스트 실행
// ============================================================================

async function runTests() {
  console.log('\n🧪 ContentService 테스트 시작\n');
  console.log('='.repeat(50));

  // ========== 1. 퀴즈 조회 테스트 ==========
  await test('퀴즈 목록 조회', async () => {
    const result = await client.execute(`SELECT * FROM quizzes WHERE status = 'active'`);
    assert(result.rows.length >= 3, `DB에 퀴즈 ${result.rows.length}개 존재`);

    const quiz = result.rows[0];
    assert(quiz.id, 'id 필드 존재');
    assert(quiz.question, 'question 필드 존재');
    assert(quiz.options, 'options 필드 존재 (JSON)');

    // JSON 파싱 테스트
    const options = JSON.parse(quiz.options);
    assert(Array.isArray(options), 'options JSON 파싱 성공');
    assert(options.length >= 2, `옵션 ${options.length}개`);
  });

  await test('퀴즈 단일 조회', async () => {
    const result = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ?`,
      args: ['cat-quiz-001'],
    });
    assert(result.rows.length === 1, 'cat-quiz-001 존재');

    const quiz = result.rows[0];
    assert(quiz.category === 'cat', 'category가 cat');
    assert(quiz.difficulty === 1, 'difficulty가 1');
  });

  await test('퀴즈 카테고리 필터', async () => {
    const result = await client.execute({
      sql: `SELECT * FROM quizzes WHERE category = ? AND status = 'active'`,
      args: ['cat'],
    });
    assert(result.rows.length >= 1, `cat 카테고리 퀴즈 ${result.rows.length}개`);

    // 없는 카테고리
    const emptyResult = await client.execute({
      sql: `SELECT * FROM quizzes WHERE category = ? AND status = 'active'`,
      args: ['nonexistent'],
    });
    assert(emptyResult.rows.length === 0, '없는 카테고리는 0개');
  });

  // ========== 2. 투표 조회 테스트 ==========
  await test('투표 목록 조회', async () => {
    const result = await client.execute(`SELECT * FROM polls WHERE status = 'active'`);
    assert(result.rows.length >= 3, `DB에 투표 ${result.rows.length}개 존재`);

    const poll = result.rows[0];
    assert(poll.type === 'vs' || poll.type === 'choice', `type이 ${poll.type}`);

    const options = JSON.parse(poll.options);
    assert(options.length >= 2, `옵션 ${options.length}개`);
  });

  await test('투표 단일 조회', async () => {
    const result = await client.execute({
      sql: `SELECT * FROM polls WHERE id = ?`,
      args: ['cat-poll-001'],
    });
    assert(result.rows.length === 1, 'cat-poll-001 존재');
    assert(result.rows[0].type === 'vs', 'type이 vs');
  });

  // ========== 3. 시나리오 조회 테스트 ==========
  await test('시나리오 퀴즈 조회', async () => {
    const result = await client.execute(`SELECT * FROM scenario_quizzes WHERE status = 'active'`);
    assert(result.rows.length >= 1, `시나리오 ${result.rows.length}개 존재`);

    const scenario = result.rows[0];
    assert(scenario.title, 'title 필드 존재');
    assert(scenario.emoji, 'emoji 필드 존재');

    const questions = JSON.parse(scenario.questions);
    assert(Array.isArray(questions), 'questions JSON 파싱 성공');
    assert(questions.length >= 1, `질문 ${questions.length}개`);

    const results = JSON.parse(scenario.results);
    assert(Array.isArray(results), 'results JSON 파싱 성공');
    assert(results.length >= 1, `결과 등급 ${results.length}개`);
  });

  // ========== 4. 토너먼트 조회 테스트 ==========
  await test('토너먼트 조회', async () => {
    const result = await client.execute(`SELECT * FROM tournaments WHERE status = 'active'`);
    assert(result.rows.length >= 1, `토너먼트 ${result.rows.length}개 존재`);

    const tournament = result.rows[0];
    assert(tournament.round_size === 16, `round_size가 ${tournament.round_size}`);

    const contestants = JSON.parse(tournament.contestants);
    assert(Array.isArray(contestants), 'contestants JSON 파싱 성공');
    assert(contestants.length >= 4, `참가자 ${contestants.length}명`);

    const resultConfig = JSON.parse(tournament.result_config);
    assert(resultConfig.showRanking !== undefined, 'resultConfig.showRanking 존재');
  });

  // ========== 5. CRUD 테스트 ==========
  await test('퀴즈 생성', async () => {
    const testId = `test-quiz-${Date.now()}`;

    // 생성
    await client.execute({
      sql: `INSERT INTO quizzes (id, type, category, question, options, difficulty, status)
            VALUES (?, 'knowledge', 'cat', '테스트 질문', '[]', 1, 'active')`,
      args: [testId],
    });

    // 확인
    const result = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ?`,
      args: [testId],
    });
    assert(result.rows.length === 1, '생성된 퀴즈 존재');

    // 삭제 (정리)
    await client.execute({
      sql: `DELETE FROM quizzes WHERE id = ?`,
      args: [testId],
    });

    const afterDelete = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ?`,
      args: [testId],
    });
    assert(afterDelete.rows.length === 0, '삭제 후 없음');
  });

  await test('중복 ID 생성 실패', async () => {
    try {
      await client.execute({
        sql: `INSERT INTO quizzes (id, type, category, question, options, difficulty, status)
              VALUES ('cat-quiz-001', 'knowledge', 'cat', '중복 테스트', '[]', 1, 'active')`,
        args: [],
      });
      assert(false, '중복 ID는 에러가 발생해야 함');
    } catch (error) {
      assert(error.message.includes('UNIQUE') || error.message.includes('constraint'),
             '중복 ID 에러 발생');
    }
  });

  // ========== 5.5 UPDATE 테스트 ==========
  await test('퀴즈 수정', async () => {
    const testId = `test-update-${Date.now()}`;

    // 생성
    await client.execute({
      sql: `INSERT INTO quizzes (id, type, category, question, options, difficulty, status)
            VALUES (?, 'knowledge', 'cat', '원본 질문', '[]', 1, 'active')`,
      args: [testId],
    });

    // 수정
    await client.execute({
      sql: `UPDATE quizzes SET question = ?, updated_at = datetime('now') WHERE id = ?`,
      args: ['수정된 질문', testId],
    });

    // 확인
    const result = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ?`,
      args: [testId],
    });
    assert(result.rows[0].question === '수정된 질문', '질문이 수정됨');

    // 정리
    await client.execute({
      sql: `DELETE FROM quizzes WHERE id = ?`,
      args: [testId],
    });
  });

  // ========== 5.6 DELETE (soft delete) 테스트 ==========
  await test('퀴즈 소프트 삭제', async () => {
    const testId = `test-delete-${Date.now()}`;

    // 생성
    await client.execute({
      sql: `INSERT INTO quizzes (id, type, category, question, options, difficulty, status)
            VALUES (?, 'knowledge', 'cat', '삭제 테스트', '[]', 1, 'active')`,
      args: [testId],
    });

    // Soft delete
    await client.execute({
      sql: `UPDATE quizzes SET status = 'hidden', updated_at = datetime('now') WHERE id = ?`,
      args: [testId],
    });

    // active 상태로 조회 시 없어야 함
    const activeResult = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ? AND status = 'active'`,
      args: [testId],
    });
    assert(activeResult.rows.length === 0, 'active 조회 시 없음');

    // hidden 상태로는 존재함
    const hiddenResult = await client.execute({
      sql: `SELECT * FROM quizzes WHERE id = ? AND status = 'hidden'`,
      args: [testId],
    });
    assert(hiddenResult.rows.length === 1, 'hidden 상태로 존재');

    // 완전 삭제 (정리)
    await client.execute({
      sql: `DELETE FROM quizzes WHERE id = ?`,
      args: [testId],
    });
  });

  // ========== 5.7 COUNT 테스트 ==========
  await test('퀴즈 개수 조회', async () => {
    const result = await client.execute(`SELECT COUNT(*) as count FROM quizzes WHERE status = 'active'`);
    assert(typeof result.rows[0].count === 'number', 'count가 숫자');
    assert(result.rows[0].count >= 3, `최소 3개 이상 (실제: ${result.rows[0].count})`);
  });

  await test('카테고리별 개수 조회', async () => {
    const result = await client.execute({
      sql: `SELECT COUNT(*) as count FROM quizzes WHERE status = 'active' AND category = ?`,
      args: ['cat'],
    });
    assert(typeof result.rows[0].count === 'number', 'count가 숫자');
    assert(result.rows[0].count >= 1, 'cat 카테고리 최소 1개');
  });

  // ========== 6. 통계 뷰 테스트 ==========
  await test('퀴즈 통계 뷰', async () => {
    const result = await client.execute(`SELECT * FROM v_quiz_stats`);
    assert(result.rows.length >= 1, `통계 뷰에 ${result.rows.length}개 행`);

    const stat = result.rows[0];
    assert(stat.id, 'id 필드 존재');
    assert(stat.attempt_count !== undefined, 'attempt_count 필드 존재');
    assert(stat.correct_rate !== undefined, 'correct_rate 필드 존재');
  });

  await test('투표 통계 뷰', async () => {
    const result = await client.execute(`SELECT * FROM v_poll_stats`);
    assert(result.rows.length >= 1, `통계 뷰에 ${result.rows.length}개 행`);

    const stat = result.rows[0];
    assert(stat.vote_count !== undefined, 'vote_count 필드 존재');
    assert(stat.like_count !== undefined, 'like_count 필드 존재');
  });

  // ========== 결과 출력 ==========
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 테스트 결과: ${passed} passed, ${failed} failed\n`);

  await client.close();

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
