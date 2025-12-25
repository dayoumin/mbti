/**
 * 신규 퀴즈 데이터 검증 스크립트 (간소화 버전)
 * 빌드 통과 + 구조 확인
 * 실행: node scripts/test-new-quizzes.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const quizFiles = [
  { name: 'fish', file: 'fish-knowledge.ts', expected: 15 },
  { name: 'hamster', file: 'hamster-knowledge.ts', expected: 15 },
  { name: 'bird', file: 'bird-knowledge.ts', expected: 15 },
  { name: 'reptile', file: 'reptile-knowledge.ts', expected: 16 },
  { name: 'smallPet', file: 'smallPet-knowledge.ts', expected: 15 },
];

console.log('='.repeat(60));
console.log('신규 퀴즈 데이터 검증 (구조 확인)');
console.log('='.repeat(60));

let allPassed = true;
let totalQuizzes = 0;

for (const cat of quizFiles) {
  const filePath = join(__dirname, '../src/data/content/quizzes', cat.file);
  const content = readFileSync(filePath, 'utf-8');

  // 퀴즈 ID만 추출 (category-k-XXX 형식만)
  const quizIdPattern = new RegExp(`id:\\s*['"]${cat.name}-k-\\d{3}['"]`, 'g');
  const quizIds = content.match(quizIdPattern) || [];
  const count = quizIds.length;

  // 필수 요소 확인
  const hasOptions = content.includes('options:');
  const hasExplanation = content.includes('explanation:');
  const hasSource = content.includes('source:');
  const hasTags = content.includes('tags:');
  const hasIsCorrect = content.includes('isCorrect: true');

  const passed = count === cat.expected && hasOptions && hasExplanation && hasSource && hasTags && hasIsCorrect;

  if (passed) {
    console.log(`✅ ${cat.name.toUpperCase()}: ${count}개 퀴즈 (통과)`);
  } else {
    console.log(`❌ ${cat.name.toUpperCase()}: 문제 발견`);
    if (count !== cat.expected) console.log(`   - 개수: ${count}개 (예상 ${cat.expected}개)`);
    if (!hasOptions) console.log(`   - options 누락`);
    if (!hasExplanation) console.log(`   - explanation 누락`);
    if (!hasSource) console.log(`   - source 누락`);
    if (!hasTags) console.log(`   - tags 누락`);
    if (!hasIsCorrect) console.log(`   - isCorrect: true 누락`);
    allPassed = false;
  }

  totalQuizzes += count;
}

console.log('='.repeat(60));
console.log(`📊 총 ${totalQuizzes}개 퀴즈 검증 완료`);
console.log('='.repeat(60));

if (allPassed) {
  console.log('✅ 모든 검증 통과!');
  process.exit(0);
} else {
  console.log('❌ 일부 검증 실패');
  process.exit(1);
}
