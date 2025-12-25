/**
 * Content API 엔드포인트 테스트
 *
 * 사용법:
 * 1. npm run dev (다른 터미널에서)
 * 2. node scripts/test-content-api.mjs
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_SECRET = process.env.CONTENT_API_SECRET || 'test-secret';

let passed = 0;
let failed = 0;

// 인증 헤더 (관리자 API용)
const authHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_SECRET}`,
};

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

async function fetchJson(url) {
  const res = await fetch(url);
  return { status: res.status, data: await res.json() };
}

// ============================================================================
// 테스트 실행
// ============================================================================

async function runTests() {
  console.log(`\n🧪 Content API 테스트 (${BASE_URL})\n`);
  console.log('='.repeat(50));

  // 서버 연결 확인
  try {
    await fetch(BASE_URL);
    console.log('✅ 서버 연결 성공\n');
  } catch (error) {
    console.error('❌ 서버에 연결할 수 없습니다. npm run dev 실행했는지 확인하세요.');
    process.exit(1);
  }

  // ========== 1. 퀴즈 API 테스트 ==========
  await test('GET /api/content?type=quiz - 퀴즈 목록', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz`);
    assert(status === 200, 'HTTP 200');
    assert(data.type === 'quiz', 'type이 quiz');
    assert(Array.isArray(data.items), 'items가 배열');
    assert(data.items.length >= 1, `퀴즈 ${data.items.length}개`);
    assert(data.count === data.items.length, 'count 일치');
  });

  await test('GET /api/content?type=quiz&category=cat - 카테고리 필터', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz&category=cat`);
    assert(status === 200, 'HTTP 200');
    assert(data.category === 'cat', 'category가 cat');
    assert(data.items.every(q => q.category === 'cat'), '모든 퀴즈가 cat 카테고리');
  });

  await test('GET /api/content?type=quiz&id=cat-quiz-001 - 단일 조회', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz&id=cat-quiz-001`);
    assert(status === 200, 'HTTP 200');
    assert(data.content, 'content 존재');
    assert(data.content.id === 'cat-quiz-001', 'id 일치');
    assert(data.content.question, 'question 존재');
    assert(Array.isArray(data.content.options), 'options 배열');
  });

  await test('GET /api/content?type=quiz&id=nonexistent - 없는 ID', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz&id=nonexistent`);
    assert(status === 404, 'HTTP 404');
    assert(data.error, 'error 메시지 존재');
  });

  // ========== 2. 투표 API 테스트 ==========
  await test('GET /api/content?type=poll - 투표 목록', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=poll`);
    assert(status === 200, 'HTTP 200');
    assert(data.type === 'poll', 'type이 poll');
    assert(data.items.length >= 1, `투표 ${data.items.length}개`);
  });

  await test('GET /api/content?type=poll&id=cat-poll-001 - 단일 조회', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=poll&id=cat-poll-001`);
    assert(status === 200, 'HTTP 200');
    assert(data.content.type === 'vs', 'type이 vs');
    assert(data.content.options.length === 2, 'VS는 옵션 2개');
  });

  // ========== 3. 시나리오 API 테스트 ==========
  await test('GET /api/content?type=scenario - 시나리오 목록', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=scenario`);
    assert(status === 200, 'HTTP 200');
    assert(data.type === 'scenario', 'type이 scenario');
    assert(data.items.length >= 1, `시나리오 ${data.items.length}개`);
  });

  await test('GET /api/content?type=scenario&id=cat-scenario-butler', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=scenario&id=cat-scenario-butler`);
    assert(status === 200, 'HTTP 200');
    assert(data.content.title, 'title 존재');
    assert(Array.isArray(data.content.questions), 'questions 배열');
    assert(Array.isArray(data.content.results), 'results 배열');
  });

  // ========== 4. 토너먼트 API 테스트 ==========
  await test('GET /api/content?type=tournament - 토너먼트 목록', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=tournament`);
    assert(status === 200, 'HTTP 200');
    assert(data.type === 'tournament', 'type이 tournament');
    assert(data.items.length >= 1, `토너먼트 ${data.items.length}개`);
  });

  await test('GET /api/content?type=tournament&id=cat-breed-worldcup-v1', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=tournament&id=cat-breed-worldcup-v1`);
    assert(status === 200, 'HTTP 200');
    assert(data.content.roundSize === 16, 'roundSize 16');
    assert(Array.isArray(data.content.contestants), 'contestants 배열');
    assert(data.content.resultConfig, 'resultConfig 존재');
  });

  // ========== 5. 에러 케이스 테스트 ==========
  await test('GET /api/content - type 파라미터 없음', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content`);
    assert(status === 400, 'HTTP 400');
    assert(data.error.includes('type'), 'type 필수 에러');
  });

  await test('GET /api/content?type=invalid - 잘못된 type', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=invalid`);
    assert(status === 400, 'HTTP 400');
    assert(data.error, 'error 메시지 존재');
  });

  // ========== 6. 페이지네이션 테스트 ==========
  await test('GET /api/content?type=quiz&limit=2 - limit', async () => {
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz&limit=2`);
    assert(status === 200, 'HTTP 200');
    assert(data.items.length <= 2, `최대 2개 (실제: ${data.items.length})`);
    assert(typeof data.total === 'number', 'total 필드 존재');
    assert(data.total >= data.items.length, 'total >= items.length');
  });

  await test('GET /api/content?type=quiz&limit=1&offset=1 - offset', async () => {
    const all = await fetchJson(`${BASE_URL}/api/content?type=quiz&limit=10`);
    const second = await fetchJson(`${BASE_URL}/api/content?type=quiz&limit=1&offset=1`);

    assert(second.status === 200, 'HTTP 200');
    if (all.data.items.length >= 2) {
      assert(second.data.items[0]?.id === all.data.items[1]?.id, 'offset 적용됨');
    } else {
      assert(true, '데이터가 2개 미만이라 offset 테스트 스킵');
    }
  });

  // ========== 7. 인증 테스트 ==========
  await test('POST /api/content - 인증 없이 요청 시 401', async () => {
    const res = await fetch(`${BASE_URL}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Authorization 없음
      body: JSON.stringify({
        type: 'quiz',
        data: { id: 'test', type: 'knowledge', category: 'cat', question: '?', options: [], difficulty: 1 },
      }),
    });
    assert(res.status === 401, 'HTTP 401 (인증 필요)');
  });

  await test('PUT /api/content - 인증 없이 요청 시 401', async () => {
    const res = await fetch(`${BASE_URL}/api/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'quiz', id: 'test', data: {} }),
    });
    assert(res.status === 401, 'HTTP 401 (인증 필요)');
  });

  await test('DELETE /api/content - 인증 없이 요청 시 401', async () => {
    const res = await fetch(`${BASE_URL}/api/content?type=quiz&id=test`, { method: 'DELETE' });
    assert(res.status === 401, 'HTTP 401 (인증 필요)');
  });

  await test('POST /api/content - 잘못된 Bearer 토큰 시 401', async () => {
    const res = await fetch(`${BASE_URL}/api/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wrong-token-12345',
      },
      body: JSON.stringify({
        type: 'quiz',
        data: { id: 'test', type: 'knowledge', category: 'cat', question: '?', options: [], difficulty: 1 },
      }),
    });
    assert(res.status === 401, 'HTTP 401 (잘못된 토큰)');
  });

  // ========== 8. PUT (수정) 테스트 - 인증 포함 ==========
  await test('PUT /api/content - 퀴즈 수정 (인증)', async () => {
    const testId = `test-quiz-${Date.now()}`;

    // 먼저 생성 (인증 포함)
    const createRes = await fetch(`${BASE_URL}/api/content`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'quiz',
        data: {
          id: testId,
          type: 'knowledge',
          category: 'cat',
          question: '원본 질문',
          options: [{ id: 'a', text: '답', isCorrect: true }],
          difficulty: 1,
        },
      }),
    });
    assert(createRes.status === 200, '생성 성공');

    // 수정 (인증 포함)
    const updateRes = await fetch(`${BASE_URL}/api/content`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'quiz',
        id: testId,
        data: { question: '수정된 질문' },
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT HTTP 200');
    assert(updateData.success === true, 'success: true');

    // 수정 확인
    const { data: getData } = await fetchJson(`${BASE_URL}/api/content?type=quiz&id=${testId}`);
    assert(getData.content?.question === '수정된 질문', '질문이 수정됨');

    // 정리 (삭제, 인증 포함)
    await fetch(`${BASE_URL}/api/content?type=quiz&id=${testId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
  });

  await test('PUT /api/content - 필수 파라미터 누락', async () => {
    const res = await fetch(`${BASE_URL}/api/content`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ type: 'quiz' }),  // id, data 누락
    });
    assert(res.status === 400, 'HTTP 400');
  });

  // ========== 9. DELETE (삭제) 테스트 - 인증 포함 ==========
  await test('DELETE /api/content - 퀴즈 삭제 (인증)', async () => {
    const testId = `test-quiz-del-${Date.now()}`;

    // 생성 (인증 포함)
    await fetch(`${BASE_URL}/api/content`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'quiz',
        data: {
          id: testId,
          type: 'knowledge',
          category: 'cat',
          question: '삭제 테스트 질문',
          options: [{ id: 'a', text: '답', isCorrect: true }],
          difficulty: 1,
        },
      }),
    });

    // 삭제 (인증 포함)
    const deleteRes = await fetch(`${BASE_URL}/api/content?type=quiz&id=${testId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200, 'DELETE HTTP 200');
    assert(deleteData.success === true, 'success: true');

    // 삭제 후 조회 시 없어야 함 (soft delete - status가 hidden)
    const { status, data } = await fetchJson(`${BASE_URL}/api/content?type=quiz&id=${testId}`);
    assert(status === 404, '삭제 후 조회 시 404');
  });

  await test('DELETE /api/content - 필수 파라미터 누락', async () => {
    const res = await fetch(`${BASE_URL}/api/content?type=quiz`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(res.status === 400, 'HTTP 400 (id 누락)');
  });

  // ========== 결과 출력 ==========
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 테스트 결과: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
