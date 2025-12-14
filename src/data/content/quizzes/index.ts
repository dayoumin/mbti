// ============================================================================
// 퀴즈 데이터 통합 Export
// ============================================================================

// 지식 퀴즈
export { CAT_KNOWLEDGE_QUIZZES } from './cat-knowledge';
export { DOG_KNOWLEDGE_QUIZZES } from './dog-knowledge';

// 시나리오 퀴즈
export { CAT_SCENARIO_QUIZZES } from './cat-scenario';
export { DOG_SCENARIO_QUIZZES } from './dog-scenario';

// 통합 데이터
import { CAT_KNOWLEDGE_QUIZZES } from './cat-knowledge';
import { DOG_KNOWLEDGE_QUIZZES } from './dog-knowledge';
import { CAT_SCENARIO_QUIZZES } from './cat-scenario';
import { DOG_SCENARIO_QUIZZES } from './dog-scenario';
import type { ContentCategory, KnowledgeQuiz, ScenarioQuiz } from '../types';

export const ALL_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  ...CAT_KNOWLEDGE_QUIZZES,
  ...DOG_KNOWLEDGE_QUIZZES,
];

export const ALL_SCENARIO_QUIZZES: ScenarioQuiz[] = [
  ...CAT_SCENARIO_QUIZZES,
  ...DOG_SCENARIO_QUIZZES,
];

// 카테고리별 퀴즈 조회
export function getQuizzesByCategory(category: ContentCategory) {
  return {
    knowledge: ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category),
    scenario: ALL_SCENARIO_QUIZZES.filter(q => q.category === category),
  };
}

// 랜덤 퀴즈 선택 (빈 배열이면 undefined 반환)
export function getRandomQuiz(category?: ContentCategory): KnowledgeQuiz | undefined {
  const filtered = category
    ? ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category)
    : ALL_KNOWLEDGE_QUIZZES;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// 시나리오 퀴즈 점수 범위 검증
export function validateScenarioQuizScores(quiz: ScenarioQuiz): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxPossibleScore = quiz.questions.reduce((sum, q) => {
    const maxOption = Math.max(...q.options.map(o => o.points));
    return sum + maxOption;
  }, 0);
  const minPossibleScore = quiz.questions.reduce((sum, q) => {
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
