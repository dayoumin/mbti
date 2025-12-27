// ============================================================================
// 콘텐츠 통계 계산 로직 (재사용 가능)
// ============================================================================

import { CHEMI_DATA } from '@/data';
import { SUBJECT_CONFIG } from '@/data/config';
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';
import { ALL_SITUATION_REACTIONS } from '@/data/content/situation-reactions';
import {
  ZODIAC_FORTUNES_2025,
  ZODIAC_POLLS,
  CONSTELLATIONS,
  ALL_DAILY_MESSAGES,
  LUCKY_TIPS
} from '@/data/content/fortune';
import { getTotalStats, getQuickWins, getHighPriorityIdeas } from './idea-bank';

export interface ContentStats {
  tests: {
    total: number;
    personality: number;
    matching: number;
  };
  content: {
    quizzes: number;
    knowledgeQuizzes: number;
    scenarioQuizzes: number;
    polls: number;
    vsPolls: number;
    choicePolls: number;
    situations: number;
    fortune: number;
  };
  ideas: {
    total: number;
    themes: number;
    veryHighViral: number;
    highPriority: number;
    quickWins: number;
    completed: number;
    inProgress: number;
  };
  totals: {
    implemented: number;
    planned: number;
    all: number;
  };
}

/**
 * 전체 콘텐츠 통계 계산
 * - 테스트, 퀴즈, 투표, 상황반응, 운세, 아이디어 뱅크 집계
 * - ContentStatusDashboard, OverviewSummary 등에서 재사용
 */
export function getContentStats(): ContentStats {
  // 1. 테스트 통계
  const testKeys = Object.keys(CHEMI_DATA) as (keyof typeof SUBJECT_CONFIG)[];
  const personalityTests = testKeys.filter(k => SUBJECT_CONFIG[k]?.testType === 'personality');
  const matchingTests = testKeys.filter(k => SUBJECT_CONFIG[k]?.testType === 'matching');

  // 2. 콘텐츠 통계
  const totalQuizzes = ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length;
  const totalPolls = VS_POLLS.length + CHOICE_POLLS.length;
  const totalSituations = ALL_SITUATION_REACTIONS.length;
  const totalFortune = ZODIAC_FORTUNES_2025.length + ZODIAC_POLLS.length + CONSTELLATIONS.length + ALL_DAILY_MESSAGES.length + LUCKY_TIPS.length;

  // 3. 아이디어 통계
  const ideaStats = getTotalStats();
  const quickWins = getQuickWins();
  const highPriority = getHighPriorityIdeas();

  // 4. 전체 합계
  const totalImplemented = testKeys.length + totalQuizzes + totalPolls + totalSituations + totalFortune;
  const totalIdeas = ideaStats.totalIdeas;

  return {
    tests: {
      total: testKeys.length,
      personality: personalityTests.length,
      matching: matchingTests.length,
    },
    content: {
      quizzes: totalQuizzes,
      knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.length,
      scenarioQuizzes: ALL_SCENARIO_QUIZZES.length,
      polls: totalPolls,
      vsPolls: VS_POLLS.length,
      choicePolls: CHOICE_POLLS.length,
      situations: totalSituations,
      fortune: totalFortune,
    },
    ideas: {
      total: ideaStats.totalIdeas,
      themes: ideaStats.totalThemes,
      veryHighViral: ideaStats.veryHighViralIdeas,
      highPriority: ideaStats.highPriorityIdeas,
      quickWins: quickWins.length,
      completed: ideaStats.completed,
      inProgress: ideaStats.inProgress,
    },
    totals: {
      implemented: totalImplemented,
      planned: totalIdeas,
      all: totalImplemented + totalIdeas,
    },
  };
}
