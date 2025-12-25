/**
 * Seasonal Content Dynamic Test Script
 *
 * 실행 방법:
 *   npx tsx scripts/test-seasonal-content.ts
 *
 * tsconfig의 path alias(@/...)를 사용하므로 tsx 필수
 */
import {
  SEASONAL_QUIZZES,
  CHRISTMAS_QUIZZES,
  NEWYEAR_QUIZZES,
} from '@/data/content/quizzes/seasonal-quizzes';

import {
  SEASONAL_VS_POLLS,
  SEASONAL_CHOICE_POLLS,
  CHRISTMAS_VS_POLLS,
  NEWYEAR_VS_POLLS,
  NEWYEAR_CHOICE_POLLS,
} from '@/data/content/polls/seasonal-polls';

import { getNewYearInfo } from '@/utils/zodiac';

console.log('=== Seasonal Content Test ===\n');

const info = getNewYearInfo();
console.log('현재 새해 기준 연도:', info.year, '(' + info.ganjiName + ')');
console.log('');

// Test 1: 퀴즈 개수 확인
console.log('1. 시즌 퀴즈 개수');
console.log('   크리스마스 퀴즈:', CHRISTMAS_QUIZZES.length + '개');
console.log('   새해 퀴즈:', NEWYEAR_QUIZZES.length + '개');
console.log('   통합 시즌 퀴즈:', SEASONAL_QUIZZES.length + '개');

// Test 2: 투표 개수 확인
console.log('\n2. 시즌 투표 개수');
console.log('   크리스마스 VS:', CHRISTMAS_VS_POLLS.length + '개');
console.log('   새해 VS:', NEWYEAR_VS_POLLS.length + '개');
console.log('   새해 Choice:', NEWYEAR_CHOICE_POLLS.length + '개');
console.log('   통합 VS:', SEASONAL_VS_POLLS.length + '개');
console.log('   통합 Choice:', SEASONAL_CHOICE_POLLS.length + '개');

// Test 3: 새해 퀴즈에 동적 연도 적용 확인
console.log('\n3. 새해 퀴즈 동적 연도 확인');
NEWYEAR_QUIZZES.forEach((quiz) => {
  const hasYear = quiz.question.includes(String(info.year)) ||
                  quiz.question.includes(info.ganjiName) ||
                  quiz.question.includes(info.animal.name);
  const hasYearInTags = quiz.tags?.includes(String(info.year)) || false;

  if (quiz.id.includes('newyear')) {
    if (hasYear || hasYearInTags) {
      console.log('   ✅', quiz.id + ':', quiz.question.substring(0, 35) + '...');
    } else {
      console.log('   ⚪', quiz.id + ':', quiz.question.substring(0, 35) + '... (연도 무관)');
    }
  }
});

// Test 4: 새해 투표에 동적 연도 적용 확인
console.log('\n4. 새해 투표 동적 연도 확인');
NEWYEAR_VS_POLLS.forEach((poll) => {
  const hasYear = poll.question.includes(String(info.year));
  if (hasYear) {
    console.log('   ✅', poll.id + ':', poll.question);
  } else {
    console.log('   ⚪', poll.id + ':', poll.question, '(연도 무관)');
  }
});

// Test 5: 새해 Choice 투표 확인
console.log('\n5. 새해 Choice 투표 동적 연도 확인');
NEWYEAR_CHOICE_POLLS.forEach((poll) => {
  const hasYear = poll.question.includes(String(info.year)) ||
                  poll.question.includes(info.ganjiName) ||
                  poll.question.includes(info.animal.name);
  if (hasYear) {
    console.log('   ✅', poll.id + ':', poll.question.substring(0, 40) + '...');
  } else {
    console.log('   ⚪', poll.id + ':', poll.question.substring(0, 40) + '... (연도 무관)');
  }
});

// Test 6: ID 중복 확인
console.log('\n6. ID 중복 확인');
const allQuizIds = SEASONAL_QUIZZES.map(q => q.id);
const uniqueQuizIds = new Set(allQuizIds);
const allPollIds = [...SEASONAL_VS_POLLS.map(p => p.id), ...SEASONAL_CHOICE_POLLS.map(p => p.id)];
const uniquePollIds = new Set(allPollIds);

console.log('   퀴즈 ID:', allQuizIds.length === uniqueQuizIds.size ? '✅ 중복 없음' : '❌ 중복 있음');
console.log('   투표 ID:', allPollIds.length === uniquePollIds.size ? '✅ 중복 없음' : '❌ 중복 있음');

console.log('\n=== Test Complete ===');
