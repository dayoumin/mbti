/**
 * 와인 콘텐츠 검증 테스트
 * 실행: npx tsx scripts/test-wine-content.ts
 */

import { WINE_KNOWLEDGE_QUIZZES, WINE_VS_POLLS } from '../src/app/dashboard/data/wine-content';
import { WINE_WORLDCUP, WINE_WORLDCUP_CONTESTANTS } from '../src/app/dashboard/data/wine-tournament';

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

let passCount = 0;
let failCount = 0;
const errors: string[] = [];

function pass(msg: string) {
  passCount++;
  console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function fail(msg: string, detail?: string) {
  failCount++;
  const fullMsg = detail ? `${msg}: ${detail}` : msg;
  errors.push(fullMsg);
  console.log(`${colors.red}✗${colors.reset} ${fullMsg}`);
}

function section(title: string) {
  console.log(`\n${colors.cyan}━━━ ${title} ━━━${colors.reset}`);
}

// ============================================================================
// 1. 퀴즈 검증
// ============================================================================

section('퀴즈 검증 (10개)');

// 1.1 개수 확인
if (WINE_KNOWLEDGE_QUIZZES.length === 10) {
  pass(`퀴즈 개수: ${WINE_KNOWLEDGE_QUIZZES.length}개`);
} else {
  fail(`퀴즈 개수`, `${WINE_KNOWLEDGE_QUIZZES.length}개 (10개 필요)`);
}

// 1.2 ID 형식 확인
const quizIdPattern = /^wine-quiz-\d{3}$/;
const invalidQuizIds = WINE_KNOWLEDGE_QUIZZES.filter(q => !quizIdPattern.test(q.id));
if (invalidQuizIds.length === 0) {
  pass('퀴즈 ID 형식: wine-quiz-XXX');
} else {
  fail('퀴즈 ID 형식', invalidQuizIds.map(q => q.id).join(', '));
}

// 1.3 ID 중복 확인
const quizIds = WINE_KNOWLEDGE_QUIZZES.map(q => q.id);
const duplicateQuizIds = quizIds.filter((id, i) => quizIds.indexOf(id) !== i);
if (duplicateQuizIds.length === 0) {
  pass('퀴즈 ID 중복 없음');
} else {
  fail('퀴즈 ID 중복', duplicateQuizIds.join(', '));
}

// 1.4 필수 필드 확인
const quizRequiredFields = ['id', 'type', 'category', 'question', 'options', 'explanation', 'difficulty', 'points', 'tags'];
const missingQuizFields: string[] = [];
WINE_KNOWLEDGE_QUIZZES.forEach((q, i) => {
  quizRequiredFields.forEach(field => {
    if (!(field in q) || (q as Record<string, unknown>)[field] === undefined) {
      missingQuizFields.push(`quiz[${i}].${field}`);
    }
  });
});
if (missingQuizFields.length === 0) {
  pass('퀴즈 필수 필드 완비');
} else {
  fail('퀴즈 필수 필드 누락', missingQuizFields.join(', '));
}

// 1.5 옵션 개수 확인 (각 3개)
const wrongOptionCount = WINE_KNOWLEDGE_QUIZZES.filter(q => q.options.length !== 3);
if (wrongOptionCount.length === 0) {
  pass('퀴즈 옵션 개수: 각 3개');
} else {
  fail('퀴즈 옵션 개수', wrongOptionCount.map(q => `${q.id}(${q.options.length}개)`).join(', '));
}

// 1.6 정답 개수 확인 (각 1개)
const wrongCorrectCount = WINE_KNOWLEDGE_QUIZZES.filter(q => {
  const correctCount = q.options.filter(o => o.isCorrect).length;
  return correctCount !== 1;
});
if (wrongCorrectCount.length === 0) {
  pass('퀴즈 정답 개수: 각 1개');
} else {
  fail('퀴즈 정답 개수', wrongCorrectCount.map(q => q.id).join(', '));
}

// 1.7 난이도 분포 확인
const difficultyDist = WINE_KNOWLEDGE_QUIZZES.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
  return acc;
}, {} as Record<number, number>);
pass(`퀴즈 난이도 분포: 쉬움(${difficultyDist[1] || 0}) 보통(${difficultyDist[2] || 0}) 어려움(${difficultyDist[3] || 0})`);

// 1.8 태그 확인 (첫 태그가 'wine')
const wrongFirstTag = WINE_KNOWLEDGE_QUIZZES.filter(q => !q.tags || q.tags[0] !== 'wine');
if (wrongFirstTag.length === 0) {
  pass('퀴즈 첫 태그: wine');
} else {
  fail('퀴즈 첫 태그', wrongFirstTag.map(q => `${q.id}(${q.tags?.[0]})`).join(', '));
}

// 1.9 점수 일관성 (difficulty 1→10점, 2→15점)
const wrongPoints = WINE_KNOWLEDGE_QUIZZES.filter(q => {
  if (q.difficulty === 1 && q.points !== 10) return true;
  if (q.difficulty === 2 && q.points !== 15) return true;
  if (q.difficulty === 3 && q.points !== 20) return true;
  return false;
});
if (wrongPoints.length === 0) {
  pass('퀴즈 점수 일관성: difficulty에 맞음');
} else {
  fail('퀴즈 점수 불일치', wrongPoints.map(q => `${q.id}(난이도${q.difficulty}, ${q.points}점)`).join(', '));
}

// ============================================================================
// 2. VS 투표 검증
// ============================================================================

section('VS 투표 검증 (5개)');

// 2.1 개수 확인
if (WINE_VS_POLLS.length === 5) {
  pass(`투표 개수: ${WINE_VS_POLLS.length}개`);
} else {
  fail(`투표 개수`, `${WINE_VS_POLLS.length}개 (5개 필요)`);
}

// 2.2 ID 형식 확인
const pollIdPattern = /^wine-poll-\d{3}$/;
const invalidPollIds = WINE_VS_POLLS.filter(p => !pollIdPattern.test(p.id));
if (invalidPollIds.length === 0) {
  pass('투표 ID 형식: wine-poll-XXX');
} else {
  fail('투표 ID 형식', invalidPollIds.map(p => p.id).join(', '));
}

// 2.3 옵션 개수 확인 (VS는 정확히 2개)
const wrongPollOptions = WINE_VS_POLLS.filter(p => p.options.length !== 2);
if (wrongPollOptions.length === 0) {
  pass('투표 옵션 개수: 각 2개 (VS 형식)');
} else {
  fail('투표 옵션 개수', wrongPollOptions.map(p => `${p.id}(${p.options.length}개)`).join(', '));
}

// 2.4 이모지 확인
const missingEmoji = WINE_VS_POLLS.filter(p => p.options.some(o => !o.emoji));
if (missingEmoji.length === 0) {
  pass('투표 옵션 이모지 완비');
} else {
  fail('투표 옵션 이모지 누락', missingEmoji.map(p => p.id).join(', '));
}

// 2.5 타입 확인
const wrongType = WINE_VS_POLLS.filter(p => p.type !== 'vs');
if (wrongType.length === 0) {
  pass('투표 타입: vs');
} else {
  fail('투표 타입', wrongType.map(p => `${p.id}(${p.type})`).join(', '));
}

// ============================================================================
// 3. 토너먼트 검증
// ============================================================================

section('토너먼트 검증 (16강)');

// 3.1 참가자 수 확인
if (WINE_WORLDCUP_CONTESTANTS.length === 16) {
  pass(`참가자 수: ${WINE_WORLDCUP_CONTESTANTS.length}명`);
} else {
  fail(`참가자 수`, `${WINE_WORLDCUP_CONTESTANTS.length}명 (16명 필요)`);
}

// 3.2 roundSize 확인
if (WINE_WORLDCUP.roundSize === 16) {
  pass('roundSize: 16');
} else {
  fail('roundSize', `${WINE_WORLDCUP.roundSize} (16 필요)`);
}

// 3.3 참가자 ID 중복 확인
const contestantIds = WINE_WORLDCUP_CONTESTANTS.map(c => c.id);
const duplicateContestantIds = contestantIds.filter((id, i) => contestantIds.indexOf(id) !== i);
if (duplicateContestantIds.length === 0) {
  pass('참가자 ID 중복 없음');
} else {
  fail('참가자 ID 중복', duplicateContestantIds.join(', '));
}

// 3.4 필수 필드 확인
const contestantRequiredFields = ['id', 'name', 'emoji', 'description', 'tags', 'funFact'];
const missingContestantFields: string[] = [];
WINE_WORLDCUP_CONTESTANTS.forEach((c, i) => {
  contestantRequiredFields.forEach(field => {
    if (!(field in c) || (c as Record<string, unknown>)[field] === undefined) {
      missingContestantFields.push(`contestant[${i}].${field}`);
    }
  });
});
if (missingContestantFields.length === 0) {
  pass('참가자 필수 필드 완비');
} else {
  fail('참가자 필수 필드 누락', missingContestantFields.join(', '));
}

// 3.5 토너먼트 메타데이터 확인
const tournamentRequiredFields = ['id', 'type', 'category', 'title', 'emoji', 'themeColor', 'contestants', 'roundSize', 'resultConfig'];
const missingTournamentFields: string[] = [];
tournamentRequiredFields.forEach(field => {
  if (!(field in WINE_WORLDCUP) || (WINE_WORLDCUP as Record<string, unknown>)[field] === undefined) {
    missingTournamentFields.push(field);
  }
});
if (missingTournamentFields.length === 0) {
  pass('토너먼트 메타데이터 완비');
} else {
  fail('토너먼트 메타데이터 누락', missingTournamentFields.join(', '));
}

// 3.6 와인 종류별 분포 확인
const wineCategories = WINE_WORLDCUP_CONTESTANTS.reduce((acc, c) => {
  const mainTag = c.tags[0];
  acc[mainTag] = (acc[mainTag] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
console.log(`${colors.dim}  └ 종류별 분포: 레드(${wineCategories['레드'] || 0}) 화이트(${wineCategories['화이트'] || 0}) 스파클링(${wineCategories['스파클링'] || 0})${colors.reset}`);

// ============================================================================
// 4. 팩트 정확성 검증 (기본 상식 체크)
// ============================================================================

section('팩트 정확성 (기본 상식)');

// 4.1 타닌 퀴즈 정답 확인
const tanninQuiz = WINE_KNOWLEDGE_QUIZZES.find(q => q.id === 'wine-quiz-003');
if (tanninQuiz) {
  const correctOption = tanninQuiz.options.find(o => o.isCorrect);
  if (correctOption?.text.includes('떫은맛')) {
    pass('타닌 = 떫은맛 (정확)');
  } else {
    fail('타닌 정답', correctOption?.text);
  }
}

// 4.2 빈티지 퀴즈 정답 확인
const vintageQuiz = WINE_KNOWLEDGE_QUIZZES.find(q => q.id === 'wine-quiz-010');
if (vintageQuiz) {
  const correctOption = vintageQuiz.options.find(o => o.isCorrect);
  if (correctOption?.text.includes('수확 연도')) {
    pass('빈티지 = 수확 연도 (정확)');
  } else {
    fail('빈티지 정답', correctOption?.text);
  }
}

// 4.3 레드 와인 온도 확인
const tempQuiz = WINE_KNOWLEDGE_QUIZZES.find(q => q.id === 'wine-quiz-002');
if (tempQuiz) {
  const correctOption = tempQuiz.options.find(o => o.isCorrect);
  if (correctOption?.text.includes('15-18')) {
    pass('레드 와인 온도 15-18°C (정확)');
  } else {
    fail('레드 와인 온도', correctOption?.text);
  }
}

// 4.4 토너먼트 참가자 기본 정보
const cabernet = WINE_WORLDCUP_CONTESTANTS.find(c => c.id === 'cabernet-sauvignon');
if (cabernet?.tags.includes('풀바디')) {
  pass('카베르네 소비뇽 = 풀바디 (정확)');
} else {
  fail('카베르네 소비뇽 태그', cabernet?.tags.join(', '));
}

const pinotNoir = WINE_WORLDCUP_CONTESTANTS.find(c => c.id === 'pinot-noir');
if (pinotNoir?.tags.includes('라이트바디')) {
  pass('피노 누아 = 라이트바디 (정확)');
} else {
  fail('피노 누아 태그', pinotNoir?.tags.join(', '));
}

// ============================================================================
// 결과 출력
// ============================================================================

section('최종 결과');

const total = passCount + failCount;
const passRate = Math.round((passCount / total) * 100);

console.log(`\n통과: ${colors.green}${passCount}${colors.reset} / 실패: ${colors.red}${failCount}${colors.reset} (${passRate}%)`);

if (failCount === 0) {
  console.log(`\n${colors.green}✅ 모든 테스트 통과!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}❌ ${failCount}개 테스트 실패${colors.reset}`);
  console.log('\n실패 목록:');
  errors.forEach((err, i) => {
    console.log(`  ${i + 1}. ${err}`);
  });
  console.log('');
  process.exit(1);
}
