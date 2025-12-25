/**
 * Poll API 테스트 스크립트
 *
 * 테스트 항목:
 * 1. optionId 검증 - pollId prefix 기반 타입 추론
 * 2. Choice Poll 퍼센트 계산 - Largest Remainder Method
 * 3. VS Poll 퍼센트 계산
 *
 * 실행: node scripts/test-poll-api.mjs
 */

console.log('='.repeat(60));
console.log('Poll API 로직 테스트');
console.log('='.repeat(60));

// ============================================================================
// 테스트 0: 필수 필드 검증 (회귀 테스트)
// ============================================================================
console.log('\n[테스트 0] 필수 필드 검증 - pollId/deviceId 타입 체크\n');

function validateRequiredFields(deviceId, pollId) {
  // 필수 필드 체크 + 타입 검증
  if (!deviceId || !pollId || typeof pollId !== 'string') {
    return { success: false, error: 'Missing required fields: deviceId, pollId (string)', status: 400 };
  }
  return { success: true };
}

const requiredFieldTests = [
  { name: 'pollId 누락', deviceId: 'user-1', pollId: undefined, expected: false },
  { name: 'pollId null', deviceId: 'user-1', pollId: null, expected: false },
  { name: 'pollId 빈 문자열', deviceId: 'user-1', pollId: '', expected: false },
  { name: 'pollId 숫자 (truthy but not string)', deviceId: 'user-1', pollId: 123, expected: false },
  { name: 'pollId 객체 (truthy but not string)', deviceId: 'user-1', pollId: { id: 'x' }, expected: false },
  { name: 'deviceId 누락', deviceId: undefined, pollId: 'vs-test-001', expected: false },
  { name: '정상 케이스', deviceId: 'user-1', pollId: 'vs-test-001', expected: true },
  { name: 'Choice Poll 정상', deviceId: 'user-1', pollId: 'choice-test-001', expected: true },
];

let passed = 0;
let failed = 0;

requiredFieldTests.forEach(({ name, deviceId, pollId, expected }) => {
  const result = validateRequiredFields(deviceId, pollId);
  const isPass = result.success === expected;
  const status = isPass ? '✅' : '❌';

  if (isPass) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status} ${name}: pollId=${JSON.stringify(pollId)} → success=${result.success} (expected: ${expected})`);
});

console.log(`\n결과: ${passed}/${passed + failed} 통과`);

// ============================================================================
// 테스트 1: optionId 검증 로직
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('[테스트 1] optionId 검증 - pollId prefix 기반 타입 추론\n');

function validateOptionId(pollId, optionId) {
  const validVsOptions = ['a', 'b'];
  const validChoiceOptions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const isChoicePoll = pollId.startsWith('choice-');
  const validOptions = isChoicePoll ? validChoiceOptions : validVsOptions;

  return {
    isValid: validOptions.includes(optionId),
    pollType: isChoicePoll ? 'choice' : 'vs',
    validOptions,
  };
}

const validationTests = [
  { pollId: 'choice-fortune-001', optionId: 'a', expected: true },
  { pollId: 'choice-fortune-001', optionId: 'e', expected: true },
  { pollId: 'choice-fortune-001', optionId: 'h', expected: true },
  { pollId: 'choice-fortune-001', optionId: 'i', expected: false },  // 범위 초과
  { pollId: 'vs-cat-001', optionId: 'a', expected: true },
  { pollId: 'vs-cat-001', optionId: 'b', expected: true },
  { pollId: 'vs-cat-001', optionId: 'c', expected: false },  // VS는 a/b만
  { pollId: 'user-123456', optionId: 'a', expected: true },  // user-* = VS
  { pollId: 'user-123456', optionId: 'c', expected: false },
];

passed = 0;
failed = 0;

validationTests.forEach(({ pollId, optionId, expected }) => {
  const result = validateOptionId(pollId, optionId);
  const status = result.isValid === expected ? '✅' : '❌';

  if (result.isValid === expected) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status} pollId="${pollId}", optionId="${optionId}" → ${result.pollType}, valid=${result.isValid} (expected: ${expected})`);
});

console.log(`\n결과: ${passed}/${passed + failed} 통과`);

// ============================================================================
// 테스트 2: Largest Remainder Method 퍼센트 계산
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('[테스트 2] Choice Poll 퍼센트 계산 - Largest Remainder Method\n');

function calculatePercentages(votes, optionCount = 5) {
  const allOptionIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].slice(0, optionCount);
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  if (totalVotes === 0) {
    return allOptionIds.map(id => ({ optionId: id, count: 0, percentage: 0 }));
  }

  // 1단계: raw 퍼센트 계산
  const rawPercentages = allOptionIds.map(optionId => {
    const count = votes[optionId] ?? 0;
    return {
      optionId,
      count,
      raw: (count / totalVotes) * 100,
    };
  });

  // 2단계: floor 적용
  const floored = rawPercentages.map(p => ({
    ...p,
    percentage: Math.floor(p.raw),
    remainder: p.raw - Math.floor(p.raw),
  }));

  // 3단계: 부족분 계산
  const floorSum = floored.reduce((sum, p) => sum + p.percentage, 0);
  const shortage = 100 - floorSum;

  // 4단계: remainder 큰 순서대로 +1
  const sortedByRemainder = floored
    .map((p, idx) => ({ ...p, originalIdx: idx }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < shortage; i++) {
    sortedByRemainder[i].percentage += 1;
  }

  // 원래 순서로 복원
  sortedByRemainder.sort((a, b) => a.originalIdx - b.originalIdx);

  return sortedByRemainder.map(p => ({
    optionId: p.optionId,
    count: p.count,
    percentage: p.percentage,
  }));
}

const percentTests = [
  {
    name: '리뷰어 지적 케이스: 1/1/4/0 (4옵션)',
    votes: { a: 1, b: 1, c: 4, d: 0 },
    optionCount: 4,
    // 기존 방식: 17+17+67+0 = 101% (오류)
    // Largest Remainder: 17+17+66+0 = 100% (정확)
    expectedSum: 100,
  },
  {
    name: '균등 분할: 1/1/1 (3옵션)',
    votes: { a: 1, b: 1, c: 1 },
    optionCount: 3,
    // 33.33...% each → floor(33)*3 = 99, shortage = 1
    expectedSum: 100,
  },
  {
    name: '극단적 케이스: 1/1/1/1/1 (5옵션)',
    votes: { a: 1, b: 1, c: 1, d: 1, e: 1 },
    optionCount: 5,
    // 20% each → 정확히 100%
    expectedSum: 100,
  },
  {
    name: '불균형: 99/1 (2옵션)',
    votes: { a: 99, b: 1 },
    optionCount: 2,
    expectedSum: 100,
  },
  {
    name: '0표: 전부 0 (5옵션)',
    votes: { a: 0, b: 0, c: 0, d: 0, e: 0 },
    optionCount: 5,
    expectedSum: 0,  // 0표면 합계도 0
  },
];

passed = 0;
failed = 0;

percentTests.forEach(({ name, votes, optionCount, expectedSum }) => {
  const result = calculatePercentages(votes, optionCount);
  const sum = result.reduce((s, o) => s + o.percentage, 0);
  const status = sum === expectedSum ? '✅' : '❌';

  if (sum === expectedSum) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status} ${name}`);
  console.log(`   입력: ${JSON.stringify(votes)}`);
  console.log(`   결과: ${result.map(o => `${o.optionId}=${o.percentage}%`).join(', ')}`);
  console.log(`   합계: ${sum}% (expected: ${expectedSum}%)`);
  console.log();
});

console.log(`결과: ${passed}/${passed + failed} 통과`);

// ============================================================================
// 테스트 3: VS Poll 퍼센트 (기존 로직 확인)
// ============================================================================
console.log('='.repeat(60));
console.log('[테스트 3] VS Poll 퍼센트 계산\n');

function calculateVsPercentages(aCount, bCount) {
  const totalVotes = aCount + bCount;
  const aPercent = totalVotes > 0 ? Math.round((aCount / totalVotes) * 100) : 50;
  const bPercent = totalVotes > 0 ? 100 - aPercent : 50;
  return { a: aPercent, b: bPercent, sum: aPercent + bPercent };
}

const vsTests = [
  { a: 50, b: 50, expectedSum: 100 },
  { a: 1, b: 2, expectedSum: 100 },  // 33% + 67%
  { a: 0, b: 0, expectedSum: 100 },  // 50% + 50%
  { a: 99, b: 1, expectedSum: 100 },
];

passed = 0;
failed = 0;

vsTests.forEach(({ a, b, expectedSum }) => {
  const result = calculateVsPercentages(a, b);
  const status = result.sum === expectedSum ? '✅' : '❌';

  if (result.sum === expectedSum) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status} a=${a}, b=${b} → ${result.a}% + ${result.b}% = ${result.sum}%`);
});

console.log(`\n결과: ${passed}/${passed + failed} 통과`);

// ============================================================================
// 테스트 4: 복수 선택 (allowMultiple) 로직
// ============================================================================
console.log('='.repeat(60));
console.log('[테스트 4] 복수 선택 (allowMultiple) 로직\n');

/**
 * 복수 선택 투표 처리 시뮬레이션
 * - DB 제약: UNIQUE(device_id, poll_id, option_id)
 * - allowMultiple=false: 기존 투표 있으면 거부
 * - allowMultiple=true: 같은 옵션만 중복 방지
 */

// 가상 DB 상태
let mockDb = [];

function simulateVote(deviceId, pollId, optionIds, allowMultiple = false) {
  const selectedOptions = Array.isArray(optionIds) ? optionIds : [optionIds];

  // 1. allowMultiple 아닌 경우: 기존 투표 확인
  if (!allowMultiple) {
    const existingVote = mockDb.find(v => v.deviceId === deviceId && v.pollId === pollId);
    if (existingVote) {
      return {
        success: false,
        error: 'Already voted',
        existingVote: existingVote.optionId,
      };
    }
  }

  // 2. 각 옵션별 투표 저장 (UNIQUE 제약 시뮬레이션)
  const savedOptions = [];
  for (const optionId of selectedOptions) {
    // 같은 (device, poll, option) 조합 확인
    const duplicate = mockDb.find(
      v => v.deviceId === deviceId && v.pollId === pollId && v.optionId === optionId
    );

    if (!duplicate) {
      mockDb.push({ deviceId, pollId, optionId, createdAt: new Date().toISOString() });
      savedOptions.push(optionId);
    }
    // 중복이면 무시 (ON CONFLICT DO NOTHING)
  }

  return {
    success: true,
    savedOptions,
    message: savedOptions.length > 0
      ? `Saved ${savedOptions.length} vote(s)`
      : 'All options already voted',
  };
}

function getUserVotes(deviceId, pollId) {
  return mockDb
    .filter(v => v.deviceId === deviceId && v.pollId === pollId)
    .map(v => v.optionId);
}

// allowMultiple=false + 복수 옵션 거부 검증 함수
function validateMultipleOptionsRejection(selectedOptions, allowMultiple) {
  // allowMultiple=false인데 복수 옵션을 보낸 경우 거부
  if (!allowMultiple && selectedOptions.length > 1) {
    return { success: false, error: 'Multiple options not allowed for this poll' };
  }
  return { success: true };
}

// 테스트 케이스
const multipleVoteTests = [
  {
    name: '단일 선택: 첫 투표 성공',
    setup: () => { mockDb = []; },
    action: () => simulateVote('user-1', 'choice-test-001', 'a', false),
    check: (result) => result.success === true && result.savedOptions.includes('a'),
  },
  {
    name: '단일 선택: 이미 투표한 사용자 거부',
    setup: () => { mockDb = [{ deviceId: 'user-1', pollId: 'choice-test-001', optionId: 'a' }]; },
    action: () => simulateVote('user-1', 'choice-test-001', 'b', false),
    check: (result) => result.success === false && result.error === 'Already voted',
  },
  {
    name: 'allowMultiple=false + optionIds 배열 거부 (High 이슈 수정)',
    setup: () => { mockDb = []; },
    action: () => validateMultipleOptionsRejection(['a', 'b', 'c'], false),
    check: (result) => result.success === false && result.error === 'Multiple options not allowed for this poll',
  },
  {
    name: 'allowMultiple=true + optionIds 배열 허용',
    setup: () => { mockDb = []; },
    action: () => validateMultipleOptionsRejection(['a', 'b', 'c'], true),
    check: (result) => result.success === true,
  },
  {
    name: 'allowMultiple=false + 단일 옵션 허용',
    setup: () => { mockDb = []; },
    action: () => validateMultipleOptionsRejection(['a'], false),
    check: (result) => result.success === true,
  },
  {
    name: '복수 선택: 여러 옵션 동시 저장',
    setup: () => { mockDb = []; },
    action: () => simulateVote('user-2', 'choice-multi-001', ['a', 'c', 'e'], true),
    check: (result) => result.success === true && result.savedOptions.length === 3,
  },
  {
    name: '복수 선택: 같은 옵션 중복 방지',
    setup: () => { mockDb = [{ deviceId: 'user-2', pollId: 'choice-multi-001', optionId: 'a' }]; },
    action: () => simulateVote('user-2', 'choice-multi-001', ['a', 'b'], true),
    check: (result) => result.success === true && result.savedOptions.length === 1 && result.savedOptions[0] === 'b',
  },
  {
    name: '복수 선택: 추가 투표 가능',
    setup: () => { mockDb = [{ deviceId: 'user-3', pollId: 'choice-multi-001', optionId: 'a' }]; },
    action: () => simulateVote('user-3', 'choice-multi-001', ['c'], true),
    check: (result) => {
      const votes = getUserVotes('user-3', 'choice-multi-001');
      return result.success === true && votes.length === 2 && votes.includes('a') && votes.includes('c');
    },
  },
  {
    name: 'userVotes 배열 반환 확인',
    setup: () => {
      mockDb = [
        { deviceId: 'user-4', pollId: 'choice-multi-001', optionId: 'a' },
        { deviceId: 'user-4', pollId: 'choice-multi-001', optionId: 'b' },
        { deviceId: 'user-4', pollId: 'choice-multi-001', optionId: 'd' },
      ];
    },
    action: () => getUserVotes('user-4', 'choice-multi-001'),
    check: (result) => result.length === 3 && result.includes('a') && result.includes('b') && result.includes('d'),
  },
];

passed = 0;
failed = 0;

multipleVoteTests.forEach(({ name, setup, action, check }) => {
  setup();
  const result = action();
  const isPass = check(result);
  const status = isPass ? '✅' : '❌';

  if (isPass) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status} ${name}`);
  console.log(`   결과: ${JSON.stringify(result)}`);
  console.log();
});

console.log(`결과: ${passed}/${passed + failed} 통과`);

// ============================================================================
// 최종 결과 요약
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('테스트 완료');
console.log('='.repeat(60));
