/**
 * 타로 콘텐츠 상세 검증
 */
import { readFileSync } from 'fs';

const quizFile = readFileSync('src/data/content/quizzes/tarot-quizzes.ts', 'utf-8');
const pollFile = readFileSync('src/data/content/polls/tarot-polls.ts', 'utf-8');

console.log('=== 타로 콘텐츠 상세 검증 ===');
console.log('');

let errors = 0;

// 1. 퀴즈 ID 중복 검사
const quizIds = quizFile.match(/id:\s*['"]tarot-quiz-\d+['"]/g) || [];
const uniqueQuizIds = new Set(quizIds);
console.log('## 퀴즈 ID 중복 검사');
console.log(`   - 전체 ID: ${quizIds.length}`);
console.log(`   - 고유 ID: ${uniqueQuizIds.size}`);
if (quizIds.length === uniqueQuizIds.size) {
  console.log('   ✅ 중복 없음');
} else {
  console.log('   ❌ 중복 있음');
  errors++;
}
console.log('');

// 2. 투표 ID 중복 검사
const pollIds = pollFile.match(/id:\s*['"]tarot-poll-\d+['"]/g) || [];
const uniquePollIds = new Set(pollIds);
console.log('## 투표 ID 중복 검사');
console.log(`   - 전체 ID: ${pollIds.length}`);
console.log(`   - 고유 ID: ${uniquePollIds.size}`);
if (pollIds.length === uniquePollIds.size) {
  console.log('   ✅ 중복 없음');
} else {
  console.log('   ❌ 중복 있음');
  errors++;
}
console.log('');

// 3. category 일관성 검사
const quizCategories = quizFile.match(/category:\s*['"](\w+)['"]/g) || [];
const pollCategories = pollFile.match(/category:\s*['"](\w+)['"]/g) || [];
const allCategories = [...quizCategories, ...pollCategories];
const nonTarot = allCategories.filter(c => !c.includes('tarot'));
console.log('## category 일관성');
console.log(`   - 전체 category 수: ${allCategories.length}`);
console.log(`   - tarot 아닌 것: ${nonTarot.length}`);
if (nonTarot.length > 0) {
  console.log(`   ❌ 잘못된 category: ${nonTarot.join(', ')}`);
  errors++;
} else {
  console.log('   ✅ 모두 tarot');
}
console.log('');

// 4. 필수 필드 검사 (퀴즈)
const hasExplanation = (quizFile.match(/explanation:/g) || []).length;
const hasDifficulty = (quizFile.match(/difficulty:/g) || []).length;
console.log('## 퀴즈 필수 필드');
console.log(`   - explanation: ${hasExplanation}개`);
console.log(`   - difficulty: ${hasDifficulty}개`);
if (hasExplanation >= 22 && hasDifficulty >= 22) {
  console.log('   ✅ 필수 필드 완비');
} else {
  console.log('   ❌ 일부 누락');
  errors++;
}
console.log('');

// 5. VS 투표 구조 검사 (optionA/optionB)
const hasOptionA = (pollFile.match(/optionA:/g) || []).length;
const hasOptionB = (pollFile.match(/optionB:/g) || []).length;
console.log('## VS 투표 구조');
console.log(`   - optionA: ${hasOptionA}개`);
console.log(`   - optionB: ${hasOptionB}개`);
if (hasOptionA === 15 && hasOptionB === 15) {
  console.log('   ✅ 올바른 구조');
} else {
  console.log('   ❌ 구조 오류');
  errors++;
}
console.log('');

// 6. 정답 검사 (isCorrect: true)
const correctAnswers = (quizFile.match(/isCorrect:\s*true/g) || []).length;
console.log('## 퀴즈 정답 검사');
console.log(`   - isCorrect: true 개수: ${correctAnswers}`);
if (correctAnswers >= 22) {
  console.log('   ✅ 각 퀴즈에 정답 있음');
} else {
  console.log('   ❌ 정답 누락 가능성');
  errors++;
}
console.log('');

// 결과
console.log('='.repeat(40));
if (errors === 0) {
  console.log('✅ 모든 상세 검증 통과!');
} else {
  console.log(`❌ ${errors}개 문제 발견`);
}
console.log('='.repeat(40));

process.exit(errors > 0 ? 1 : 0);
