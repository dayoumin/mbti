// ============================================================================
// 퀴즈 데이터 통합 Export
// ============================================================================
//
// 새 퀴즈 추가 방법:
// 1. {category}-knowledge.ts 또는 {category}-scenario.ts 파일 생성
// 2. 아래 QUIZ_REGISTRY에 한 줄 추가 (import + 등록 + export 자동)
// ============================================================================

import type { ContentCategory, KnowledgeQuiz, ScenarioQuiz } from '../types';

// --- 지식 퀴즈 import ---
import { CAT_KNOWLEDGE_QUIZZES } from './cat-knowledge';
import { DOG_KNOWLEDGE_QUIZZES } from './dog-knowledge';
import { RABBIT_KNOWLEDGE_QUIZZES } from './rabbit-knowledge';
import { HAMSTER_KNOWLEDGE_QUIZZES } from './hamster-knowledge';
import { PLANT_KNOWLEDGE_QUIZZES } from './plant-knowledge';
import { COFFEE_KNOWLEDGE_QUIZZES } from './coffee-knowledge';
import { KIDS_ANIMAL_QUIZZES } from './kids-animals';
import { LOVE_KNOWLEDGE_QUIZZES } from './love-knowledge';
import { FISH_KNOWLEDGE_QUIZZES } from './fish-knowledge';
import { TAROT_KNOWLEDGE_QUIZZES } from './tarot-quizzes';
import { SMALLPET_KNOWLEDGE_QUIZZES } from './smallPet-knowledge';
import { BIRD_KNOWLEDGE_QUIZZES } from './bird-knowledge';
import { REPTILE_KNOWLEDGE_QUIZZES } from './reptile-knowledge';
import { SEASONAL_QUIZZES, CHRISTMAS_QUIZZES, NEWYEAR_QUIZZES } from './seasonal-quizzes';
import { WINE_KNOWLEDGE_QUIZZES } from './wine-knowledge';
import { NOSTALGIA_KNOWLEDGE_QUIZZES } from './nostalgia-knowledge';

// --- 시나리오 퀴즈 import ---
import { CAT_SCENARIO_QUIZZES } from './cat-scenario';
import { DOG_SCENARIO_QUIZZES } from './dog-scenario';
import { RABBIT_SCENARIO_QUIZZES } from './rabbit-scenario';
import { BLOODTYPE_SCENARIO_QUIZZES } from './bloodtype-scenario';

// ============================================================================
// 퀴즈 레지스트리 (단일 등록 - 여기에만 추가하면 됨)
// ============================================================================

const KNOWLEDGE_QUIZ_REGISTRY: KnowledgeQuiz[][] = [
  CAT_KNOWLEDGE_QUIZZES,
  DOG_KNOWLEDGE_QUIZZES,
  RABBIT_KNOWLEDGE_QUIZZES,
  HAMSTER_KNOWLEDGE_QUIZZES,
  PLANT_KNOWLEDGE_QUIZZES,
  COFFEE_KNOWLEDGE_QUIZZES,
  KIDS_ANIMAL_QUIZZES,
  LOVE_KNOWLEDGE_QUIZZES,
  FISH_KNOWLEDGE_QUIZZES,
  TAROT_KNOWLEDGE_QUIZZES,
  SMALLPET_KNOWLEDGE_QUIZZES,
  BIRD_KNOWLEDGE_QUIZZES,
  REPTILE_KNOWLEDGE_QUIZZES,
  SEASONAL_QUIZZES,
  WINE_KNOWLEDGE_QUIZZES,
  NOSTALGIA_KNOWLEDGE_QUIZZES,
];

const SCENARIO_QUIZ_REGISTRY: ScenarioQuiz[][] = [
  CAT_SCENARIO_QUIZZES,
  DOG_SCENARIO_QUIZZES,
  RABBIT_SCENARIO_QUIZZES,
  BLOODTYPE_SCENARIO_QUIZZES,
  // 새 시나리오 퀴즈는 여기에 추가
];

// ============================================================================
// 통합 배열 (자동 생성)
// ============================================================================

export const ALL_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = KNOWLEDGE_QUIZ_REGISTRY.flat();
export const ALL_SCENARIO_QUIZZES: ScenarioQuiz[] = SCENARIO_QUIZ_REGISTRY.flat();

// 개별 퀴즈 배열도 export (필요시 직접 접근용)
export { CAT_KNOWLEDGE_QUIZZES } from './cat-knowledge';
export { DOG_KNOWLEDGE_QUIZZES } from './dog-knowledge';
export { RABBIT_KNOWLEDGE_QUIZZES } from './rabbit-knowledge';
export { HAMSTER_KNOWLEDGE_QUIZZES } from './hamster-knowledge';
export { PLANT_KNOWLEDGE_QUIZZES } from './plant-knowledge';
export { COFFEE_KNOWLEDGE_QUIZZES } from './coffee-knowledge';
export { KIDS_ANIMAL_QUIZZES } from './kids-animals';
export { LOVE_KNOWLEDGE_QUIZZES } from './love-knowledge';
export { FISH_KNOWLEDGE_QUIZZES } from './fish-knowledge';
export { TAROT_KNOWLEDGE_QUIZZES, TAROT_QUIZZES } from './tarot-quizzes';
export { SMALLPET_KNOWLEDGE_QUIZZES } from './smallPet-knowledge';
export { BIRD_KNOWLEDGE_QUIZZES } from './bird-knowledge';
export { REPTILE_KNOWLEDGE_QUIZZES } from './reptile-knowledge';
export { SEASONAL_QUIZZES, CHRISTMAS_QUIZZES, NEWYEAR_QUIZZES, createNewYearQuizzes } from './seasonal-quizzes';
export { WINE_KNOWLEDGE_QUIZZES } from './wine-knowledge';
export { NOSTALGIA_KNOWLEDGE_QUIZZES } from './nostalgia-knowledge';
export { CAT_SCENARIO_QUIZZES } from './cat-scenario';
export { DOG_SCENARIO_QUIZZES } from './dog-scenario';
export { RABBIT_SCENARIO_QUIZZES } from './rabbit-scenario';
export { BLOODTYPE_SCENARIO_QUIZZES } from './bloodtype-scenario';

// ============================================================================
// 조회 함수
// ============================================================================

/** 카테고리별 퀴즈 조회 */
export function getQuizzesByCategory(category: ContentCategory) {
  return {
    knowledge: ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category),
    scenario: ALL_SCENARIO_QUIZZES.filter(q => q.category === category),
  };
}

/** 랜덤 지식 퀴즈 선택 */
export function getRandomQuiz(category?: ContentCategory): KnowledgeQuiz | undefined {
  const filtered = category
    ? ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category)
    : ALL_KNOWLEDGE_QUIZZES;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/** 랜덤 시나리오 퀴즈 선택 */
export function getRandomScenarioQuiz(category?: ContentCategory): ScenarioQuiz | undefined {
  const filtered = category
    ? ALL_SCENARIO_QUIZZES.filter(q => q.category === category)
    : ALL_SCENARIO_QUIZZES;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// ============================================================================
// 검증 함수
// ============================================================================

/** 지식 퀴즈 검증 */
export function validateKnowledgeQuiz(quiz: KnowledgeQuiz): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 정답 개수 확인
  const correctCount = quiz.options.filter(o => o.isCorrect).length;
  if (correctCount !== 1) {
    errors.push(`정답이 ${correctCount}개 (1개여야 함)`);
  }

  // 옵션 개수 확인
  if (quiz.options.length < 2 || quiz.options.length > 5) {
    errors.push(`옵션이 ${quiz.options.length}개 (2-5개 권장)`);
  }

  // ID 중복은 validateAllQuizzes에서 체크

  return { valid: errors.length === 0, errors };
}

/** 시나리오 퀴즈 점수 범위 검증 */
export function validateScenarioQuizScores(quiz: ScenarioQuiz): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxPossibleScore = quiz.questions.reduce((sum: number, q) => {
    const maxOption = Math.max(...q.options.map(o => o.points));
    return sum + maxOption;
  }, 0);
  const minPossibleScore = quiz.questions.reduce((sum: number, q) => {
    const minOption = Math.min(...q.options.map(o => o.points));
    return sum + minOption;
  }, 0);

  // 결과 범위가 실제 점수 범위를 커버하는지 확인
  const resultMin = Math.min(...quiz.results.map(r => r.minScore));
  const resultMax = Math.max(...quiz.results.map(r => r.maxScore));

  if (resultMin > minPossibleScore) {
    errors.push(`최저 결과 범위(${resultMin})가 최저 가능 점수(${minPossibleScore})보다 높음`);
  }
  if (resultMax < maxPossibleScore) {
    errors.push(`최고 결과 범위(${resultMax})가 최고 가능 점수(${maxPossibleScore})보다 낮음`);
  }

  // 결과 범위 간 갭 확인
  const sortedResults = [...quiz.results].sort((a, b) => a.minScore - b.minScore);
  for (let i = 0; i < sortedResults.length - 1; i++) {
    const current = sortedResults[i];
    const next = sortedResults[i + 1];
    if (current.maxScore + 1 !== next.minScore && current.maxScore !== next.minScore - 1) {
      if (current.maxScore >= next.minScore) {
        errors.push(`결과 범위 겹침: ${current.grade}(~${current.maxScore}) vs ${next.grade}(${next.minScore}~)`);
      } else {
        errors.push(`결과 범위 갭: ${current.maxScore + 1} ~ ${next.minScore - 1} 점수에 해당하는 결과 없음`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/** 전체 퀴즈 검증 (ID 중복 체크 포함) */
export function validateAllQuizzes(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // ID 중복 체크 - 지식 퀴즈
  const knowledgeIds = new Set<string>();
  ALL_KNOWLEDGE_QUIZZES.forEach(q => {
    if (knowledgeIds.has(q.id)) {
      errors.push(`지식 퀴즈 ID 중복: ${q.id}`);
    }
    knowledgeIds.add(q.id);
  });

  // ID 중복 체크 - 시나리오 퀴즈
  const scenarioIds = new Set<string>();
  ALL_SCENARIO_QUIZZES.forEach(q => {
    if (scenarioIds.has(q.id)) {
      errors.push(`시나리오 퀴즈 ID 중복: ${q.id}`);
    }
    scenarioIds.add(q.id);
  });

  // 개별 퀴즈 검증
  ALL_KNOWLEDGE_QUIZZES.forEach(q => {
    const result = validateKnowledgeQuiz(q);
    if (!result.valid) {
      errors.push(`[${q.id}] ${result.errors.join(', ')}`);
    }
  });

  ALL_SCENARIO_QUIZZES.forEach(q => {
    const result = validateScenarioQuizScores(q);
    if (!result.valid) {
      errors.push(`[${q.id}] ${result.errors.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// 통계
// ============================================================================

export const QUIZ_STATS = {
  knowledge: {
    total: ALL_KNOWLEDGE_QUIZZES.length,
    byCategory: () => {
      const counts: Record<string, number> = {};
      ALL_KNOWLEDGE_QUIZZES.forEach(q => {
        counts[q.category] = (counts[q.category] || 0) + 1;
      });
      return counts as Partial<Record<ContentCategory, number>>;
    },
  },
  scenario: {
    total: ALL_SCENARIO_QUIZZES.length,
    byCategory: () => {
      const counts: Record<string, number> = {};
      ALL_SCENARIO_QUIZZES.forEach(q => {
        counts[q.category] = (counts[q.category] || 0) + 1;
      });
      return counts as Partial<Record<ContentCategory, number>>;
    },
  },
};
