/**
 * InsightService 테스트
 *
 * 실행: npx tsx tests/insight-service-test.ts
 */

import { INSIGHT_UNLOCK } from '../src/data/gamification/points';

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
// 1. 해금 조건 검증
// ============================================================================

section('1. INSIGHT_UNLOCK 조건 검증');

assertEqual(INSIGHT_UNLOCK.STAGE_1.tests, 1, 'Stage 1: 테스트 1개');
assertEqual(INSIGHT_UNLOCK.STAGE_2.tests, 3, 'Stage 2: 테스트 3개');
assertEqual(INSIGHT_UNLOCK.STAGE_3.polls, 10, 'Stage 3: 투표 10개');
assertEqual(INSIGHT_UNLOCK.STAGE_4.activities, 15, 'Stage 4: 활동 15개');
assertEqual(INSIGHT_UNLOCK.STAGE_5.relationshipActivities, 10, 'Stage 5: 관계 활동 10개');
assertEqual(INSIGHT_UNLOCK.STAGE_6.activities, 30, 'Stage 6: 활동 30개');
assert(INSIGHT_UNLOCK.STAGE_7.paid === true, 'Stage 7: 유료');

// ============================================================================
// 2. 해금 로직 시뮬레이션
// ============================================================================

section('2. 해금 로직 시뮬레이션');

interface MockStats {
  testCount: number;
  pollCount: number;
  totalActivities: number;
  relationshipActivities: number;
}

function shouldUnlock(stage: number, stats: MockStats): boolean {
  switch (stage) {
    case 1:
      return stats.testCount >= INSIGHT_UNLOCK.STAGE_1.tests;
    case 2:
      return stats.testCount >= INSIGHT_UNLOCK.STAGE_2.tests;
    case 3:
      return stats.pollCount >= INSIGHT_UNLOCK.STAGE_3.polls;
    case 4:
      return stats.totalActivities >= INSIGHT_UNLOCK.STAGE_4.activities;
    case 5:
      return stats.relationshipActivities >= INSIGHT_UNLOCK.STAGE_5.relationshipActivities;
    case 6:
      return stats.totalActivities >= INSIGHT_UNLOCK.STAGE_6.activities;
    default:
      return false;
  }
}

// 신규 사용자 (활동 없음)
const newUser: MockStats = {
  testCount: 0,
  pollCount: 0,
  totalActivities: 0,
  relationshipActivities: 0,
};

assert(!shouldUnlock(1, newUser), '신규 사용자: Stage 1 미해금');
assert(!shouldUnlock(2, newUser), '신규 사용자: Stage 2 미해금');

// 테스트 1개 완료
const afterTest1: MockStats = {
  testCount: 1,
  pollCount: 0,
  totalActivities: 1,
  relationshipActivities: 0,
};

assert(shouldUnlock(1, afterTest1), '테스트 1개 완료: Stage 1 해금');
assert(!shouldUnlock(2, afterTest1), '테스트 1개 완료: Stage 2 미해금');

// 테스트 3개 완료
const afterTest3: MockStats = {
  testCount: 3,
  pollCount: 0,
  totalActivities: 3,
  relationshipActivities: 0,
};

assert(shouldUnlock(1, afterTest3), '테스트 3개 완료: Stage 1 해금');
assert(shouldUnlock(2, afterTest3), '테스트 3개 완료: Stage 2 해금');
assert(!shouldUnlock(3, afterTest3), '테스트 3개 완료: Stage 3 미해금');

// 투표 10개 완료
const afterPoll10: MockStats = {
  testCount: 3,
  pollCount: 10,
  totalActivities: 13,
  relationshipActivities: 0,
};

assert(shouldUnlock(3, afterPoll10), '투표 10개 완료: Stage 3 해금');
assert(!shouldUnlock(4, afterPoll10), '활동 13개: Stage 4 미해금');

// 활동 15개 완료
const afterActivity15: MockStats = {
  testCount: 3,
  pollCount: 12,
  totalActivities: 15,
  relationshipActivities: 0,
};

assert(shouldUnlock(4, afterActivity15), '활동 15개: Stage 4 해금');
assert(!shouldUnlock(5, afterActivity15), '관계 활동 0: Stage 5 미해금');

// 관계 활동 10개 (idealType + conflictStyle)
const afterRelation10: MockStats = {
  testCount: 5,
  pollCount: 15,
  totalActivities: 25,
  relationshipActivities: 10,
};

assert(shouldUnlock(5, afterRelation10), '관계 활동 10개: Stage 5 해금');
assert(!shouldUnlock(6, afterRelation10), '활동 25개: Stage 6 미해금');

// 활동 30개 완료
const afterActivity30: MockStats = {
  testCount: 6,
  pollCount: 20,
  totalActivities: 30,
  relationshipActivities: 12,
};

assert(shouldUnlock(6, afterActivity30), '활동 30개: Stage 6 해금');

// ============================================================================
// 3. 진행률 계산 시뮬레이션
// ============================================================================

section('3. 진행률 계산');

function calculateProgress(current: number, required: number): number {
  return Math.min(100, Math.round((current / required) * 100));
}

assertEqual(
  calculateProgress(0, INSIGHT_UNLOCK.STAGE_1.tests),
  0,
  '테스트 0개: 0% 진행'
);

assertEqual(
  calculateProgress(1, INSIGHT_UNLOCK.STAGE_2.tests),
  33,
  '테스트 1/3개: 33% 진행'
);

assertEqual(
  calculateProgress(5, INSIGHT_UNLOCK.STAGE_3.polls),
  50,
  '투표 5/10개: 50% 진행'
);

assertEqual(
  calculateProgress(10, INSIGHT_UNLOCK.STAGE_4.activities),
  67,
  '활동 10/15개: 67% 진행'
);

assertEqual(
  calculateProgress(30, INSIGHT_UNLOCK.STAGE_6.activities),
  100,
  '활동 30/30개: 100% 진행'
);

// 초과 시 100% 제한
assertEqual(
  calculateProgress(50, INSIGHT_UNLOCK.STAGE_6.activities),
  100,
  '활동 50/30개: 100% (초과해도 100%)'
);

// ============================================================================
// 4. 레벨 계산 로직
// ============================================================================

section('4. 레벨 계산 로직');

function getLevel(scorePercent: number): 'high' | 'medium' | 'low' {
  if (scorePercent >= 60) return 'high';
  if (scorePercent >= 40) return 'medium';
  return 'low';
}

assertEqual(getLevel(80), 'high', '80% = HIGH');
assertEqual(getLevel(60), 'high', '60% = HIGH (경계)');
assertEqual(getLevel(59), 'medium', '59% = MEDIUM');
assertEqual(getLevel(50), 'medium', '50% = MEDIUM');
assertEqual(getLevel(40), 'medium', '40% = MEDIUM (경계)');
assertEqual(getLevel(39), 'low', '39% = LOW');
assertEqual(getLevel(20), 'low', '20% = LOW');
assertEqual(getLevel(0), 'low', '0% = LOW');

// ============================================================================
// 5. 태그 집계 시뮬레이션
// ============================================================================

section('5. 태그 집계 시뮬레이션');

interface TagCount {
  tag: string;
  count: number;
}

function getTopTags(tagCounts: Record<string, number>, limit: number): TagCount[] {
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

const sampleTagCounts = {
  'extroverted': 5,
  'introverted': 2,
  'planned': 4,
  'spontaneous': 3,
  'emotional': 6,
  'logical': 1,
};

const top3 = getTopTags(sampleTagCounts, 3);
assertEqual(top3[0].tag, 'emotional', '1등: emotional (6회)');
assertEqual(top3[1].tag, 'extroverted', '2등: extroverted (5회)');
assertEqual(top3[2].tag, 'planned', '3등: planned (4회)');

// ============================================================================
// 6. 인사이트 타입 검증
// ============================================================================

section('6. Stage1Insight 구조 검증');

interface Stage1Insight {
  stage: 1;
  title: string;
  testResults: Array<{
    testId: string;
    resultName: string;
    dimensions: Record<string, { score: number; level: 'high' | 'medium' | 'low' }>;
    tags: string[];
  }>;
  dominantTags: Array<{ tag: string; count: number; percentage: number }>;
  generatedAt: string;
}

// 샘플 인사이트 생성
const sampleInsight: Stage1Insight = {
  stage: 1,
  title: '기본 성향',
  testResults: [
    {
      testId: 'human',
      resultName: '열정 리더형',
      dimensions: {
        inssa: { score: 13, level: 'high' },
        adventure: { score: 11, level: 'high' },
        empathy: { score: 9, level: 'medium' },
        plan: { score: 7, level: 'medium' },
        mental: { score: 12, level: 'high' },
      },
      tags: ['extroverted', 'adventurous', 'resilient'],
    },
  ],
  dominantTags: [
    { tag: 'extroverted', count: 3, percentage: 30 },
    { tag: 'adventurous', count: 2, percentage: 20 },
  ],
  generatedAt: new Date().toISOString(),
};

assertEqual(sampleInsight.stage, 1, 'Stage 1 인사이트');
assertEqual(sampleInsight.title, '기본 성향', '제목: 기본 성향');
assert(sampleInsight.testResults.length > 0, '테스트 결과 포함');
assert(sampleInsight.testResults[0].tags.length > 0, '태그 포함');
assert(sampleInsight.dominantTags.length > 0, '상위 태그 포함');

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`📊 테스트 결과: ${passCount} 통과, ${failCount} 실패`);
console.log('═'.repeat(50));

if (failCount > 0) {
  process.exit(1);
}
