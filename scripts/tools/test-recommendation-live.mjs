#!/usr/bin/env node
/**
 * 추천 시스템 실제 데이터 테스트
 * 실행: node scripts/test-recommendation-live.mjs
 *
 * 현재 퀴즈/투표 데이터로 추천 시스템 동작 확인
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================================
// 추천 알고리즘 (ContentRecommendationService 로직 복제)
// ============================================================================

function calculateJaccardSimilarity(tagsA, tagsB) {
  if (!tagsA || !tagsB || (tagsA.length === 0 && tagsB.length === 0)) return 0;

  const setA = new Set(tagsA);
  const setB = new Set(tagsB);

  const intersection = new Set([...setA].filter(tag => setB.has(tag)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

function calculateContentSimilarity(contentA, contentB) {
  const WEIGHTS = { tagSimilarity: 0.7, categoryMatch: 0.3 };

  const tagsA = contentA.tags || [];
  const tagsB = contentB.tags || [];
  const tagScore = calculateJaccardSimilarity(tagsA, tagsB);

  const sameCategory = contentA.category === contentB.category;
  const categoryScore = sameCategory ? 1 : 0;

  return {
    score: tagScore * WEIGHTS.tagSimilarity + categoryScore * WEIGHTS.categoryMatch,
    matchedTags: tagsA.filter(t => new Set(tagsB).has(t)),
    sameCategory,
  };
}

function getRecommendedContent(participated, allContents, limit = 5) {
  const participatedIds = new Set(participated.map(c => c.id));
  const unparticipated = allContents.filter(c => !participatedIds.has(c.id));

  if (participated.length === 0) return [];

  const scored = unparticipated.map(content => {
    const similarities = participated.map(p => calculateContentSimilarity(p, content));
    const maxSim = Math.max(...similarities.map(s => s.score));
    const avgSim = similarities.reduce((sum, s) => sum + s.score, 0) / similarities.length;
    const combinedScore = maxSim * 0.7 + avgSim * 0.3;
    const bestMatch = similarities.reduce((a, b) => a.score > b.score ? a : b);

    return { content, score: combinedScore, ...bestMatch };
  });

  return scored
    .filter(item => item.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ============================================================================
// 테스트 데이터 로드
// ============================================================================

console.log('========================================');
console.log('추천 시스템 실제 데이터 테스트');
console.log('========================================\n');

// 실제 퀴즈 데이터를 시뮬레이션하기 위해 tags 추가한 샘플 생성
const sampleQuizzes = [
  // 고양이 퀴즈
  { id: 'cat-k-001', category: 'cat', question: '고양이 꼬리 신호', tags: ['고양이', '행동', '꼬리', '신호'] },
  { id: 'cat-k-002', category: 'cat', question: '고양이 위험 음식', tags: ['고양이', '음식', '건강', '위험'] },
  { id: 'cat-k-003', category: 'cat', question: '골골송 이유', tags: ['고양이', '소리', '행동', '치유'] },
  { id: 'cat-k-004', category: 'cat', question: '물 섭취량', tags: ['고양이', '건강', '물', '섭취'] },
  { id: 'cat-k-005', category: 'cat', question: '화장실 법칙', tags: ['고양이', '화장실', '스트레스', '다묘'] },
  { id: 'cat-k-006', category: 'cat', question: '슬로우 블링크', tags: ['고양이', '행동', '애정', '눈'] },

  // 강아지 퀴즈
  { id: 'dog-k-001', category: 'dog', question: '강아지 꼬리 흔들기', tags: ['강아지', '행동', '꼬리', '신호'] },
  { id: 'dog-k-002', category: 'dog', question: '강아지 간식', tags: ['강아지', '음식', '간식', '건강'] },
  { id: 'dog-k-003', category: 'dog', question: '산책 시간', tags: ['강아지', '산책', '운동', '건강'] },
  { id: 'dog-k-004', category: 'dog', question: '훈련 방법', tags: ['강아지', '훈련', '명령', '보상'] },

  // 토끼 퀴즈
  { id: 'rabbit-k-001', category: 'rabbit', question: '토끼 발 쿵쿵', tags: ['토끼', '행동', '경계', '소리'] },
  { id: 'rabbit-k-002', category: 'rabbit', question: '토끼 먹이', tags: ['토끼', '음식', '건초', '채소'] },

  // 식물 퀴즈
  { id: 'plant-k-001', category: 'plant', question: '물주기 주기', tags: ['식물', '물주기', '관리', '건강'] },
  { id: 'plant-k-002', category: 'plant', question: '햇빛 양', tags: ['식물', '햇빛', '성장', '관리'] },
];

console.log(`총 퀴즈: ${sampleQuizzes.length}개\n`);

// ============================================================================
// 테스트 시나리오 1: 고양이 퀴즈 참여자
// ============================================================================

console.log('--- 시나리오 1: 고양이 퀴즈 참여자 ---\n');

const catUser = sampleQuizzes.filter(q => q.category === 'cat').slice(0, 2); // cat-k-001, cat-k-002 참여
console.log('참여한 퀴즈:', catUser.map(q => `${q.id} (${q.question})`).join(', '));

const catRecommendations = getRecommendedContent(catUser, sampleQuizzes, 5);

console.log('\n추천 결과:');
catRecommendations.forEach((rec, i) => {
  const tags = rec.matchedTags.length > 0 ? rec.matchedTags.join(', ') : '없음';
  console.log(`  ${i + 1}. ${rec.content.id} (${rec.content.category})`);
  console.log(`     점수: ${rec.score.toFixed(3)}, 태그일치: [${tags}], 같은카테고리: ${rec.sameCategory}`);
});

// ============================================================================
// 테스트 시나리오 2: 강아지 퀴즈 참여자
// ============================================================================

console.log('\n--- 시나리오 2: 강아지 퀴즈 참여자 ---\n');

const dogUser = sampleQuizzes.filter(q => q.category === 'dog').slice(0, 2); // dog-k-001, dog-k-002 참여
console.log('참여한 퀴즈:', dogUser.map(q => `${q.id} (${q.question})`).join(', '));

const dogRecommendations = getRecommendedContent(dogUser, sampleQuizzes, 5);

console.log('\n추천 결과:');
dogRecommendations.forEach((rec, i) => {
  const tags = rec.matchedTags.length > 0 ? rec.matchedTags.join(', ') : '없음';
  console.log(`  ${i + 1}. ${rec.content.id} (${rec.content.category})`);
  console.log(`     점수: ${rec.score.toFixed(3)}, 태그일치: [${tags}], 같은카테고리: ${rec.sameCategory}`);
});

// ============================================================================
// 테스트 시나리오 3: 크로스 카테고리 (건강 관심)
// ============================================================================

console.log('\n--- 시나리오 3: "건강" 태그 관심자 ---\n');

const healthUser = sampleQuizzes.filter(q => q.tags.includes('건강')).slice(0, 2);
console.log('참여한 퀴즈:', healthUser.map(q => `${q.id} (${q.tags.join(',')})`).join('\n              '));

const healthRecommendations = getRecommendedContent(healthUser, sampleQuizzes, 5);

console.log('\n추천 결과:');
healthRecommendations.forEach((rec, i) => {
  const tags = rec.matchedTags.length > 0 ? rec.matchedTags.join(', ') : '없음';
  console.log(`  ${i + 1}. ${rec.content.id} (${rec.content.category})`);
  console.log(`     점수: ${rec.score.toFixed(3)}, 태그일치: [${tags}], 같은카테고리: ${rec.sameCategory}`);
});

// ============================================================================
// 테스트 시나리오 4: 행동 관심자 (크로스 카테고리)
// ============================================================================

console.log('\n--- 시나리오 4: "행동" 태그 관심자 ---\n');

const behaviorUser = sampleQuizzes.filter(q => q.tags.includes('행동')).slice(0, 2);
console.log('참여한 퀴즈:', behaviorUser.map(q => `${q.id} (${q.tags.join(',')})`).join('\n              '));

const behaviorRecommendations = getRecommendedContent(behaviorUser, sampleQuizzes, 5);

console.log('\n추천 결과:');
behaviorRecommendations.forEach((rec, i) => {
  const tags = rec.matchedTags.length > 0 ? rec.matchedTags.join(', ') : '없음';
  console.log(`  ${i + 1}. ${rec.content.id} (${rec.content.category})`);
  console.log(`     점수: ${rec.score.toFixed(3)}, 태그일치: [${tags}], 같은카테고리: ${rec.sameCategory}`);
});

// ============================================================================
// 분석: 태그 효과
// ============================================================================

console.log('\n========================================');
console.log('분석: 태그 vs 카테고리 효과');
console.log('========================================\n');

// 같은 카테고리 vs 다른 카테고리지만 태그 일치
const catQuiz = sampleQuizzes.find(q => q.id === 'cat-k-001'); // 고양이, 행동, 꼬리, 신호
const dogQuizSimilarTags = sampleQuizzes.find(q => q.id === 'dog-k-001'); // 강아지, 행동, 꼬리, 신호
const catQuizDifferentTags = sampleQuizzes.find(q => q.id === 'cat-k-004'); // 고양이, 건강, 물, 섭취

console.log('기준: cat-k-001 (고양이 꼬리 신호)');
console.log(`  tags: [${catQuiz.tags.join(', ')}]\n`);

const simSameCategory = calculateContentSimilarity(catQuiz, catQuizDifferentTags);
const simDiffCategorySameTags = calculateContentSimilarity(catQuiz, dogQuizSimilarTags);

console.log('비교 1: cat-k-004 (같은 카테고리, 다른 태그)');
console.log(`  tags: [${catQuizDifferentTags.tags.join(', ')}]`);
console.log(`  유사도: ${simSameCategory.score.toFixed(3)}`);
console.log(`  → 카테고리 보너스(0.3)만 적용\n`);

console.log('비교 2: dog-k-001 (다른 카테고리, 비슷한 태그)');
console.log(`  tags: [${dogQuizSimilarTags.tags.join(', ')}]`);
console.log(`  유사도: ${simDiffCategorySameTags.score.toFixed(3)}`);
console.log(`  매칭 태그: [${simDiffCategorySameTags.matchedTags.join(', ')}]`);
console.log(`  → 태그 유사도(${(calculateJaccardSimilarity(catQuiz.tags, dogQuizSimilarTags.tags) * 0.7).toFixed(3)}) 적용\n`);

console.log('결론: 태그가 비슷하면 다른 카테고리도 추천됨!');
console.log('      "꼬리", "행동", "신호" 관심 있으면 강아지 퀴즈도 추천');

// ============================================================================
// 현재 데이터 tags 상태 확인
// ============================================================================

console.log('\n========================================');
console.log('현재 실제 데이터 tags 상태');
console.log('========================================\n');

// 실제 파일에서 tags 확인
const catKnowledgePath = join(projectRoot, 'src', 'data', 'content', 'quizzes', 'cat-knowledge.ts');
const catKnowledgeContent = readFileSync(catKnowledgePath, 'utf-8');
const hasTagsInCat = catKnowledgeContent.includes('tags:');

console.log(`cat-knowledge.ts: ${hasTagsInCat ? '✅ tags 있음' : '❌ tags 없음'}`);

const vsPollsPath = join(projectRoot, 'src', 'data', 'content', 'polls', 'vs-polls.ts');
const vsPollsContent = readFileSync(vsPollsPath, 'utf-8');
const hasTagsInPolls = vsPollsContent.includes('tags:');

console.log(`vs-polls.ts: ${hasTagsInPolls ? '✅ tags 있음' : '❌ tags 없음'}`);

if (!hasTagsInCat || !hasTagsInPolls) {
  console.log('\n⚠️  기존 콘텐츠에 tags 추가 필요!');
  console.log('   추천 시스템이 제대로 작동하려면 각 콘텐츠에 tags가 필요합니다.');
}

console.log('\n========================================');
console.log('테스트 완료');
console.log('========================================');
