/**
 * InsightTags 유효성 검증 테스트
 *
 * VS 투표의 insightTags가 유효한 태그만 사용하는지 확인합니다.
 * 실행: npx tsx tests/insight-tags-validation.test.ts
 */

import { VS_POLLS } from '../src/data/content/polls/vs-polls';
import { LOVE_VS_POLLS } from '../src/data/content/polls/love-vs-polls';
import { VALID_INSIGHT_TAGS } from '../src/data/insight/insight-tags';
import type { InsightTags } from '../src/data/content/types';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passCount = 0;
let failCount = 0;
const errors: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    errors.push(message);
  }
}

function section(title: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'='.repeat(60)}`);
}

// ============================================================================
// InsightTags 검증 함수
// ============================================================================

function countTags(insightTags: InsightTags | undefined): number {
  if (!insightTags) return 0;
  let count = 0;
  if (insightTags.personality) count += insightTags.personality.length;
  if (insightTags.decision) count += insightTags.decision.length;
  if (insightTags.relationship) count += insightTags.relationship.length;
  if (insightTags.interest) count += insightTags.interest.length;
  if (insightTags.lifestyle) count += insightTags.lifestyle.length;
  return count;
}

function validateInsightTags(insightTags: InsightTags | undefined, pollId: string, option: string): string[] {
  const invalidTags: string[] = [];
  if (!insightTags) return invalidTags;

  const allTags = [
    ...(insightTags.personality || []),
    ...(insightTags.decision || []),
    ...(insightTags.relationship || []),
    ...(insightTags.interest || []),
    ...(insightTags.lifestyle || []),
  ];

  for (const tag of allTags) {
    if (!VALID_INSIGHT_TAGS.has(tag)) {
      invalidTags.push(`${pollId} ${option}: 유효하지 않은 태그 '${tag}'`);
    }
  }

  return invalidTags;
}

// ============================================================================
// 테스트 실행
// ============================================================================

section('1. VS_POLLS 태그 유효성 검증');

let vsPollsWithTags = 0;
let vsPollsMinTagWarnings = 0;
const vsInvalidTags: string[] = [];

for (const poll of VS_POLLS) {
  // optionA 검증
  if (poll.optionA.insightTags) {
    vsPollsWithTags++;
    const aCount = countTags(poll.optionA.insightTags);
    if (aCount < 3) {
      vsPollsMinTagWarnings++;
    }
    vsInvalidTags.push(...validateInsightTags(poll.optionA.insightTags, poll.id, 'optionA'));
  }

  // optionB 검증
  if (poll.optionB.insightTags) {
    const bCount = countTags(poll.optionB.insightTags);
    if (bCount < 3) {
      vsPollsMinTagWarnings++;
    }
    vsInvalidTags.push(...validateInsightTags(poll.optionB.insightTags, poll.id, 'optionB'));
  }
}

console.log(`\n  VS_POLLS 총 개수: ${VS_POLLS.length}`);
console.log(`  insightTags 있는 투표: ${vsPollsWithTags}`);
console.log(`  3개 미만 태그 경고: ${vsPollsMinTagWarnings}`);
console.log(`  유효하지 않은 태그: ${vsInvalidTags.length}`);

assert(vsInvalidTags.length === 0, 'VS_POLLS에 유효하지 않은 태그가 없어야 함');

if (vsInvalidTags.length > 0) {
  console.log('\n  ❌ 유효하지 않은 태그:');
  vsInvalidTags.slice(0, 10).forEach(err => console.log(`    - ${err}`));
  if (vsInvalidTags.length > 10) {
    console.log(`    ... 외 ${vsInvalidTags.length - 10}개`);
  }
}

section('2. LOVE_VS_POLLS 태그 유효성 검증');

let lovePollsWithTags = 0;
let lovePollsMinTagWarnings = 0;
const loveInvalidTags: string[] = [];

for (const poll of LOVE_VS_POLLS) {
  if (poll.optionA.insightTags) {
    lovePollsWithTags++;
    const aCount = countTags(poll.optionA.insightTags);
    if (aCount < 3) {
      lovePollsMinTagWarnings++;
    }
    loveInvalidTags.push(...validateInsightTags(poll.optionA.insightTags, poll.id, 'optionA'));
  }

  if (poll.optionB.insightTags) {
    const bCount = countTags(poll.optionB.insightTags);
    if (bCount < 3) {
      lovePollsMinTagWarnings++;
    }
    loveInvalidTags.push(...validateInsightTags(poll.optionB.insightTags, poll.id, 'optionB'));
  }
}

console.log(`\n  LOVE_VS_POLLS 총 개수: ${LOVE_VS_POLLS.length}`);
console.log(`  insightTags 있는 투표: ${lovePollsWithTags}`);
console.log(`  3개 미만 태그 경고: ${lovePollsMinTagWarnings}`);
console.log(`  유효하지 않은 태그: ${loveInvalidTags.length}`);

assert(loveInvalidTags.length === 0, 'LOVE_VS_POLLS에 유효하지 않은 태그가 없어야 함');

if (loveInvalidTags.length > 0) {
  console.log('\n  ❌ 유효하지 않은 태그:');
  loveInvalidTags.slice(0, 10).forEach(err => console.log(`    - ${err}`));
}

section('3. 태그 분포 분석');

const tagUsage: Map<string, number> = new Map();

function countTagUsage(insightTags: InsightTags | undefined) {
  if (!insightTags) return;
  const allTags = [
    ...(insightTags.personality || []),
    ...(insightTags.decision || []),
    ...(insightTags.relationship || []),
    ...(insightTags.interest || []),
    ...(insightTags.lifestyle || []),
  ];
  for (const tag of allTags) {
    tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
  }
}

// 모든 투표 분석
for (const poll of [...VS_POLLS, ...LOVE_VS_POLLS]) {
  countTagUsage(poll.optionA.insightTags);
  countTagUsage(poll.optionB.insightTags);
}

// 상위 10개 태그
const sortedTags = [...tagUsage.entries()].sort((a, b) => b[1] - a[1]);
console.log('\n  가장 많이 사용된 태그 TOP 10:');
sortedTags.slice(0, 10).forEach(([tag, count], i) => {
  console.log(`    ${i + 1}. ${tag}: ${count}회`);
});

// 사용 안 된 태그
const usedTags = new Set(tagUsage.keys());
const unusedTags = [...VALID_INSIGHT_TAGS].filter(tag => !usedTags.has(tag));
console.log(`\n  총 사용된 태그 종류: ${usedTags.size}`);
console.log(`  사용 안 된 태그: ${unusedTags.length}개`);
if (unusedTags.length > 0 && unusedTags.length <= 20) {
  console.log(`    → ${unusedTags.join(', ')}`);
}

section('4. 결과 요약');

console.log(`\n  통과: ${passCount}`);
console.log(`  실패: ${failCount}`);

if (errors.length > 0) {
  console.log('\n  ❌ 실패한 검증:');
  errors.forEach(err => console.log(`    - ${err}`));
}

// 최종 결과
console.log('\n' + '='.repeat(60));
if (failCount === 0) {
  console.log('  ✅ 모든 InsightTags 검증 통과!');
  process.exit(0);
} else {
  console.log(`  ❌ ${failCount}개 검증 실패`);
  process.exit(1);
}
