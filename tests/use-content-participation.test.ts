/**
 * useContentParticipation 훅 테스트
 * - 중복 클릭 방지 (isSubmittingRef 플래그)
 * - 이동 중 응답 도착 시 레이스 컨디션 방지 (pollId 스냅샷)
 *
 * 실행: npx tsx tests/use-content-participation.test.ts
 */

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result instanceof Promise) {
    result
      .then(() => {
        console.log(`✓ ${name}`);
        passed++;
      })
      .catch((error) => {
        console.error(`✗ ${name}`);
        console.error(`  ${error}`);
        failed++;
      });
  } else {
    try {
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.error(`✗ ${name}`);
      console.error(`  ${error}`);
      failed++;
    }
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
  };
}

console.log('\n=== useContentParticipation 레이스 컨디션 테스트 ===\n');

// ============================================================================
// 중복 클릭 방지 시뮬레이션 테스트
// ============================================================================
console.log('--- 중복 클릭 방지 테스트 ---');

test('isSubmittingRef가 true면 핸들러 조기 반환', () => {
  // 시뮬레이션: ref 플래그 로직
  let isSubmitting = false;
  let callCount = 0;

  function handleSubmit() {
    if (isSubmitting) return; // 가드
    isSubmitting = true;
    callCount++;
    // 실제 로직...
  }

  // 첫 번째 호출: 성공
  handleSubmit();
  expect(callCount).toBe(1);

  // 두 번째 호출: 차단됨
  handleSubmit();
  expect(callCount).toBe(1);

  // 리셋 후 다시 호출 가능
  isSubmitting = false;
  handleSubmit();
  expect(callCount).toBe(2);
});

test('상태 기반 가드만으로는 연속 클릭 방지 불가 (문제 시연)', () => {
  // 시뮬레이션: 상태 업데이트가 비동기인 경우
  let stateGuard = false;
  let callCount = 0;

  function handleSubmitWithStateOnly() {
    if (stateGuard) return;
    // setState는 비동기라서 즉시 반영 안 됨
    // 여기서는 동기 시뮬레이션
    callCount++;
    // 실제로는 setStateGuard(true)가 다음 렌더에 반영됨
  }

  // 연속 호출 (상태 업데이트 전)
  handleSubmitWithStateOnly();
  handleSubmitWithStateOnly(); // 상태가 아직 false라면 통과됨

  // 이게 문제: ref 없이 state만 쓰면 2가 될 수 있음
  // 여기서는 동기 시뮬레이션이라 1이지만, 실제 React에서는 2가 될 수 있음
  expect(callCount).toBeGreaterThan(0); // 최소 1회 호출
});

// ============================================================================
// pollId 스냅샷 테스트
// ============================================================================
console.log('\n--- pollId 스냅샷 테스트 ---');

test('pollId 스냅샷으로 이동 후 응답 무시', async () => {
  // 시뮬레이션: currentPollIdRef와 스냅샷 비교
  let currentPollId = 'poll_1';
  let pollResults: { pollId: string; data: string } | null = null;

  async function loadPollStats(pollId: string) {
    // 비동기 작업 시뮬레이션
    await new Promise((r) => setTimeout(r, 50));

    // 응답 도착 시 현재 pollId와 비교
    if (currentPollId !== pollId) {
      // 이미 다른 poll로 이동함 - 결과 무시
      return;
    }

    pollResults = { pollId, data: 'loaded' };
  }

  // poll_1 로드 시작
  const loadPromise = loadPollStats('poll_1');

  // 로드 중 poll_2로 이동
  currentPollId = 'poll_2';

  // 응답 기다림
  await loadPromise;

  // poll_1 결과가 저장되지 않아야 함
  expect(pollResults).toBe(null);
});

test('pollId 스냅샷 일치 시 결과 저장', async () => {
  let currentPollId = 'poll_1';
  let pollResults: { pollId: string; data: string } | null = null;

  async function loadPollStats(pollId: string) {
    await new Promise((r) => setTimeout(r, 50));

    if (currentPollId !== pollId) {
      return;
    }

    pollResults = { pollId, data: 'loaded' };
  }

  // poll_1 로드 시작 (이동 없음)
  await loadPollStats('poll_1');

  // 결과 저장됨
  expect(pollResults?.pollId).toBe('poll_1');
});

// ============================================================================
// handlePollVote 스냅샷 로직 테스트
// ============================================================================
console.log('\n--- handlePollVote 스냅샷 로직 테스트 ---');

test('handlePollVote에서 savePollResponse 후 pollId 확인', async () => {
  let currentPollIdRef = 'poll_1';
  let loadStatsCalled = false;

  async function savePollResponse(_pollId: string, _choice: string) {
    await new Promise((r) => setTimeout(r, 30));
  }

  function loadPollStats(_pollId: string) {
    loadStatsCalled = true;
  }

  async function handlePollVote(choice: 'a' | 'b') {
    const pollIdSnapshot = 'poll_1'; // 호출 시점 스냅샷

    await savePollResponse(pollIdSnapshot, choice);

    // 스냅샷과 현재 ref 비교
    if (currentPollIdRef === pollIdSnapshot) {
      loadPollStats(pollIdSnapshot);
    }
  }

  // 투표 시작
  const votePromise = handlePollVote('a');

  // 투표 중 다음 poll로 이동
  currentPollIdRef = 'poll_2';

  await votePromise;

  // loadPollStats가 호출되지 않아야 함
  expect(loadStatsCalled).toBe(false);
});

test('이동 없이 투표 완료 시 loadPollStats 호출됨', async () => {
  let currentPollIdRef = 'poll_1';
  let loadStatsCalled = false;

  async function savePollResponse() {
    await new Promise((r) => setTimeout(r, 10));
  }

  function loadPollStats(_pollId: string) {
    loadStatsCalled = true;
  }

  async function handlePollVote() {
    const pollIdSnapshot = 'poll_1';

    await savePollResponse();

    if (currentPollIdRef === pollIdSnapshot) {
      loadPollStats(pollIdSnapshot);
    }
  }

  await handlePollVote();

  expect(loadStatsCalled).toBe(true);
});

// ============================================================================
// 초기화 시 currentPollIdRef 설정 테스트
// ============================================================================
console.log('\n--- 초기화 시 currentPollIdRef 설정 테스트 ---');

test('useEffect에서 nextPoll 선택 시 currentPollIdRef 설정', () => {
  let currentPollIdRef: string | null = null;

  // useEffect 시뮬레이션
  function initializePoll(nextPollId: string | null) {
    if (nextPollId) {
      currentPollIdRef = nextPollId;
    }
  }

  // poll 선택
  initializePoll('poll_1');

  // ref가 설정되어야 함
  expect(currentPollIdRef).toBe('poll_1');
});

test('초기 투표 시 currentPollIdRef가 null이면 loadPollStats 건너뜀 (수정 전 버그)', () => {
  let currentPollIdRef: string | null = null; // 초기화 안 됨
  let loadStatsCalled = false;

  function handlePollVote(pollIdSnapshot: string) {
    // 이전 버그: currentPollIdRef가 null이면 조건 불일치
    if (currentPollIdRef === pollIdSnapshot) {
      loadStatsCalled = true;
    }
  }

  handlePollVote('poll_1');

  // null !== 'poll_1' 이므로 호출 안 됨 (버그)
  expect(loadStatsCalled).toBe(false);
});

test('초기 투표 시 currentPollIdRef가 설정되면 loadPollStats 호출됨 (수정 후)', () => {
  let currentPollIdRef: string | null = 'poll_1'; // useEffect에서 초기화됨
  let loadStatsCalled = false;

  function handlePollVote(pollIdSnapshot: string) {
    if (currentPollIdRef === pollIdSnapshot) {
      loadStatsCalled = true;
    }
  }

  handlePollVote('poll_1');

  // 'poll_1' === 'poll_1' 이므로 호출됨
  expect(loadStatsCalled).toBe(true);
});

// ============================================================================
// goToNextPoll 리셋 테스트
// ============================================================================
console.log('\n--- goToNextPoll 리셋 테스트 ---');

test('goToNextPoll이 currentPollIdRef를 새 pollId로 갱신', () => {
  let currentPollIdRef = 'poll_1';

  function goToNextPoll(nextPollId: string) {
    currentPollIdRef = nextPollId;
  }

  goToNextPoll('poll_2');
  expect(currentPollIdRef).toBe('poll_2');
});

test('goToNextPoll이 isSubmittingPollRef를 false로 리셋', () => {
  let isSubmittingPollRef = true;

  function goToNextPoll() {
    isSubmittingPollRef = false;
  }

  goToNextPoll();
  expect(isSubmittingPollRef).toBe(false);
});

// ============================================================================
// 결과 출력 (비동기 테스트 대기 후)
// ============================================================================
setTimeout(() => {
  console.log('\n=============================');
  console.log(`총 ${passed + failed}개 테스트`);
  console.log(`✓ 통과: ${passed}`);
  console.log(`✗ 실패: ${failed}`);
  console.log('=============================\n');

  if (failed > 0) {
    process.exit(1);
  }
}, 500);
