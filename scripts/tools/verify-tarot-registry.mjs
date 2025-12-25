/**
 * 타로 콘텐츠 레지스트리 통합 검증 스크립트
 *
 * 검증 항목:
 * 1. 타로 퀴즈가 ALL_KNOWLEDGE_QUIZZES에 포함되어 있는지
 * 2. 타로 VS 투표가 VS_POLLS에 포함되어 있는지
 * 3. 타로 Choice 투표가 CHOICE_POLLS에 포함되어 있는지
 * 4. ID 중복 없는지
 * 5. 필수 필드 존재하는지
 */

import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES, TAROT_QUIZZES } from '../src/data/content/quizzes/index.ts';
import { VS_POLLS, CHOICE_POLLS } from '../src/data/content/polls/index.ts';
import { TAROT_VS_POLLS, TAROT_CHOICE_POLLS } from '../src/data/content/polls/tarot-polls.ts';

console.log('='.repeat(60));
console.log('타로 콘텐츠 레지스트리 통합 검증');
console.log('='.repeat(60));
console.log('');

let errors = [];
let warnings = [];

// 1. 타로 퀴즈 검증
console.log('## 1. 타로 퀴즈 검증');
const tarotQuizzesInRegistry = ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === 'tarot');
console.log(`   - TAROT_QUIZZES 개수: ${TAROT_QUIZZES.length}`);
console.log(`   - ALL_KNOWLEDGE_QUIZZES 내 tarot: ${tarotQuizzesInRegistry.length}`);

if (tarotQuizzesInRegistry.length !== TAROT_QUIZZES.length) {
  errors.push(`타로 퀴즈 개수 불일치: TAROT_QUIZZES(${TAROT_QUIZZES.length}) vs 레지스트리(${tarotQuizzesInRegistry.length})`);
} else {
  console.log('   ✅ 개수 일치');
}

// ID 검증
const tarotQuizIds = new Set();
for (const quiz of tarotQuizzesInRegistry) {
  if (tarotQuizIds.has(quiz.id)) {
    errors.push(`중복 ID: ${quiz.id}`);
  }
  tarotQuizIds.add(quiz.id);

  // 필수 필드 검증
  if (!quiz.question) errors.push(`${quiz.id}: question 누락`);
  if (!quiz.options || quiz.options.length < 2) errors.push(`${quiz.id}: options 부족`);
  if (!quiz.explanation) warnings.push(`${quiz.id}: explanation 누락`);
  if (!quiz.options.some(o => o.isCorrect)) errors.push(`${quiz.id}: 정답 없음`);
}
console.log(`   - 고유 ID: ${tarotQuizIds.size}개`);
console.log('');

// 2. 타로 VS 투표 검증
console.log('## 2. 타로 VS 투표 검증');
const tarotVsInRegistry = VS_POLLS.filter(p => p.category === 'tarot');
console.log(`   - TAROT_VS_POLLS 개수: ${TAROT_VS_POLLS.length}`);
console.log(`   - VS_POLLS 내 tarot: ${tarotVsInRegistry.length}`);

if (tarotVsInRegistry.length !== TAROT_VS_POLLS.length) {
  errors.push(`타로 VS 투표 개수 불일치: TAROT_VS_POLLS(${TAROT_VS_POLLS.length}) vs 레지스트리(${tarotVsInRegistry.length})`);
} else {
  console.log('   ✅ 개수 일치');
}

// ID 및 필수 필드 검증
const tarotVsIds = new Set();
for (const poll of tarotVsInRegistry) {
  if (tarotVsIds.has(poll.id)) {
    errors.push(`중복 ID: ${poll.id}`);
  }
  tarotVsIds.add(poll.id);

  if (!poll.question) errors.push(`${poll.id}: question 누락`);
  if (!poll.optionA || !poll.optionB) errors.push(`${poll.id}: optionA/B 누락`);
}
console.log(`   - 고유 ID: ${tarotVsIds.size}개`);
console.log('');

// 3. 타로 Choice 투표 검증
console.log('## 3. 타로 Choice 투표 검증');
const tarotChoiceInRegistry = CHOICE_POLLS.filter(p => p.category === 'tarot');
console.log(`   - TAROT_CHOICE_POLLS 개수: ${TAROT_CHOICE_POLLS.length}`);
console.log(`   - CHOICE_POLLS 내 tarot: ${tarotChoiceInRegistry.length}`);

if (tarotChoiceInRegistry.length !== TAROT_CHOICE_POLLS.length) {
  errors.push(`타로 Choice 투표 개수 불일치: TAROT_CHOICE_POLLS(${TAROT_CHOICE_POLLS.length}) vs 레지스트리(${tarotChoiceInRegistry.length})`);
} else {
  console.log('   ✅ 개수 일치');
}

// ID 및 필수 필드 검증
const tarotChoiceIds = new Set();
for (const poll of tarotChoiceInRegistry) {
  if (tarotChoiceIds.has(poll.id)) {
    errors.push(`중복 ID: ${poll.id}`);
  }
  tarotChoiceIds.add(poll.id);

  if (!poll.question) errors.push(`${poll.id}: question 누락`);
  if (!poll.options || poll.options.length < 3) errors.push(`${poll.id}: options 부족 (최소 3개)`);
}
console.log(`   - 고유 ID: ${tarotChoiceIds.size}개`);
console.log('');

// 4. 전체 통계
console.log('## 4. 전체 통계');
console.log(`   - 전체 지식 퀴즈: ${ALL_KNOWLEDGE_QUIZZES.length}개`);
console.log(`   - 전체 시나리오 퀴즈: ${ALL_SCENARIO_QUIZZES.length}개`);
console.log(`   - 전체 VS 투표: ${VS_POLLS.length}개`);
console.log(`   - 전체 Choice 투표: ${CHOICE_POLLS.length}개`);
console.log('');

// 카테고리별 통계
console.log('## 5. 카테고리별 분포');
const quizByCategory = {};
ALL_KNOWLEDGE_QUIZZES.forEach(q => {
  quizByCategory[q.category] = (quizByCategory[q.category] || 0) + 1;
});
console.log('   퀴즈:', JSON.stringify(quizByCategory, null, 2).split('\n').join('\n   '));

const pollByCategory = {};
[...VS_POLLS, ...CHOICE_POLLS].forEach(p => {
  pollByCategory[p.category] = (pollByCategory[p.category] || 0) + 1;
});
console.log('   투표:', JSON.stringify(pollByCategory, null, 2).split('\n').join('\n   '));
console.log('');

// 결과 출력
console.log('='.repeat(60));
if (errors.length === 0) {
  console.log('✅ 검증 성공! 에러 없음');
} else {
  console.log(`❌ 에러 ${errors.length}개:`);
  errors.forEach(e => console.log(`   - ${e}`));
}

if (warnings.length > 0) {
  console.log(`⚠️  경고 ${warnings.length}개:`);
  warnings.forEach(w => console.log(`   - ${w}`));
}
console.log('='.repeat(60));

// 종료 코드
process.exit(errors.length > 0 ? 1 : 0);
