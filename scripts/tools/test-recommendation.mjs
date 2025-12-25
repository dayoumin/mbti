#!/usr/bin/env node
/**
 * 추천 시스템 테스트
 * 실행: node scripts/test-recommendation.mjs
 *
 * 테스트 항목:
 * 1. Jaccard 유사도 계산
 * 2. 태그 기반 추천
 * 3. 참여 이력 기반 추천
 */

// ============================================================================
// 테스트용 함수 (TypeScript 모듈 로직 복제)
// ============================================================================

/**
 * Jaccard 유사도 계산 (태그 교집합 / 합집합)
 */
function calculateJaccardSimilarity(tagsA, tagsB) {
  if (tagsA.length === 0 && tagsB.length === 0) return 0;

  const setA = new Set(tagsA);
  const setB = new Set(tagsB);

  const intersection = new Set([...setA].filter(tag => setB.has(tag)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * 매칭된 태그 반환
 */
function getMatchedTags(tagsA, tagsB) {
  const setB = new Set(tagsB);
  return tagsA.filter(tag => setB.has(tag));
}

/**
 * 콘텐츠 유사도 계산
 */
function calculateContentSimilarity(contentA, contentB) {
  const WEIGHTS = {
    tagSimilarity: 0.7,
    categoryMatch: 0.3,
  };

  const tagsA = contentA.tags || [];
  const tagsB = contentB.tags || [];
  const tagScore = calculateJaccardSimilarity(tagsA, tagsB);

  const sameCategory = contentA.category === contentB.category;
  const categoryScore = sameCategory ? 1 : 0;

  const score = tagScore * WEIGHTS.tagSimilarity + categoryScore * WEIGHTS.categoryMatch;

  return {
    contentId: contentB.id,
    score,
    matchedTags: getMatchedTags(tagsA, tagsB),
    sameCategory,
  };
}

/**
 * 참여 이력 기반 추천
 */
function getRecommendedContent(participatedContents, allContents, limit = 5) {
  const participatedIds = new Set(participatedContents.map(c => c.id));
  const unparticipated = allContents.filter(c => !participatedIds.has(c.id));

  if (participatedContents.length === 0) {
    return [];
  }

  const scored = unparticipated.map(content => {
    const similarities = participatedContents.map(p =>
      calculateContentSimilarity(p, content)
    );

    const maxSimilarity = Math.max(...similarities.map(s => s.score));
    const avgSimilarity = similarities.reduce((sum, s) => sum + s.score, 0) / similarities.length;
    const combinedScore = maxSimilarity * 0.7 + avgSimilarity * 0.3;

    const bestMatch = similarities.reduce((a, b) => a.score > b.score ? a : b);

    return {
      content,
      similarityScore: combinedScore,
      matchedTags: bestMatch.matchedTags,
      sameCategory: bestMatch.sameCategory,
    };
  });

  return scored
    .filter(item => item.similarityScore > 0.1)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

// ============================================================================
// 테스트 케이스
// ============================================================================

console.log('========================================');
console.log('추천 시스템 테스트');
console.log('========================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   에러: ${e.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertArrayEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertClose(actual, expected, tolerance, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}: expected ~${expected}, got ${actual}`);
  }
}

// ============================================================================
// 1. Jaccard 유사도 테스트
// ============================================================================

console.log('\n--- Jaccard 유사도 테스트 ---\n');

test('동일 태그 → 유사도 1.0', () => {
  const tags = ['고양이', '건강', '음식'];
  const similarity = calculateJaccardSimilarity(tags, tags);
  assertEqual(similarity, 1, '완전 일치');
});

test('완전 다른 태그 → 유사도 0', () => {
  const tagsA = ['고양이', '건강'];
  const tagsB = ['강아지', '훈련'];
  const similarity = calculateJaccardSimilarity(tagsA, tagsB);
  assertEqual(similarity, 0, '완전 불일치');
});

test('부분 일치 → 올바른 유사도', () => {
  const tagsA = ['고양이', '건강', '음식'];
  const tagsB = ['고양이', '음식', '간식'];
  // 교집합: {고양이, 음식} = 2
  // 합집합: {고양이, 건강, 음식, 간식} = 4
  // 유사도: 2/4 = 0.5
  const similarity = calculateJaccardSimilarity(tagsA, tagsB);
  assertEqual(similarity, 0.5, '부분 일치');
});

test('빈 태그 → 유사도 0', () => {
  const similarity = calculateJaccardSimilarity([], []);
  assertEqual(similarity, 0, '빈 태그');
});

test('한쪽만 빈 태그 → 유사도 0', () => {
  const similarity = calculateJaccardSimilarity(['고양이'], []);
  assertEqual(similarity, 0, '한쪽 빈 태그');
});

// ============================================================================
// 2. 콘텐츠 유사도 테스트
// ============================================================================

console.log('\n--- 콘텐츠 유사도 테스트 ---\n');

test('같은 카테고리 + 같은 태그 → 높은 유사도', () => {
  const quizA = { id: 'q1', category: 'cat', tags: ['고양이', '품종', '털'] };
  const quizB = { id: 'q2', category: 'cat', tags: ['고양이', '품종', '성격'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  // 태그 유사도: 2/4 = 0.5, 카테고리: 1
  // 점수: 0.5 * 0.7 + 1 * 0.3 = 0.35 + 0.3 = 0.65
  assertClose(similarity.score, 0.65, 0.01, '유사도 계산');
  assertEqual(similarity.sameCategory, true, '같은 카테고리');
});

test('다른 카테고리 + 같은 태그 → 중간 유사도', () => {
  const quizA = { id: 'q1', category: 'cat', tags: ['동물', '건강', '음식'] };
  const quizB = { id: 'q2', category: 'dog', tags: ['동물', '건강', '음식'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  // 태그 유사도: 1, 카테고리: 0
  // 점수: 1 * 0.7 + 0 * 0.3 = 0.7
  assertClose(similarity.score, 0.7, 0.01, '유사도 계산');
  assertEqual(similarity.sameCategory, false, '다른 카테고리');
});

test('같은 카테고리 + 다른 태그 → 낮은 유사도', () => {
  const quizA = { id: 'q1', category: 'cat', tags: ['품종', '역사'] };
  const quizB = { id: 'q2', category: 'cat', tags: ['건강', '음식'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  // 태그 유사도: 0, 카테고리: 1
  // 점수: 0 * 0.7 + 1 * 0.3 = 0.3
  assertClose(similarity.score, 0.3, 0.01, '유사도 계산');
});

test('매칭된 태그 반환', () => {
  const quizA = { id: 'q1', category: 'cat', tags: ['고양이', '품종', '털'] };
  const quizB = { id: 'q2', category: 'cat', tags: ['고양이', '건강', '품종'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  assertArrayEqual(similarity.matchedTags.sort(), ['고양이', '품종'], '매칭 태그');
});

// ============================================================================
// 3. 참여 이력 기반 추천 테스트
// ============================================================================

console.log('\n--- 참여 이력 기반 추천 테스트 ---\n');

const sampleQuizzes = [
  { id: 'cat-001', category: 'cat', tags: ['고양이', '품종', '털', '성격'] },
  { id: 'cat-002', category: 'cat', tags: ['고양이', '건강', '음식', '간식'] },
  { id: 'cat-003', category: 'cat', tags: ['고양이', '행동', '심리', '애교'] },
  { id: 'dog-001', category: 'dog', tags: ['강아지', '품종', '털', '성격'] },
  { id: 'dog-002', category: 'dog', tags: ['강아지', '훈련', '산책', '건강'] },
  { id: 'life-001', category: 'lifestyle', tags: ['커피', '음료', '취향', '카페'] },
];

test('참여한 콘텐츠와 유사한 것 추천', () => {
  const participated = [sampleQuizzes[0]]; // cat-001 참여
  const recommended = getRecommendedContent(participated, sampleQuizzes, 3);

  // cat-001(고양이 품종)과 가장 유사한 것:
  // 1. dog-001: 같은 태그(품종, 털, 성격) 많음 → 높은 유사도
  // 2. cat-002, cat-003: 같은 카테고리지만 태그 다름

  if (recommended.length === 0) {
    throw new Error('추천 결과 없음');
  }

  // 첫 번째 추천이 유사도 높은 것인지 확인
  const firstRec = recommended[0];
  if (firstRec.similarityScore <= 0.1) {
    throw new Error('유사도가 너무 낮음');
  }
});

test('여러 콘텐츠 참여 시 평균 유사도 반영', () => {
  const participated = [sampleQuizzes[0], sampleQuizzes[1]]; // cat-001, cat-002 참여
  const recommended = getRecommendedContent(participated, sampleQuizzes, 3);

  // 고양이 관련 콘텐츠를 많이 봤으므로 cat-003이 상위에 올라야 함
  const catRecommended = recommended.filter(r => r.content.category === 'cat');
  if (catRecommended.length === 0) {
    throw new Error('카테고리 기반 추천 실패');
  }
});

test('참여 이력 없으면 빈 배열', () => {
  const recommended = getRecommendedContent([], sampleQuizzes, 3);
  assertArrayEqual(recommended, [], '빈 배열');
});

test('모두 참여했으면 빈 배열', () => {
  const recommended = getRecommendedContent(sampleQuizzes, sampleQuizzes, 3);
  assertArrayEqual(recommended, [], '빈 배열');
});

test('limit 제한 동작', () => {
  const participated = [sampleQuizzes[0]];
  const recommended = getRecommendedContent(participated, sampleQuizzes, 2);

  if (recommended.length > 2) {
    throw new Error('limit 초과');
  }
});

// ============================================================================
// 4. 엣지 케이스 테스트
// ============================================================================

console.log('\n--- 엣지 케이스 테스트 ---\n');

test('태그 없는 콘텐츠 처리', () => {
  const quizA = { id: 'q1', category: 'cat', tags: [] };
  const quizB = { id: 'q2', category: 'cat', tags: ['고양이'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  // 태그 유사도: 0, 카테고리: 1
  // 점수: 0 * 0.7 + 1 * 0.3 = 0.3
  assertClose(similarity.score, 0.3, 0.01, '태그 없는 콘텐츠');
});

test('tags 필드 없는 콘텐츠 처리', () => {
  const quizA = { id: 'q1', category: 'cat' }; // tags 없음
  const quizB = { id: 'q2', category: 'cat', tags: ['고양이'] };
  const similarity = calculateContentSimilarity(quizA, quizB);

  // undefined → [] 처리되어야 함
  assertClose(similarity.score, 0.3, 0.01, 'tags 필드 없음');
});

test('중복 태그 처리', () => {
  const tagsA = ['고양이', '고양이', '건강'];
  const tagsB = ['고양이', '건강', '건강'];
  // Set으로 처리되므로: {고양이, 건강} vs {고양이, 건강}
  const similarity = calculateJaccardSimilarity(tagsA, tagsB);
  assertEqual(similarity, 1, '중복 태그 → 완전 일치');
});

// ============================================================================
// 결과 출력
// ============================================================================

console.log('\n========================================');
console.log(`결과: ${passed}개 통과, ${failed}개 실패`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
}
