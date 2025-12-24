#!/usr/bin/env node
/**
 * Tags 품질 검증 스크립트
 * 실행: node scripts/validate-tags-quality.mjs
 *
 * 검증 항목:
 * 1. 모든 퀴즈에 tags가 있는지
 * 2. tags가 3개 이상인지
 * 3. 한글 태그인지
 * 4. 중복/오타 가능성
 * 5. 카테고리와 일치하는지
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================================
// 데이터 로드 (TypeScript import 대신 파일 파싱)
// ============================================================================

function extractQuizzesFromFile(filePath, arrayName) {
  const content = readFileSync(filePath, 'utf-8');
  const quizzes = [];

  // 간단한 정규식으로 각 퀴즈 객체 추출
  const regex = /\{\s*id:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const id = match[1];

    // id 위치부터 tags 찾기
    const startIdx = match.index;
    const endIdx = content.indexOf('},', startIdx) + 1;
    const quizBlock = content.slice(startIdx, endIdx);

    // tags 추출
    const tagsMatch = quizBlock.match(/tags:\s*\[([^\]]*)\]/);
    let tags = [];
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(t => t.trim().replace(/['"]/g, ''))
        .filter(t => t.length > 0);
    }

    // category 추출
    const categoryMatch = quizBlock.match(/category:\s*['"]([^'"]+)['"]/);
    const category = categoryMatch ? categoryMatch[1] : 'unknown';

    // question 추출
    const questionMatch = quizBlock.match(/question:\s*['"]([^'"]+)['"]/);
    const question = questionMatch ? questionMatch[1] : '';

    quizzes.push({ id, category, question, tags });
  }

  return quizzes;
}

// ============================================================================
// 검증 함수들
// ============================================================================

const CATEGORY_KEYWORDS = {
  cat: ['고양이', '집사', '골골송', '슬로우블링크', '버팅', '꾹꾹이', '캣닢'],
  dog: ['강아지', '견주', '칼밍시그널', '산책', '훈련'],
  rabbit: ['토끼', '빙키', '덤핑', '건초'],
  plant: ['식물', '화분', '분갈이', '다육이', '선인장', '몬스테라'],
  hamster: ['햄스터', '볼주머니', '쳇바퀴'],
};

function validateQuiz(quiz, allTags) {
  const errors = [];
  const warnings = [];

  // 1. tags 존재 확인
  if (!quiz.tags || quiz.tags.length === 0) {
    errors.push('tags 없음');
    return { errors, warnings };
  }

  // 2. 최소 개수 확인
  if (quiz.tags.length < 3) {
    warnings.push(`tags ${quiz.tags.length}개 (3개 이상 권장)`);
  }

  // 3. 영문 태그 확인
  const englishTags = quiz.tags.filter(t => /^[a-zA-Z]+$/.test(t));
  if (englishTags.length > 0) {
    warnings.push(`영문 태그: ${englishTags.join(', ')}`);
  }

  // 4. 카테고리 키워드 확인
  const categoryKeywords = CATEGORY_KEYWORDS[quiz.category] || [];
  const hasMainKeyword = categoryKeywords.some(kw => quiz.tags.includes(kw));
  if (!hasMainKeyword && categoryKeywords.length > 0) {
    warnings.push(`카테고리(${quiz.category}) 관련 태그 없음`);
  }

  // 5. 중복 태그 확인
  const uniqueTags = new Set(quiz.tags);
  if (uniqueTags.size < quiz.tags.length) {
    errors.push('중복 태그 있음');
  }

  // 6. 유사 태그 수집 (전체 분석용)
  quiz.tags.forEach(tag => {
    if (!allTags[tag]) allTags[tag] = [];
    allTags[tag].push(quiz.id);
  });

  return { errors, warnings };
}

// ============================================================================
// 메인 실행
// ============================================================================

console.log('========================================');
console.log('Tags 품질 검증');
console.log('========================================\n');

const files = [
  { path: 'src/data/content/quizzes/cat-knowledge.ts', name: 'cat-knowledge' },
  { path: 'src/data/content/quizzes/dog-knowledge.ts', name: 'dog-knowledge' },
  { path: 'src/data/content/quizzes/rabbit-knowledge.ts', name: 'rabbit-knowledge' },
  { path: 'src/data/content/quizzes/plant-knowledge.ts', name: 'plant-knowledge' },
  { path: 'src/data/content/quizzes/kids-animals.ts', name: 'kids-animals' },
  { path: 'src/data/content/quizzes/cat-scenario.ts', name: 'cat-scenario' },
  { path: 'src/data/content/quizzes/dog-scenario.ts', name: 'dog-scenario' },
];

let totalQuizzes = 0;
let totalErrors = 0;
let totalWarnings = 0;
const allTags = {};
const allResults = [];

for (const file of files) {
  const filePath = join(projectRoot, file.path);
  let quizzes;

  try {
    quizzes = extractQuizzesFromFile(filePath, file.name);
  } catch (e) {
    console.log(`❌ ${file.name}: 파일 읽기 실패`);
    continue;
  }

  console.log(`--- ${file.name} (${quizzes.length}개) ---`);

  let fileErrors = 0;
  let fileWarnings = 0;

  for (const quiz of quizzes) {
    const { errors, warnings } = validateQuiz(quiz, allTags);

    if (errors.length > 0 || warnings.length > 0) {
      allResults.push({ quiz, errors, warnings });
    }

    fileErrors += errors.length;
    fileWarnings += warnings.length;
  }

  totalQuizzes += quizzes.length;
  totalErrors += fileErrors;
  totalWarnings += fileWarnings;

  if (fileErrors === 0 && fileWarnings === 0) {
    console.log(`  ✅ 모두 통과\n`);
  } else {
    console.log(`  에러: ${fileErrors}, 경고: ${fileWarnings}\n`);
  }
}

// ============================================================================
// 결과 출력
// ============================================================================

console.log('========================================');
console.log('검증 결과 요약');
console.log('========================================\n');

console.log(`총 퀴즈: ${totalQuizzes}개`);
console.log(`에러: ${totalErrors}개`);
console.log(`경고: ${totalWarnings}개\n`);

if (allResults.length > 0) {
  console.log('--- 문제 있는 퀴즈 ---\n');

  for (const { quiz, errors, warnings } of allResults) {
    console.log(`${quiz.id}:`);
    if (errors.length > 0) {
      errors.forEach(e => console.log(`  ❌ ${e}`));
    }
    if (warnings.length > 0) {
      warnings.forEach(w => console.log(`  ⚠️  ${w}`));
    }
    console.log(`  tags: [${quiz.tags.join(', ')}]`);
    console.log('');
  }
}

// ============================================================================
// 태그 통계
// ============================================================================

console.log('========================================');
console.log('태그 통계');
console.log('========================================\n');

const tagCounts = Object.entries(allTags)
  .map(([tag, ids]) => ({ tag, count: ids.length }))
  .sort((a, b) => b.count - a.count);

console.log('가장 많이 사용된 태그:');
tagCounts.slice(0, 15).forEach(({ tag, count }) => {
  console.log(`  ${tag}: ${count}회`);
});

console.log('\n1회만 사용된 태그 (유니크):');
const uniqueTags = tagCounts.filter(t => t.count === 1);
console.log(`  총 ${uniqueTags.length}개`);
if (uniqueTags.length <= 20) {
  console.log(`  [${uniqueTags.map(t => t.tag).join(', ')}]`);
}

// 유사 태그 감지
console.log('\n유사 태그 감지:');
const tagList = Object.keys(allTags);
const similarPairs = [];

for (let i = 0; i < tagList.length; i++) {
  for (let j = i + 1; j < tagList.length; j++) {
    const a = tagList[i];
    const b = tagList[j];

    // 한 글자 차이 또는 포함 관계
    if (a.includes(b) || b.includes(a)) {
      similarPairs.push([a, b]);
    }
  }
}

if (similarPairs.length > 0) {
  similarPairs.forEach(([a, b]) => {
    console.log(`  "${a}" ↔ "${b}"`);
  });
} else {
  console.log('  없음');
}

console.log('\n========================================');
if (totalErrors === 0) {
  console.log('✅ 품질 검증 통과!');
} else {
  console.log('❌ 에러가 있습니다. 수정이 필요합니다.');
}
console.log('========================================');
