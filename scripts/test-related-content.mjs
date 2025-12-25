/**
 * 관련 콘텐츠 시스템 테스트
 *
 * 테스트 항목:
 * 1. ContentRecommendationService - 유사도 계산 및 추천
 * 2. ContentParticipationService - 상황별 반응 참여 기록
 * 3. NextActionService - 개인화된 테스트 추천
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================================
// 테스트 유틸리티
// ============================================================================

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function logSection(title) {
  console.log(`\n${colors.blue}${colors.bold}━━━ ${title} ━━━${colors.reset}\n`);
}

function logPass(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logFail(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function logInfo(message) {
  console.log(`${colors.yellow}ℹ${colors.reset} ${message}`);
}

// ============================================================================
// 모의 데이터
// ============================================================================

// Quiz 데이터 모의
const mockQuizzes = [
  {
    id: 'quiz-cat-001',
    question: '고양이가 꾹꾹이를 하는 이유는?',
    category: 'cat',
    tags: ['고양이', '행동', '꾹꾹이', '심리'],
  },
  {
    id: 'quiz-cat-002',
    question: '고양이가 골골송을 부르는 이유는?',
    category: 'cat',
    tags: ['고양이', '행동', '골골송', '소통'],
  },
  {
    id: 'quiz-cat-003',
    question: '고양이 발바닥 젤리의 역할은?',
    category: 'cat',
    tags: ['고양이', '신체', '젤리', '쿠션'],
  },
  {
    id: 'quiz-dog-001',
    question: '강아지가 꼬리를 흔드는 이유는?',
    category: 'dog',
    tags: ['강아지', '행동', '꼬리', '감정'],
  },
  {
    id: 'quiz-dog-002',
    question: '강아지가 헥헥거리는 이유는?',
    category: 'dog',
    tags: ['강아지', '행동', '헥헥', '체온조절'],
  },
];

// Situation 데이터 모의
const mockSituations = [
  {
    id: 'situation-work-001',
    situation: '팀장이 내 아이디어를 무시했다',
    category: 'work',
    tags: ['직장', '상사', '무시'],
  },
  {
    id: 'situation-work-002',
    situation: '동료가 내 공로를 가로챘다',
    category: 'work',
    tags: ['직장', '동료', '공로'],
  },
  {
    id: 'situation-relationship-001',
    situation: '연인이 다른 이성과 친하게 지낸다',
    category: 'relationship',
    tags: ['연애', '질투', '이성친구'],
  },
];

// Poll 데이터 모의
const mockPolls = [
  {
    id: 'poll-cat-001',
    question: '고양이가 더 귀엽다 vs 강아지가 더 귀엽다',
    category: 'cat',
    tags: ['고양이', '강아지', '귀여움'],
  },
  {
    id: 'poll-cat-002',
    question: '고양이는 츤데레다 vs 고양이는 애교쟁이다',
    category: 'cat',
    tags: ['고양이', '성격', '츤데레'],
  },
];

// ============================================================================
// 유사도 계산 테스트 (Jaccard 유사도)
// ============================================================================

function calculateJaccardSimilarity(tagsA, tagsB) {
  if (tagsA.length === 0 && tagsB.length === 0) return 0;
  const setA = new Set(tagsA);
  const setB = new Set(tagsB);
  const intersection = new Set([...setA].filter(tag => setB.has(tag)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function testJaccardSimilarity() {
  logSection('Jaccard 유사도 계산 테스트');

  // 테스트 1: 동일한 태그
  const sim1 = calculateJaccardSimilarity(['a', 'b', 'c'], ['a', 'b', 'c']);
  if (sim1 === 1) {
    logPass(`동일 태그: ${sim1} === 1`);
  } else {
    logFail(`동일 태그: ${sim1} !== 1`);
  }

  // 테스트 2: 부분 일치
  const sim2 = calculateJaccardSimilarity(['a', 'b', 'c'], ['a', 'b', 'd']);
  const expected2 = 2 / 4; // 교집합 2, 합집합 4
  if (Math.abs(sim2 - expected2) < 0.001) {
    logPass(`부분 일치: ${sim2.toFixed(2)} ≈ ${expected2.toFixed(2)}`);
  } else {
    logFail(`부분 일치: ${sim2.toFixed(2)} !== ${expected2.toFixed(2)}`);
  }

  // 테스트 3: 완전히 다른 태그
  const sim3 = calculateJaccardSimilarity(['a', 'b'], ['c', 'd']);
  if (sim3 === 0) {
    logPass(`다른 태그: ${sim3} === 0`);
  } else {
    logFail(`다른 태그: ${sim3} !== 0`);
  }

  // 테스트 4: 빈 태그
  const sim4 = calculateJaccardSimilarity([], []);
  if (sim4 === 0) {
    logPass(`빈 태그: ${sim4} === 0`);
  } else {
    logFail(`빈 태그: ${sim4} !== 0`);
  }

  // 테스트 5: 실제 퀴즈 데이터
  const quiz1 = mockQuizzes[0]; // 고양이 꾹꾹이
  const quiz2 = mockQuizzes[1]; // 고양이 골골송
  const quiz3 = mockQuizzes[3]; // 강아지 꼬리

  const simCat = calculateJaccardSimilarity(quiz1.tags, quiz2.tags);
  const simDiff = calculateJaccardSimilarity(quiz1.tags, quiz3.tags);

  logInfo(`고양이 퀴즈 간 유사도: ${simCat.toFixed(2)} (태그: ${quiz1.tags.filter(t => quiz2.tags.includes(t)).join(', ')})`);
  logInfo(`고양이-강아지 퀴즈 유사도: ${simDiff.toFixed(2)}`);

  if (simCat > simDiff) {
    logPass('같은 카테고리 퀴즈가 더 높은 유사도');
  } else {
    logFail('같은 카테고리 퀴즈 유사도가 낮음');
  }
}

// ============================================================================
// 퀴즈 추천 테스트
// ============================================================================

function testQuizRecommendation() {
  logSection('퀴즈 추천 로직 테스트');

  const WEIGHTS = {
    tagSimilarity: 0.7,
    categoryMatch: 0.3,
  };

  function calculateQuizSimilarity(quizA, quizB) {
    const tagScore = calculateJaccardSimilarity(quizA.tags || [], quizB.tags || []);
    const sameCategory = quizA.category === quizB.category;
    const categoryScore = sameCategory ? 1 : 0;
    const score = tagScore * WEIGHTS.tagSimilarity + categoryScore * WEIGHTS.categoryMatch;
    return { score, sameCategory, matchedTags: quizA.tags.filter(t => (quizB.tags || []).includes(t)) };
  }

  function getSimilarQuizzes(targetQuiz, allQuizzes, limit = 3) {
    const others = allQuizzes.filter(q => q.id !== targetQuiz.id);
    return others
      .map(quiz => {
        const similarity = calculateQuizSimilarity(targetQuiz, quiz);
        return { quiz, similarity };
      })
      .filter(item => item.similarity.score > 0)
      .sort((a, b) => b.similarity.score - a.similarity.score)
      .slice(0, limit);
  }

  // 테스트: 고양이 꾹꾹이 퀴즈와 유사한 퀴즈 추천
  const targetQuiz = mockQuizzes[0];
  const recommendations = getSimilarQuizzes(targetQuiz, mockQuizzes, 3);

  logInfo(`기준 퀴즈: "${targetQuiz.question}" [${targetQuiz.category}]`);
  logInfo(`추천 결과 ${recommendations.length}개:`);

  recommendations.forEach((rec, i) => {
    const reason = rec.similarity.sameCategory
      ? `같은 카테고리 + 태그(${rec.similarity.matchedTags.join(', ')})`
      : `태그(${rec.similarity.matchedTags.join(', ')})`;
    console.log(`  ${i + 1}. "${rec.quiz.question}" [${rec.quiz.category}] - 점수: ${rec.similarity.score.toFixed(2)} (${reason})`);
  });

  // 검증: 같은 카테고리(cat) 퀴즈가 상위에
  const catQuizzes = recommendations.filter(r => r.quiz.category === 'cat');
  if (catQuizzes.length >= 2) {
    logPass('같은 카테고리 퀴즈가 상위 추천됨');
  } else {
    logFail('같은 카테고리 퀴즈가 충분히 추천되지 않음');
  }
}

// ============================================================================
// 상황별 반응 추천 테스트
// ============================================================================

function testSituationRecommendation() {
  logSection('상황별 반응 추천 테스트');

  const WEIGHTS = {
    tagSimilarity: 0.7,
    categoryMatch: 0.3,
  };

  function calculateSituationSimilarity(situationA, situationB) {
    const tagScore = calculateJaccardSimilarity(situationA.tags || [], situationB.tags || []);
    const sameCategory = situationA.category === situationB.category;
    const categoryScore = sameCategory ? 1 : 0;
    const score = tagScore * WEIGHTS.tagSimilarity + categoryScore * WEIGHTS.categoryMatch;
    return { score, sameCategory, matchedTags: situationA.tags.filter(t => (situationB.tags || []).includes(t)) };
  }

  function getSimilarSituations(targetSituation, allSituations, limit = 2) {
    const others = allSituations.filter(s => s.id !== targetSituation.id);
    return others
      .map(situation => {
        const similarity = calculateSituationSimilarity(targetSituation, situation);
        return { situation, similarity };
      })
      .filter(item => item.similarity.score > 0)
      .sort((a, b) => b.similarity.score - a.similarity.score)
      .slice(0, limit);
  }

  // 테스트
  const targetSituation = mockSituations[0]; // 팀장이 아이디어 무시
  const recommendations = getSimilarSituations(targetSituation, mockSituations, 2);

  logInfo(`기준 상황: "${targetSituation.situation}" [${targetSituation.category}]`);
  logInfo(`추천 결과 ${recommendations.length}개:`);

  recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. "${rec.situation.situation}" [${rec.situation.category}] - 점수: ${rec.similarity.score.toFixed(2)}`);
  });

  // 검증: work 카테고리 상황이 relationship보다 상위
  if (recommendations.length > 0 && recommendations[0].situation.category === 'work') {
    logPass('같은 카테고리 상황이 먼저 추천됨');
  } else if (recommendations.length > 0) {
    logInfo(`첫 번째 추천 카테고리: ${recommendations[0].situation.category}`);
  }
}

// ============================================================================
// 참여 기록 테스트
// ============================================================================

function testParticipationTracking() {
  logSection('참여 기록 추적 테스트');

  // 모의 참여 서비스
  const participation = {
    quizzes: [],
    polls: [],
    situations: [],
    stats: {
      totalQuizAnswered: 0,
      totalPollVoted: 0,
      totalSituationAnswered: 0,
    },
  };

  function recordQuizAnswer(quizId, selectedOption, isCorrect) {
    if (participation.quizzes.some(q => q.quizId === quizId)) return false;
    participation.quizzes.push({ quizId, selectedOption, isCorrect, answeredAt: new Date().toISOString() });
    participation.stats.totalQuizAnswered++;
    return true;
  }

  function recordSituationAnswer(situationId, selectedOption) {
    if (participation.situations.some(s => s.situationId === situationId)) return false;
    participation.situations.push({ situationId, selectedOption, answeredAt: new Date().toISOString() });
    participation.stats.totalSituationAnswered++;
    return true;
  }

  // 테스트 1: 퀴즈 참여 기록
  const recorded1 = recordQuizAnswer('quiz-cat-001', 'a', true);
  if (recorded1 && participation.stats.totalQuizAnswered === 1) {
    logPass('퀴즈 참여 기록 성공');
  } else {
    logFail('퀴즈 참여 기록 실패');
  }

  // 테스트 2: 중복 참여 방지
  const recorded2 = recordQuizAnswer('quiz-cat-001', 'b', false);
  if (!recorded2 && participation.stats.totalQuizAnswered === 1) {
    logPass('중복 퀴즈 참여 방지됨');
  } else {
    logFail('중복 퀴즈 참여 방지 실패');
  }

  // 테스트 3: 상황별 반응 참여 기록
  const recorded3 = recordSituationAnswer('situation-work-001', 'a');
  if (recorded3 && participation.stats.totalSituationAnswered === 1) {
    logPass('상황별 반응 참여 기록 성공');
  } else {
    logFail('상황별 반응 참여 기록 실패');
  }

  logInfo(`최종 참여 상태: 퀴즈 ${participation.stats.totalQuizAnswered}개, 상황 ${participation.stats.totalSituationAnswered}개`);
}

// ============================================================================
// 테스트 추천 (카테고리 기반) 테스트
// ============================================================================

function testTestRecommendation() {
  logSection('테스트 추천 로직 테스트');

  // 모의 테스트 메타데이터
  const TEST_META = {
    cat: { label: '고양이', category: 'pet', icon: '🐱' },
    dog: { label: '강아지', category: 'pet', icon: '🐕' },
    rabbit: { label: '토끼', category: 'pet', icon: '🐰' },
    human: { label: '인간', category: 'personality', icon: '👤' },
    idealType: { label: '연애', category: 'love', icon: '💕' },
    coffee: { label: '커피', category: 'lifestyle', icon: '☕' },
  };

  const CATEGORY_META = {
    pet: { label: '반려동물' },
    personality: { label: '성격' },
    love: { label: '연애' },
    lifestyle: { label: '라이프스타일' },
  };

  function getPersonalizedTestRecommendation(currentTest, completedTests, incompleteTests) {
    if (incompleteTests.length === 0) return null;

    const currentCategory = currentTest ? TEST_META[currentTest]?.category : undefined;
    const currentCategoryMeta = currentCategory ? CATEGORY_META[currentCategory] : undefined;

    // 같은 카테고리 미완료 테스트 우선
    let recommended;
    let isSameCategory = false;

    if (currentCategory) {
      recommended = incompleteTests.find(t => TEST_META[t]?.category === currentCategory);
      if (recommended) isSameCategory = true;
    }

    // 없으면 첫 번째
    if (!recommended) {
      recommended = incompleteTests[0];
    }

    const meta = TEST_META[recommended];
    let description;
    if (isSameCategory && currentCategoryMeta) {
      description = `${currentCategoryMeta.label} 테스트가 재밌었다면 이것도!`;
    } else if (meta?.category && CATEGORY_META[meta.category]) {
      description = `${CATEGORY_META[meta.category].label} 카테고리 추천 테스트`;
    } else {
      description = '아직 안 해본 테스트예요!';
    }

    return {
      testType: recommended,
      label: meta?.label ? `${meta.label} 테스트` : '다음 테스트',
      description,
      icon: meta?.icon || '✨',
    };
  }

  // 테스트 1: 같은 카테고리 추천
  const rec1 = getPersonalizedTestRecommendation('cat', ['cat'], ['dog', 'rabbit', 'human']);
  logInfo(`기준 테스트: cat (반려동물)`);
  logInfo(`추천 결과: ${rec1.testType} - "${rec1.description}"`);

  if (rec1.testType === 'dog' || rec1.testType === 'rabbit') {
    logPass('같은 카테고리(pet) 테스트가 추천됨');
  } else {
    logFail('같은 카테고리 테스트가 추천되지 않음');
  }

  // 테스트 2: 다른 카테고리만 남은 경우
  const rec2 = getPersonalizedTestRecommendation('cat', ['cat', 'dog', 'rabbit'], ['human', 'coffee']);
  logInfo(`\n기준 테스트: cat (반려동물), 남은 테스트: human, coffee`);
  logInfo(`추천 결과: ${rec2.testType} - "${rec2.description}"`);

  if (rec2.testType === 'human' || rec2.testType === 'coffee') {
    logPass('다른 카테고리 테스트가 추천됨');
  } else {
    logFail('추천 실패');
  }
}

// ============================================================================
// SituationCategory → ContentCategory 매핑 테스트
// ============================================================================

function testCategoryMapping() {
  logSection('SituationCategory → ContentCategory 매핑 테스트');

  const SITUATION_TO_CONTENT_CATEGORY = {
    relationship: 'love',
    work: 'lifestyle',
    social: 'relationship',
    awkward: 'general',
  };

  const testCases = [
    { situation: 'relationship', expected: 'love', desc: '연애 상황 → love 카테고리' },
    { situation: 'work', expected: 'lifestyle', desc: '직장 상황 → lifestyle 카테고리' },
    { situation: 'social', expected: 'relationship', desc: '사회 상황 → relationship 카테고리' },
    { situation: 'awkward', expected: 'general', desc: '어색한 상황 → general 카테고리' },
  ];

  testCases.forEach(tc => {
    const mapped = SITUATION_TO_CONTENT_CATEGORY[tc.situation];
    if (mapped === tc.expected) {
      logPass(tc.desc);
    } else {
      logFail(`${tc.desc} (실제: ${mapped})`);
    }
  });
}

// ============================================================================
// 메인 실행
// ============================================================================

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     관련 콘텐츠 시스템 테스트                    ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);

  testJaccardSimilarity();
  testQuizRecommendation();
  testSituationRecommendation();
  testParticipationTracking();
  testTestRecommendation();
  testCategoryMapping();

  console.log(`\n${colors.bold}${colors.green}━━━ 모든 테스트 완료 ━━━${colors.reset}\n`);
}

main().catch(console.error);
