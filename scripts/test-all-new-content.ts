/**
 * 새로 추가된 4개 카테고리 콘텐츠 통합 테스트
 * 실행: npx tsx scripts/test-all-new-content.ts
 */

// ============================================================================
// 콘텐츠 Import
// ============================================================================

import { BEER_KNOWLEDGE_QUIZZES, BEER_VS_POLLS } from '../src/app/dashboard/data/beer-content';
import { BEER_WORLDCUP, BEER_WORLDCUP_CONTESTANTS } from '../src/app/dashboard/data/beer-tournament';
import { DESSERT_KNOWLEDGE_QUIZZES, DESSERT_VS_POLLS } from '../src/app/dashboard/data/dessert-content';
import { DESSERT_WORLDCUP, DESSERT_WORLDCUP_CONTESTANTS } from '../src/app/dashboard/data/dessert-tournament';
import { WINE_KNOWLEDGE_QUIZZES, WINE_VS_POLLS } from '../src/app/dashboard/data/wine-content';
import { WINE_WORLDCUP, WINE_WORLDCUP_CONTESTANTS } from '../src/app/dashboard/data/wine-tournament';
import { TRAVEL_KNOWLEDGE_QUIZZES, TRAVEL_VS_POLLS } from '../src/app/dashboard/data/travel-content';
import { TRAVEL_DESTINATION_WORLDCUP, TRAVEL_DESTINATION_CONTESTANTS } from '../src/app/dashboard/data/travel-tournament';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

interface TestResult {
  category: string;
  passed: number;
  failed: number;
  errors: string[];
}

const results: TestResult[] = [];

function testCategory(
  category: string,
  quizzes: unknown[],
  polls: unknown[],
  tournament: unknown,
  contestants: unknown[]
): TestResult {
  const result: TestResult = {
    category,
    passed: 0,
    failed: 0,
    errors: [],
  };

  const pass = () => result.passed++;
  const fail = (msg: string) => {
    result.failed++;
    result.errors.push(msg);
  };

  // 1. 퀴즈 개수
  if (quizzes.length === 10) pass();
  else fail(`퀴즈 개수: ${quizzes.length}/10`);

  // 2. 투표 개수
  if (polls.length === 5) pass();
  else fail(`투표 개수: ${polls.length}/5`);

  // 3. 토너먼트 참가자 수
  if (contestants.length === 16) pass();
  else fail(`참가자 수: ${contestants.length}/16`);

  // 4. 퀴즈 ID 중복 확인
  const quizIds = (quizzes as { id: string }[]).map(q => q.id);
  const duplicateQuiz = quizIds.filter((id, i) => quizIds.indexOf(id) !== i);
  if (duplicateQuiz.length === 0) pass();
  else fail(`퀴즈 ID 중복: ${duplicateQuiz.join(', ')}`);

  // 5. 투표 ID 중복 확인
  const pollIds = (polls as { id: string }[]).map(p => p.id);
  const duplicatePoll = pollIds.filter((id, i) => pollIds.indexOf(id) !== i);
  if (duplicatePoll.length === 0) pass();
  else fail(`투표 ID 중복: ${duplicatePoll.join(', ')}`);

  // 6. 참가자 ID 중복 확인
  const contestantIds = (contestants as { id: string }[]).map(c => c.id);
  const duplicateContestant = contestantIds.filter((id, i) => contestantIds.indexOf(id) !== i);
  if (duplicateContestant.length === 0) pass();
  else fail(`참가자 ID 중복: ${duplicateContestant.join(', ')}`);

  // 7. 퀴즈 정답 검증 (각 1개)
  const wrongCorrect = (quizzes as { id: string; options: { isCorrect?: boolean }[] }[])
    .filter(q => q.options.filter(o => o.isCorrect).length !== 1);
  if (wrongCorrect.length === 0) pass();
  else fail(`정답 오류: ${wrongCorrect.map(q => q.id).join(', ')}`);

  // 8. VS 투표 옵션 수 (각 2개)
  const wrongVs = (polls as { id: string; options: unknown[] }[])
    .filter(p => p.options.length !== 2);
  if (wrongVs.length === 0) pass();
  else fail(`VS 옵션 오류: ${wrongVs.map(p => p.id).join(', ')}`);

  // 9. 토너먼트 roundSize 확인
  if ((tournament as { roundSize: number }).roundSize === 16) pass();
  else fail(`roundSize: ${(tournament as { roundSize: number }).roundSize}/16`);

  // 10. 태그 존재 확인
  const noTags = (quizzes as { id: string; tags?: string[] }[])
    .filter(q => !q.tags || q.tags.length === 0);
  if (noTags.length === 0) pass();
  else fail(`태그 누락: ${noTags.map(q => q.id).join(', ')}`);

  return result;
}

// ============================================================================
// 테스트 실행
// ============================================================================

console.log(`\n${colors.bold}${colors.cyan}════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}   4개 카테고리 콘텐츠 통합 테스트${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════${colors.reset}\n`);

// 맥주
results.push(testCategory(
  '🍺 맥주',
  BEER_KNOWLEDGE_QUIZZES,
  BEER_VS_POLLS,
  BEER_WORLDCUP,
  BEER_WORLDCUP_CONTESTANTS
));

// 디저트
results.push(testCategory(
  '🍰 디저트',
  DESSERT_KNOWLEDGE_QUIZZES,
  DESSERT_VS_POLLS,
  DESSERT_WORLDCUP,
  DESSERT_WORLDCUP_CONTESTANTS
));

// 와인
results.push(testCategory(
  '🍷 와인',
  WINE_KNOWLEDGE_QUIZZES,
  WINE_VS_POLLS,
  WINE_WORLDCUP,
  WINE_WORLDCUP_CONTESTANTS
));

// 여행
results.push(testCategory(
  '✈️ 여행',
  TRAVEL_KNOWLEDGE_QUIZZES,
  TRAVEL_VS_POLLS,
  TRAVEL_DESTINATION_WORLDCUP,
  TRAVEL_DESTINATION_CONTESTANTS
));

// ============================================================================
// 결과 출력
// ============================================================================

let totalPassed = 0;
let totalFailed = 0;

results.forEach(r => {
  const status = r.failed === 0 ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  console.log(`${status} ${r.category}: ${colors.green}${r.passed}${colors.reset}/${r.passed + r.failed} 통과`);

  if (r.errors.length > 0) {
    r.errors.forEach(err => {
      console.log(`  ${colors.red}└ ${err}${colors.reset}`);
    });
  }

  totalPassed += r.passed;
  totalFailed += r.failed;
});

console.log(`\n${colors.cyan}────────────────────────────────────────${colors.reset}`);
console.log(`총계: ${colors.green}${totalPassed}${colors.reset} 통과 / ${colors.red}${totalFailed}${colors.reset} 실패`);

// 콘텐츠 통계
console.log(`\n${colors.dim}콘텐츠 통계:${colors.reset}`);
console.log(`${colors.dim}  - 퀴즈: 40개 (10개 × 4 카테고리)${colors.reset}`);
console.log(`${colors.dim}  - VS 투표: 20개 (5개 × 4 카테고리)${colors.reset}`);
console.log(`${colors.dim}  - 토너먼트: 4개 (16강 × 4 카테고리)${colors.reset}`);
console.log(`${colors.dim}  - 총 콘텐츠: 64개${colors.reset}`);

if (totalFailed === 0) {
  console.log(`\n${colors.green}${colors.bold}✅ 모든 테스트 통과!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}${colors.bold}❌ ${totalFailed}개 테스트 실패${colors.reset}\n`);
  process.exit(1);
}
