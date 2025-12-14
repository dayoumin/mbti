// ============================================================================
// 콘텐츠 데이터 통합 Export
// ============================================================================

// Types
export * from './types';

// Quizzes
export * from './quizzes';
export { getRandomQuiz } from './quizzes';

// Polls
export * from './polls';
export { getRandomPoll } from './polls';

// 통합 통계
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from './quizzes';
import { VS_POLLS } from './polls/vs-polls';
import type { ContentCategory } from './types';

export const CONTENT_STATS = {
  knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.length,
  scenarioQuizzes: ALL_SCENARIO_QUIZZES.length,
  vsPolls: VS_POLLS.length,
  total: ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length + VS_POLLS.length,
};

// 카테고리별 콘텐츠 수 조회
export function getContentCountByCategory(category: ContentCategory) {
  return {
    knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category).length,
    scenarioQuizzes: ALL_SCENARIO_QUIZZES.filter(q => q.category === category).length,
    vsPolls: VS_POLLS.filter(p => p.category === category).length,
  };
}
