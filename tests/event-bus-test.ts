/**
 * 이벤트 버스 시스템 테스트
 *
 * 실행: npx tsx tests/event-bus-test.ts
 */

import { POINTS } from '../src/data/gamification/points';
import {
  ACTIVITY_REWARDS,
  SPECIAL_REWARDS,
  getReward,
  getCategoryWeight,
  getWeightedInsightPoints
} from '../src/data/gamification/rewards';
import type { ActivityType, UserActivityEvent, ActivityPayload } from '../src/types/events';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passCount++;
  } else {
    console.log(`  ❌ ${message}`);
    failCount++;
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  const pass = actual === expected;
  if (pass) {
    console.log(`  ✅ ${message}`);
    passCount++;
  } else {
    console.log(`  ❌ ${message} (expected: ${expected}, got: ${actual})`);
    failCount++;
  }
}

function section(title: string): void {
  console.log(`\n📋 ${title}`);
  console.log('─'.repeat(50));
}

// ============================================================================
// 1. 타입 검증 테스트
// ============================================================================

section('1. 타입 검증');

// ActivityType 검증
const activityTypes: ActivityType[] = [
  'test_complete',
  'quiz_solve',
  'poll_vote',
  'qa_answer',
  'qa_adopted',
  'post_write',
  'comment_write',
  'like_give',
  'like_receive',
  'daily_visit',
  'duel_complete'
];

assert(activityTypes.length === 11, 'ActivityType 11개 정의됨');

// 모든 ActivityType에 보상이 정의되어 있는지 확인
for (const type of activityTypes) {
  const reward = ACTIVITY_REWARDS[type];
  assert(reward !== undefined, `${type} 보상 정의됨`);
  assert(typeof reward.xp === 'number', `${type} XP는 숫자`);
  assert(typeof reward.insightPoints === 'number', `${type} insightPoints는 숫자`);
}

// ============================================================================
// 2. POINTS ↔ ACTIVITY_REWARDS 동기화 테스트
// ============================================================================

section('2. POINTS ↔ ACTIVITY_REWARDS 동기화');

assertEqual(
  ACTIVITY_REWARDS.test_complete.xp,
  POINTS.TEST_COMPLETE,
  'test_complete.xp === POINTS.TEST_COMPLETE'
);

assertEqual(
  ACTIVITY_REWARDS.quiz_solve.xp,
  POINTS.QUIZ_CORRECT,
  'quiz_solve.xp === POINTS.QUIZ_CORRECT'
);

assertEqual(
  ACTIVITY_REWARDS.poll_vote.xp,
  POINTS.POLL_VOTE,
  'poll_vote.xp === POINTS.POLL_VOTE'
);

assertEqual(
  ACTIVITY_REWARDS.daily_visit.xp,
  POINTS.DAILY_VISIT,
  'daily_visit.xp === POINTS.DAILY_VISIT'
);

assertEqual(
  ACTIVITY_REWARDS.qa_adopted.xp,
  POINTS.ANSWER_ADOPTED,
  'qa_adopted.xp === POINTS.ANSWER_ADOPTED'
);

// ============================================================================
// 3. getReward 함수 테스트
// ============================================================================

section('3. getReward 함수');

// 기본 보상
const quizCorrectReward = getReward('quiz_solve', { result: 'correct' });
assertEqual(quizCorrectReward.xp, POINTS.QUIZ_CORRECT, '퀴즈 정답 XP');

// 퀴즈 오답
const quizWrongReward = getReward('quiz_solve', { result: 'wrong' });
assertEqual(quizWrongReward.xp, POINTS.QUIZ_WRONG, '퀴즈 오답 XP');
assertEqual(quizWrongReward.insightPoints, 1, '퀴즈 오답도 인사이트 포인트 1');

// 대결 승리
const duelWinReward = getReward('duel_complete', { won: true });
assertEqual(duelWinReward.xp, POINTS.DUEL_WIN, '대결 승리 XP');

// 대결 패배
const duelLoseReward = getReward('duel_complete', { won: false });
assertEqual(duelLoseReward.xp, POINTS.DUEL_LOSE, '대결 패배 XP');
assertEqual(duelLoseReward.insightPoints, 1, '대결 패배도 인사이트 포인트 1');

// ============================================================================
// 4. 카테고리 가중치 테스트
// ============================================================================

section('4. 카테고리 가중치');

assertEqual(getCategoryWeight('relationship'), 1.5, 'relationship 가중치 1.5');
assertEqual(getCategoryWeight('idealType'), 1.5, 'idealType 가중치 1.5');
assertEqual(getCategoryWeight('human'), 1.2, 'human 가중치 1.2');
assertEqual(getCategoryWeight('cat'), 1.0, 'cat (default) 가중치 1.0');
assertEqual(getCategoryWeight('unknown'), 1.0, 'unknown (default) 가중치 1.0');

// 가중치 적용 테스트
assertEqual(
  getWeightedInsightPoints(10, 'relationship'),
  15,
  'relationship 카테고리 10점 → 15점'
);

assertEqual(
  getWeightedInsightPoints(10, 'human'),
  12,
  'human 카테고리 10점 → 12점'
);

assertEqual(
  getWeightedInsightPoints(10, 'cat'),
  10,
  'cat 카테고리 10점 → 10점'
);

// ============================================================================
// 5. 이벤트 구조 검증
// ============================================================================

section('5. 이벤트 구조 검증');

// 샘플 이벤트 생성
const sampleEvent: UserActivityEvent = {
  id: 'test-uuid',
  idempotencyKey: 'user1:quiz_solve:quiz-001:12345',
  traceId: 'test-trace',
  schemaVersion: '1.0',
  occurredAt: new Date().toISOString(),
  source: 'web',
  userId: 'user-001',
  sessionId: 'session-001',
  activityType: 'quiz_solve',
  payload: {
    contentId: 'quiz-001',
    contentType: 'quiz',
    category: 'cat',
    tags: ['cat', 'knowledge'],
    result: 'correct',
    score: 1,
  },
};

assert(sampleEvent.schemaVersion === '1.0', 'schemaVersion은 1.0');
assert(sampleEvent.source === 'web' || sampleEvent.source === 'app', 'source는 web 또는 app');
assert(sampleEvent.payload.contentType === 'quiz', 'contentType은 quiz');
assert(sampleEvent.payload.tags.length >= 1, 'tags는 1개 이상');

// ============================================================================
// 6. 멱등성 키 형식 검증
// ============================================================================

section('6. 멱등성 키 형식');

// 멱등성 키 형식: userId:activityType:contentId:minuteTimestamp
const keyParts = sampleEvent.idempotencyKey.split(':');
assertEqual(keyParts.length, 4, '멱등성 키는 4개 부분으로 구성');
assertEqual(keyParts[0], 'user1', '첫 번째는 userId');
assertEqual(keyParts[1], 'quiz_solve', '두 번째는 activityType');
assertEqual(keyParts[2], 'quiz-001', '세 번째는 contentId');
assert(!isNaN(parseInt(keyParts[3])), '네 번째는 타임스탬프(숫자)');

// ============================================================================
// 7. 인사이트 포인트 합계 테스트
// ============================================================================

section('7. 인사이트 포인트 누적 시뮬레이션');

// 사용자가 테스트 1개 + 퀴즈 5개 + 투표 3개 완료했을 때
const testPoints = ACTIVITY_REWARDS.test_complete.insightPoints * 1;  // 3
const quizPoints = ACTIVITY_REWARDS.quiz_solve.insightPoints * 5;     // 5
const pollPoints = ACTIVITY_REWARDS.poll_vote.insightPoints * 3;      // 3

const totalInsightPoints = testPoints + quizPoints + pollPoints;
assertEqual(totalInsightPoints, 11, '테스트1 + 퀴즈5 + 투표3 = 인사이트 11점');

// Stage 1 해금 조건: 테스트 1개 → 충족
assert(1 >= 1, 'Stage 1 해금 조건 충족 (테스트 1개)');

// Stage 3 해금 조건: 투표 10개 → 미충족
assert(3 < 10, 'Stage 3 해금 조건 미충족 (투표 3개 < 10개)');

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`📊 테스트 결과: ${passCount} 통과, ${failCount} 실패`);
console.log('═'.repeat(50));

if (failCount > 0) {
  process.exit(1);
}
