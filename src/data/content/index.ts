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

// Situation Reactions (상황별 반응 투표)
export * from './situation-reactions';
export { getRandomSituationReaction } from './situation-reactions';

// Community (게시판용)
export * from './community';

// Explore (팁, Q&A, 투표, 퀴즈, 토론)
export * from './explore';

// Fortune (운세 콘텐츠)
export * from './fortune';

// 통합 통계
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from './quizzes';
import { VS_POLLS } from './polls';
import { ALL_SITUATION_REACTIONS } from './situation-reactions';
import { ZODIAC_FORTUNES_2025, ZODIAC_POLLS, CONSTELLATIONS, ALL_DAILY_MESSAGES, LUCKY_TIPS } from './fortune';
import type { ContentCategory, SituationCategory } from './types';

export const CONTENT_STATS = {
  knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.length,
  scenarioQuizzes: ALL_SCENARIO_QUIZZES.length,
  vsPolls: VS_POLLS.length,
  situationReactions: ALL_SITUATION_REACTIONS.length,
  zodiacFortunes: ZODIAC_FORTUNES_2025.length,
  zodiacPolls: ZODIAC_POLLS.length,
  constellations: CONSTELLATIONS.length,
  dailyMessages: ALL_DAILY_MESSAGES.length,
  luckyTips: LUCKY_TIPS.length,
  total: ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length + VS_POLLS.length + ALL_SITUATION_REACTIONS.length + ZODIAC_FORTUNES_2025.length + ZODIAC_POLLS.length + CONSTELLATIONS.length + ALL_DAILY_MESSAGES.length + LUCKY_TIPS.length,
};

// 카테고리별 콘텐츠 수 조회
export function getContentCountByCategory(category: ContentCategory) {
  return {
    knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === category).length,
    scenarioQuizzes: ALL_SCENARIO_QUIZZES.filter(q => q.category === category).length,
    vsPolls: VS_POLLS.filter(p => p.category === category).length,
  };
}

// 상황별 반응 카테고리별 수 조회
export function getSituationReactionCountByCategory(category: SituationCategory) {
  return ALL_SITUATION_REACTIONS.filter(sr => sr.category === category).length;
}
