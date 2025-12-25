/**
 * 타로 콘텐츠 개수 검증 (빌드 후 실행)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();

// 파일 내용에서 데이터 개수 추출
function countItems(filePath, pattern) {
  const content = readFileSync(join(rootDir, filePath), 'utf-8');
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

console.log('='.repeat(60));
console.log('타로 콘텐츠 레지스트리 검증');
console.log('='.repeat(60));
console.log('');

// 1. 타로 퀴즈 개수 확인
const quizFile = readFileSync(join(rootDir, 'src/data/content/quizzes/tarot-quizzes.ts'), 'utf-8');
const quizIdMatches = quizFile.match(/id:\s*['"]tarot-quiz-\d+['"]/g);
const tarotQuizCount = quizIdMatches ? quizIdMatches.length : 0;

console.log('## 1. 타로 퀴즈');
console.log(`   - 개수: ${tarotQuizCount}개`);
console.log(`   - 예상: 22개`);
console.log(tarotQuizCount === 22 ? '   ✅ 일치' : '   ❌ 불일치');
console.log('');

// 2. 타로 VS 투표 개수 확인 (TAROT_VS_POLLS 배열 기준)
const pollFile = readFileSync(join(rootDir, 'src/data/content/polls/tarot-polls.ts'), 'utf-8');
// VS 투표: 001-010, 016-020 = 15개
const vsSection = pollFile.split('TAROT_CHOICE_POLLS')[0];
const vsIdMatches = vsSection.match(/id:\s*['"]tarot-poll-\d+['"]/g);
const tarotVsCount = vsIdMatches ? vsIdMatches.length : 0;

console.log('## 2. 타로 VS 투표');
console.log(`   - 개수: ${tarotVsCount}개`);
console.log(`   - 예상: 15개`);
console.log(tarotVsCount === 15 ? '   ✅ 일치' : '   ❌ 불일치');
console.log('');

// 3. 타로 Choice 투표 개수 확인 (TAROT_CHOICE_POLLS 배열 기준)
const choiceSection = pollFile.split('TAROT_CHOICE_POLLS')[1] || '';
const choiceIdMatches = choiceSection.match(/id:\s*['"]tarot-poll-\d+['"]/g);
const tarotChoiceCount = choiceIdMatches ? choiceIdMatches.length : 0;

console.log('## 3. 타로 Choice 투표');
console.log(`   - 개수: ${tarotChoiceCount}개`);
console.log(`   - 예상: 5개`);
console.log(tarotChoiceCount === 5 ? '   ✅ 일치' : '   ❌ 불일치');
console.log('');

// 4. 레지스트리 등록 확인
const quizIndex = readFileSync(join(rootDir, 'src/data/content/quizzes/index.ts'), 'utf-8');
const pollIndex = readFileSync(join(rootDir, 'src/data/content/polls/index.ts'), 'utf-8');

console.log('## 4. 레지스트리 등록 확인');
const quizRegistered = quizIndex.includes('TAROT_KNOWLEDGE_QUIZZES');
const vsRegistered = pollIndex.includes('TAROT_VS_POLLS');
const choiceRegistered = pollIndex.includes('TAROT_CHOICE_POLLS');

console.log(`   - 퀴즈 레지스트리: ${quizRegistered ? '✅ 등록됨' : '❌ 미등록'}`);
console.log(`   - VS 투표 레지스트리: ${vsRegistered ? '✅ 등록됨' : '❌ 미등록'}`);
console.log(`   - Choice 투표 배열: ${choiceRegistered ? '✅ 등록됨' : '❌ 미등록'}`);
console.log('');

// 5. ContentOverview 확인
const overview = readFileSync(join(rootDir, 'src/app/dashboard/components/ContentOverview.tsx'), 'utf-8');
const usesRegistry = overview.includes("q.category === 'tarot'") &&
                     overview.includes("p.category === 'tarot'");
// 실제 문자열 검색 (정규식 아님)
const noSeparateImport = !overview.includes("from './tarot-polls'") &&
                         !overview.includes("from './tarot-quizzes'") &&
                         !overview.includes('tarot-polls') &&
                         !overview.includes('tarot-quizzes');

console.log('## 5. ContentOverview 통합');
console.log(`   - 레지스트리 필터 사용: ${usesRegistry ? '✅' : '❌'}`);
console.log(`   - 별도 import 제거: ${noSeparateImport ? '✅' : '❌'}`);
console.log('');

// 결과 요약
console.log('='.repeat(60));
const allPass = tarotQuizCount === 22 &&
                tarotVsCount === 15 &&
                tarotChoiceCount === 5 &&
                quizRegistered && vsRegistered && choiceRegistered;

if (allPass) {
  console.log('✅ 모든 검증 통과!');
  console.log('');
  console.log('총 타로 콘텐츠:');
  console.log(`   - 퀴즈: ${tarotQuizCount}개`);
  console.log(`   - VS 투표: ${tarotVsCount}개`);
  console.log(`   - Choice 투표: ${tarotChoiceCount}개`);
  console.log(`   - 합계: ${tarotQuizCount + tarotVsCount + tarotChoiceCount}개`);
} else {
  console.log('❌ 일부 검증 실패 - 위 내용 확인 필요');
}
console.log('='.repeat(60));

process.exit(allPass ? 0 : 1);
